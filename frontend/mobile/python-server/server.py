#!/usr/bin/env python3
"""
统一服务管理器
合并API代理服务器和短信服务到一个应用中
通过配置参数启用/禁用不同的服务

Usage: python server.py
"""

import hashlib
import hmac
import base64
import urllib.parse
from datetime import datetime
import uuid
import requests
import json
import logging
import re
import threading
import time
import os
from flask import Flask, request, Response, session
from typing import Dict, List, Optional

from qcloudsms_py import SmsSingleSender
from qcloudsms_py.httpclient import HTTPError

from config import SERVICE_CONFIG, API_PROXY_CONFIG, SMS_SERVICE_CONFIG, VERIFICATION_CODE_CONFIG, LOG_CONFIG, DATABASE_CONFIG, SECURITY_CONFIG
from verification_code_manager import verification_code_manager
from sqlite_handler import SQLiteHandler, RequestContextFilter
from db_manager import get_db_manager

# 初始化Flask应用
app = Flask(__name__)

# 2. 强制关闭 ASCII 编码
app.config['JSON_AS_ASCII'] = False

# 3. 强制使用 UTF-8 编码（gunicorn 环境必须加！）
app.config['JSONIFY_MIMETYPE'] = 'application/json; charset=utf-8'

# 4. 手动指定 json 编码器（彻底解决）
app.json.ensure_ascii = False
app.json.sort_keys = False
# 设置会话密钥
app.secret_key = os.urandom(24)

# 超级管理员手机号
SUPER_ADMIN_PHONE = '13651895278'
SUPER_ADMIN_PASSWORD = 'ar1978@#!'

import functools

def require_super_admin(func):
    """
    要求超级管理员权限的装饰器
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # 检查用户是否登录
        if 'user' not in session:
            return Response(json.dumps({"error": "未登录"}, ensure_ascii=False), status=401, mimetype='application/json')
        
        # 检查是否是超级管理员
        user = session['user']
        if not user.get('is_super_admin', False):
            return Response(json.dumps({"error": "权限不足，需要超级管理员权限"}, ensure_ascii=False), status=403, mimetype='application/json')
        
        return func(*args, **kwargs)
    return wrapper

# 配置日志
logging.basicConfig(
    level=getattr(logging, LOG_CONFIG['level']),
    format=LOG_CONFIG['format'],
    filename=LOG_CONFIG['file']
)
logger = logging.getLogger(__name__)

# 如果启用了SQLite日志，添加SQLite处理器
if LOG_CONFIG['enable_sqlite']:
    sqlite_handler = SQLiteHandler(DATABASE_CONFIG['db_path'])
    sqlite_handler.setFormatter(logging.Formatter(LOG_CONFIG['format']))
    logger.addHandler(sqlite_handler)
    logger.info(f"SQLite日志系统已启用，数据库路径: {DATABASE_CONFIG['db_path']}")


class ApiSigner:
    """API签名工具类"""
    
    @staticmethod
    def md5_base64(data: str) -> str:
        """Generate MD5 base64 hash of data."""
        if not data:
            return ""
        md5 = hashlib.md5()
        md5.update(data.encode('utf-8'))
        return base64.b64encode(md5.digest()).decode('utf-8')

    @staticmethod
    def hmac_sha256_base64(data: str, secret: str) -> str:
        """Generate HMAC SHA256 base64 signature."""
        hmac_obj = hmac.new(secret.encode('utf-8'), data.encode('utf-8'), hashlib.sha256)
        return base64.b64encode(hmac_obj.digest()).decode('utf-8')

    @staticmethod
    def canonicalize_url(full_url: str, content_type: str, body: str) -> str:
        """Canonicalize URL for signing."""
        try:
            parsed = urllib.parse.urlparse(full_url)
            path = parsed.path
            params = {}

            if parsed.query:
                for k, v in urllib.parse.parse_qs(parsed.query, keep_blank_values=True).items():
                    params[k] = v

            if content_type and content_type.startswith('application/x-www-form-urlencoded') and body:
                for k, v in urllib.parse.parse_qs(body, keep_blank_values=True).items():
                    params[k] = v

            if not params:
                return path

            sorted_keys = sorted(params.keys())
            query_parts = []
            for key in sorted_keys:
                for value in params[key]:
                    if value:
                        query_parts.append(f"{key}={value}")
                    else:
                        query_parts.append(key)

            if not query_parts:
                return path
            else:
                return f"{path}?{'&'.join(query_parts)}"
        except Exception as e:
            raise RuntimeError(f"canonicalize_url failed: {e}")

    @staticmethod
    def sign_request(method: str, url: str, body: str, original_headers: Dict[str, str],
                    app_key: str, app_secret: str, headers_to_sign: Optional[List[str]] = None) -> Dict[str, str]:
        """Generate signature headers for the request."""
        accept = original_headers.get('Accept', '')
        content_type = original_headers.get('Content-Type', '')

        md5 = ""
        if body and not content_type.startswith('application/x-www-form-urlencoded'):
            md5 = ApiSigner.md5_base64(body)

        timestamp = str(int(datetime.now().timestamp() * 1000))
        nonce = str(uuid.uuid4())

        canonical_url = ApiSigner.canonicalize_url(url, content_type, body)

        if method in ['POST', 'PUT', 'PATCH'] and md5:
            text_to_sign = f"{method}\n{accept}\n{md5}\n{content_type}"
        else:
            text_to_sign = f"{method}\n{accept}\n{content_type}"

        headers_map = {}
        for name, value in original_headers.items():
            name_lower = name.lower()
            if name_lower.startswith('x-ca-'):
                if name_lower not in ['x-ca-signature', 'x-ca-signature-headers', 'x-ca-key', 'x-ca-nonce']:
                    headers_map[name] = value
        headers_map['x-ca-key'] = app_key
        headers_map['x-ca-timestamp'] = timestamp

        sorted_header_keys = sorted(headers_map.keys())
        signature_headers_list = []
        for header_name in sorted_header_keys:
            header_value = headers_map[header_name]
            text_to_sign += f"\n{header_name}:{header_value}"
            signature_headers_list.append(header_name)

        text_to_sign += f"\n{canonical_url}"

        logger.debug(f"Canonical URL: {canonical_url}")
        logger.debug(f"Text to sign: {text_to_sign.replace(chr(10), '#')}")

        signature = ApiSigner.hmac_sha256_base64(text_to_sign, app_secret)

        headers_to_add = {
            'x-ca-key': app_key,
            'x-ca-timestamp': timestamp,
            'x-ca-nonce': nonce,
            'x-ca-signature': signature,
        }

        if md5:
            headers_to_add['Content-MD5'] = md5

        if signature_headers_list:
            headers_to_add['x-ca-signature-headers'] = ','.join(signature_headers_list)

        return headers_to_add


# 自定义HTTP客户端，修复json.loads()的encoding参数问题
class CustomHTTPClient:
    def fetch(self, req):
        import re
        import json
        import sys
        import socket
        from http import client as httplib
        from urllib import parse as urlparse
        
        class CustomHTTPResponse:
            def __init__(self, request, code, body, headers=None, reason=None):
                self.request = request
                self.code = code
                self.body = body
                self.headers = headers
                self.reason = reason or httplib.responses.get(code, "Unknown")
            
            def ok(self):
                if self.code == 200 or self.code == "200":
                    return True
                return False
            
            def json(self):
                # 修复：移除encoding参数
                if sys.version_info >= (3, ):
                    return json.loads(self.body.decode("utf-8"))
                return json.loads(self.body)
        
        result = urlparse.urlparse(req.url)
        host, port = (result.hostname, result.port)
        
        if result.scheme == "https":
            conn = httplib.HTTPSConnection(host, port=port, timeout=60)
        else:
            conn = httplib.HTTPConnection(host, port=port, timeout=60)
        
        try:
            conn.request(
                req.method,
                "{}?{}".format(result.path, result.query),
                body=req.body,
                headers=req.headers
            )
            response = conn.getresponse()
            res = CustomHTTPResponse(
                request=req,
                code=response.status,
                body=response.read(),
                headers=dict(response.getheaders()),
                reason=response.reason
            )
        except socket.gaierror:
            raise
        except OSError:
            raise
        finally:
            conn.close()
        return res

class SmsService:
    """短信服务类"""
    
    def __init__(self):
        self.app_id = SMS_SERVICE_CONFIG['app_id']
        self.app_key = SMS_SERVICE_CONFIG['app_key']
        self.template_id = SMS_SERVICE_CONFIG['template_id']
        self.sign_name = SMS_SERVICE_CONFIG['sign_name']
        
        try:
            # 使用自定义HTTP客户端
            self.custom_http_client = CustomHTTPClient()
            self.sms_sender = SmsSingleSender(self.app_id, self.app_key, httpclient=self.custom_http_client)
            logger.info("短信发送器初始化成功")
        except Exception as e:
            logger.error(f"短信发送器初始化失败: {e}")
            self.sms_sender = None
            self.custom_http_client = None
    
    def generate_verification_code(self, length=6):
        """生成随机验证码"""
        return verification_code_manager.generate_code(length)
    
    def send_verification_code(self, phone_number, code):
        """发送验证码短信"""
        if not self.sms_sender:
            return {
                "success": False,
                "message": "短信发送器未初始化"
            }
        
        try:
            params = [code]
            
            result = self.sms_sender.send_with_param(
                86,
                phone_number,
                self.template_id,
                params,
                sign=self.sign_name,
                extend="",
                ext=""
            )
            
            # 检查腾讯云返回的结果
            if result.get('result') == 0:
                logger.info(f"发送验证码成功: {result}")
                return {
                    "success": True,
                    "message": "验证码发送成功",
                    "data": result,
                    "code": code
                }
            else:
                logger.warning(f"发送验证码失败: {result}")
                return {
                    "success": False,
                    "message": f"发送失败: {result.get('errmsg')}",
                    "data": result
                }
            
        except HTTPError as e:
            logger.error(f"HTTP错误: {e}")
            return {
                "success": False,
                "message": f"HTTP错误: {e}"
            }
        except Exception as e:
            logger.error(f"发送验证码失败: {e}")
            return {
                "success": False,
                "message": f"发送验证码失败: {e}"
            }
    
    def send_login_verification(self, phone_number):
        """发送登录验证码"""
        if not verification_code_manager.can_send_code(phone_number, VERIFICATION_CODE_CONFIG['rate_limit']):
            return {
                "success": False,
                "message": f"请{VERIFICATION_CODE_CONFIG['rate_limit']}秒后再试"
            }
        
        code = self.generate_verification_code(VERIFICATION_CODE_CONFIG['length'])
        result = self.send_verification_code(phone_number, code)
        
        if result["success"]:
            verification_code_manager.store_code(
                phone_number, 
                code, 
                VERIFICATION_CODE_CONFIG['expiration']
            )
            result["code"] = code
        
        return result

# 初始化服务
sms_service = SmsService() if SERVICE_CONFIG['enable_sms_service'] else None

# API代理配置
TARGET_BASE_URL = API_PROXY_CONFIG['target_base_url']
APP_KEY = API_PROXY_CONFIG['app_key']
APP_SECRET = API_PROXY_CONFIG['app_secret']

# 数据库管理器
db_manager = get_db_manager(DATABASE_CONFIG['db_path'])


@app.route('/health', methods=['GET'])
def health_check():
    """统一健康检查接口"""
    try:
        # 添加上下文信息
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        
        # 创建带有上下文的日志记录
        health_logger = logging.getLogger('health')
        health_logger.addFilter(RequestContextFilter(ip_address, user_agent))
        health_logger.info("健康检查请求")
        
        response = {
            "status": "healthy",
            "service": "unified-server",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "api_proxy": SERVICE_CONFIG['enable_api_proxy'],
                "sms_service": SERVICE_CONFIG['enable_sms_service'],
                "sqlite_log": LOG_CONFIG['enable_sqlite']
            }
        }
        return Response(json.dumps(response), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        response = {
            "status": "unhealthy",
            "service": "unified-server",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        return Response(json.dumps(response), status=500, mimetype='application/json')


@app.route('/services', methods=['GET'])
def get_services_status():
    """获取服务状态接口"""
    try:
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        
        status_logger = logging.getLogger('services')
        status_logger.addFilter(RequestContextFilter(ip_address, user_agent))
        status_logger.info("服务状态查询")
        
        return Response(json.dumps({
            "api_proxy": SERVICE_CONFIG['enable_api_proxy'],
            "sms_service": SERVICE_CONFIG['enable_sms_service'],
            "sqlite_log": LOG_CONFIG['enable_sqlite'],
            "timestamp": datetime.now().isoformat()
        }), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f"Get services status failed: {e}")
        return Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')


# 日志管理接口
@app.route('/api/logs', methods=['GET'])
@require_super_admin
def get_logs():
    """获取日志记录"""
    try:
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        
        log_logger = logging.getLogger('logs')
        log_logger.addFilter(RequestContextFilter(ip_address, user_agent))
        log_logger.info("日志查询请求")
        
        # 获取查询参数
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        level = request.args.get('level')
        service = request.args.get('service')
        
        # 获取日志
        logs = db_manager.get_logs(limit=limit, offset=offset, level=level, service=service)
        
        # 获取统计信息
        stats = db_manager.get_log_stats()
        
        return Response(json.dumps({
            "logs": logs,
            "stats": stats,
            "total": len(logs)
        }), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f"Get logs failed: {e}")
        return Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')


@app.route('/api/logs/stats', methods=['GET'])
@require_super_admin
def get_log_stats():
    """获取日志统计信息"""
    try:
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        
        log_logger = logging.getLogger('logs')
        log_logger.addFilter(RequestContextFilter(ip_address, user_agent))
        log_logger.info("日志统计查询")
        
        stats = db_manager.get_log_stats()
        return Response(json.dumps(stats), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f"Get log stats failed: {e}")
        return Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')


@app.route('/api/logs/cleanup', methods=['POST'])
@require_super_admin
def cleanup_logs():
    """清理旧日志"""
    try:
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        
        log_logger = logging.getLogger('logs')
        log_logger.addFilter(RequestContextFilter(ip_address, user_agent))
        log_logger.info("清理旧日志请求")
        
        # 获取清理天数
        data = request.get_json() or {}
        days = int(data.get('days', DATABASE_CONFIG['auto_cleanup_days']))
        
        # 清理日志
        deleted_count = db_manager.delete_old_logs(days=days)
        
        return Response(json.dumps({
            "message": f"成功清理{deleted_count}条旧日志",
            "deleted_count": deleted_count
        }), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f"Cleanup logs failed: {e}")
        return Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')


# API代理服务路由
if SERVICE_CONFIG['enable_api_proxy']:
    @app.route('/login', methods=['POST'])
    def login():
        """Login endpoint"""
        try:
            ip_address = request.remote_addr
            user_agent = request.headers.get('User-Agent')
            
            login_logger = logging.getLogger('login')
            login_logger.addFilter(RequestContextFilter(ip_address, user_agent))
            login_logger.info("登录请求")
            
            payload = request.get_json(silent=True) or {}
            phone = payload.get('phone')
            password = payload.get('password')
            verification_code = payload.get('verification_code')
            
            if not phone:
                return Response(json.dumps({"error": "缺少 phone 参数"}, ensure_ascii=False), status=400, mimetype='application/json')
            
            if not password and not verification_code:
                return Response(json.dumps({"error": "缺少 password 或 verification_code 参数"}, ensure_ascii=False), status=400, mimetype='application/json')

            staff_path = 'artemis/api/v1/staff'
            target_url = urllib.parse.urljoin(TARGET_BASE_URL, staff_path)
            internal_body = json.dumps({"phone": phone, "pageSize": 20, "pageNum": 1}, ensure_ascii=False)

            headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'appKey': APP_KEY}
            signature_headers = ApiSigner.sign_request('POST', target_url, internal_body, headers, APP_KEY, APP_SECRET)
            request_headers = {**headers, **signature_headers}

            login_logger.info(f"Querying staff API {target_url} with phone={phone}")

            resp = requests.post(target_url, headers=request_headers, data=internal_body, verify=False, timeout=30)

            try:
                resp_json = resp.json()
            except Exception:
                login_logger.error(f"Failed to parse staff API response as JSON: {resp.text}")
                return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

            users = None
            if isinstance(resp_json, dict):
                data_obj = resp_json.get('data') if isinstance(resp_json.get('data'), dict) else None
                if data_obj and isinstance(data_obj.get('list'), list):
                    users = data_obj.get('list')
                else:
                    for key in ('data', 'result', 'records', 'list', 'items'):
                        if key in resp_json and resp_json[key]:
                            users = resp_json[key]
                            break
                    if users is None:
                        for v in resp_json.values():
                            if isinstance(v, list) and v:
                                users = v
                                break
            elif isinstance(resp_json, list):
                users = resp_json

            if not users:
                return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

            if isinstance(users, dict):
                users = [users]

            if len(users) == 0:
                return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

            matching_user = None
            for u in users:
                if not isinstance(u, dict):
                    continue
                u_phone = u.get('phone')
                if u_phone is None:
                    continue
                if str(u_phone) == str(phone):
                    matching_user = u
                    break

            # 检查是否是超级管理员
            if phone == SUPER_ADMIN_PHONE:
                # 超级管理员特殊处理
                if password and password == SUPER_ADMIN_PASSWORD:
                    # 超级管理员密码正确
                    login_logger.info(f"超级管理员登录成功: {phone}")
                    
                    # 通过API代理查询真实的用户信息
                    staff_path = 'artemis/api/v1/staff'
                    target_url = urllib.parse.urljoin(TARGET_BASE_URL, staff_path)
                    internal_body = json.dumps({"phone": phone, "pageSize": 20, "pageNum": 1}, ensure_ascii=False)

                    headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'appKey': APP_KEY}
                    signature_headers = ApiSigner.sign_request('POST', target_url, internal_body, headers, APP_KEY, APP_SECRET)
                    request_headers = {**headers, **signature_headers}

                    login_logger.info(f"Querying staff API {target_url} with phone={phone} for super admin")

                    resp = requests.post(target_url, headers=request_headers, data=internal_body, verify=False, timeout=30)

                    real_user_info = {"phone": phone, "name": "超级管理员", "userId": "1"}
                    
                    try:
                        resp_json = resp.json()
                        if isinstance(resp_json, dict):
                            data_obj = resp_json.get('data') if isinstance(resp_json.get('data'), dict) else None
                            if data_obj and isinstance(data_obj.get('list'), list):
                                users = data_obj.get('list')
                                if users:
                                    for u in users:
                                        if isinstance(u, dict) and str(u.get('phone')) == str(phone):
                                            real_user_info = u
                                            break
                    except Exception as e:
                        login_logger.error(f"Failed to parse staff API response for super admin: {e}")
                    
                    # 存储用户信息到会话
                    session['user'] = {
                        'phone': phone,
                        'is_super_admin': True
                    }
                    return Response(json.dumps({"message": "登录成功", "user": real_user_info}, ensure_ascii=False), status=200, mimetype='application/json')
                elif verification_code:
                    # 超级管理员使用验证码登录
                    pass  # 继续正常的验证码验证流程
                else:
                    # 超级管理员密码错误
                    error_info = verification_code_manager.record_password_error(phone)
                    login_logger.warning(f"超级管理员密码错误: {phone}, {error_info['message']}")
                    return Response(json.dumps({"error": error_info['message']}, ensure_ascii=False), status=401, mimetype='application/json')
            
            if matching_user is None:
                return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

            user = matching_user

            # 检查账户是否被锁定
            if verification_code_manager.is_account_locked(phone):
                login_logger.warning(f"账户已被锁定: {phone}")
                lock_duration = SECURITY_CONFIG['account_lock_duration']
                return Response(json.dumps({"error": f"账户已被锁定，请{lock_duration}分钟后再试"}, ensure_ascii=False), status=403, mimetype='application/json')

            if verification_code:
                login_logger.info(f"Using verification code login for {phone}")
                # 验证验证码有效性
                is_valid = verification_code_manager.verify_code(phone, verification_code)
                if not is_valid:
                    login_logger.warning(f"验证码验证失败: {phone}")
                    return Response(json.dumps({"error": "验证码错误"}, ensure_ascii=False), status=401, mimetype='application/json')
                login_logger.info(f"验证码验证成功: {phone}")
                # 验证码登录成功，重置密码错误次数并解锁账户
                verification_code_manager.reset_password_errors(phone)
                verification_code_manager.unlock_account(phone)
            else:
                # 检查是否需要验证码
                need_verification = verification_code_manager.check_password_error_limit(phone)
                if need_verification:
                    login_logger.info(f"密码错误次数过多，需要验证码: {phone}")
                    return Response(json.dumps({"error": "密码错误次数过多，请使用验证码登录"}, ensure_ascii=False), status=401, mimetype='application/json')
                
                stored_pwd = None
                if isinstance(user, dict):
                    for key in ('password', 'passwd', 'pwd', 'passWord'):
                        if key in user:
                            stored_pwd = user[key]
                            break

                if stored_pwd is None:
                    return Response(json.dumps({"error": "无法验证用户密码"}, ensure_ascii=False), status=502, mimetype='application/json')

                if str(password) != str(stored_pwd):
                    # 记录密码错误
                    error_info = verification_code_manager.record_password_error(phone)
                    login_logger.warning(f"密码错误: {phone}, {error_info['message']}")
                    return Response(json.dumps({"error": error_info['message']}, ensure_ascii=False), status=401, mimetype='application/json')
                else:
                    # 密码正确，重置错误次数并解锁账户
                    verification_code_manager.reset_password_errors(phone)
                    verification_code_manager.unlock_account(phone)

            login_logger.info(f"登录成功: {phone}")
            # 存储用户信息到会话
            session['user'] = {
                'phone': phone,
                'is_super_admin': phone == '13651895278'
            }
            return Response(json.dumps({"message": "登录成功", "user": user}, ensure_ascii=False), status=200, mimetype='application/json')

        except Exception as e:
            import traceback
            logger.error(f"[LOGIN] Exception: {e}")
            logger.error(f"[LOGIN] Traceback: {traceback.format_exc()}")
            return Response(json.dumps({"error": "Proxy login error", "message": str(e)}), status=500, mimetype='application/json')

    @app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
    @app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
    def proxy(path):
        """Proxy all requests to the target server with signing."""
        try:
            ip_address = request.remote_addr
            user_agent = request.headers.get('User-Agent')
            
            proxy_logger = logging.getLogger('proxy')
            proxy_logger.addFilter(RequestContextFilter(ip_address, user_agent))
            proxy_logger.info(f"Proxy request: {request.method} {request.url}")

            if path and path.strip('/').lower().endswith('login'):
                return login()

            if path is not None and path.strip('/') == 'login':
                target_url = urllib.parse.urljoin(TARGET_BASE_URL, 'login')
            else:
                target_url = urllib.parse.urljoin(TARGET_BASE_URL, path)

            if request.query_string:
                target_url += '?' + request.query_string.decode('utf-8')

            proxy_logger.info(f"Target URL: {target_url}")

            body = request.get_data(as_text=True) if request.method in ['POST', 'PUT', 'PATCH'] else None

            headers = dict(request.headers)
            headers.pop('Host', None)
            headers['appKey'] = APP_KEY

            if body and 'Content-Type' not in headers:
                headers['Content-Type'] = 'application/json'

            signature_headers = ApiSigner.sign_request(
                request.method,
                target_url,
                body or "",
                headers,
                APP_KEY,
                APP_SECRET
            )

            request_headers = {**headers, **signature_headers}

            response = requests.request(
                request.method,
                target_url,
                headers=request_headers,
                data=body,
                verify=False,
                timeout=30
            )

            proxy_logger.info(f"Response status: {response.status_code}")

            # 构建响应头，排除可能导致编码问题的头
            response_headers = {}
            for name, value in response.headers.items():
                # 排除可能导致编码问题的头
                if name.lower() not in ['content-encoding', 'content-length', 'transfer-encoding', 'connection']:
                    response_headers[name] = value

            proxy_response = Response(
                response.content,
                status=response.status_code,
                headers=response_headers
            )

            hop_by_hop_headers = [
                'connection', 'keep-alive', 'proxy-authenticate',
                'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade'
            ]
            for header in hop_by_hop_headers:
                proxy_response.headers.pop(header, None)

            return proxy_response

        except Exception as e:
            logger.error(f"Proxy error: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response(
                json.dumps({"error": "Proxy error", "message": str(e)}),
                status=500,
                mimetype='application/json'
            )


# 短信服务路由
if SERVICE_CONFIG['enable_sms_service']:
    @app.route('/sms/callback', methods=['POST'])
    def sms_callback():
        """短信回调接口"""
        try:
            ip_address = request.remote_addr
            user_agent = request.headers.get('User-Agent')
            
            sms_logger = logging.getLogger('sms')
            sms_logger.addFilter(RequestContextFilter(ip_address, user_agent))
            sms_logger.info("短信回调请求")
            
            callback_data = request.get_json()
            sms_logger.info(f"收到短信回调: {callback_data}")
            
            # 处理回调数据可能是列表的情况
            if isinstance(callback_data, list):
                for item in callback_data:
                    if isinstance(item, dict):
                        phone_number = item.get('mobile', '')
                        status = 'SUCCESS' if item.get('report_status') == 'SUCCESS' else 'FAIL'
                        message_id = item.get('sid', '')
                        error_code = item.get('errmsg', '')
                        error_message = item.get('description', '')
                        
                        sms_logger.info(f"短信回调详情: 手机号={phone_number}, 状态={status}, 消息ID={message_id}")
                        
                        if status == 'SUCCESS':
                            sms_logger.info(f"短信发送成功: {phone_number}")
                        else:
                            sms_logger.warning(f"短信发送失败: {phone_number}, 错误码: {error_code}, 错误信息: {error_message}")
            else:
                # 处理回调数据是字典的情况
                phone_number = callback_data.get('phone', '')
                status = callback_data.get('status', '')
                message_id = callback_data.get('messageId', '')
                error_code = callback_data.get('errorCode', '')
                error_message = callback_data.get('errorMessage', '')
                
                sms_logger.info(f"短信回调详情: 手机号={phone_number}, 状态={status}, 消息ID={message_id}")
                
                if status == 'SUCCESS':
                    sms_logger.info(f"短信发送成功: {phone_number}")
                else:
                    sms_logger.warning(f"短信发送失败: {phone_number}, 错误码: {error_code}, 错误信息: {error_message}")
            
            return Response(json.dumps({"code": 0, "message": "success"}), status=200, mimetype='application/json')
            
        except Exception as e:
            logger.error(f"处理短信回调失败: {e}")
            return Response(json.dumps({"code": -1, "message": f"处理失败: {str(e)}"}), status=500, mimetype='application/json')

    @app.route('/sms/send', methods=['POST'])
    def sms_send():
        """发送验证码接口"""
        try:
            ip_address = request.remote_addr
            user_agent = request.headers.get('User-Agent')
            
            sms_logger = logging.getLogger('sms')
            sms_logger.addFilter(RequestContextFilter(ip_address, user_agent))
            sms_logger.info("发送验证码请求")
            
            request_data = request.get_json()
            phone_number = request_data.get('phone')
            
            if not phone_number:
                return Response(json.dumps({"code": -1, "message": "缺少手机号参数"}), status=400, mimetype='application/json')
            
            if not re.match(r'^1[3-9]\d{9}$', phone_number):
                return Response(json.dumps({"code": -1, "message": "手机号格式错误"}), status=400, mimetype='application/json')
            
            result = sms_service.send_login_verification(phone_number)
            
            sms_logger.info(f"验证码发送结果: {result}")
            
            # 根据配置决定是否返回验证码
            response_data = {
                "code": 0 if result["success"] else -1,
                "message": result["message"],
                "data": result.get("data")
            }
            
            # 只有当配置启用且发送成功时，才返回验证码
            if VERIFICATION_CODE_CONFIG['enable_response_code'] and result["success"]:
                response_data["verificationCode"] = result.get("code")
            
            return Response(json.dumps(response_data), status=200, mimetype='application/json')
            
        except Exception as e:
            logger.error(f"处理发送验证码请求失败: {e}")
            return Response(json.dumps({"code": -1, "message": f"处理失败: {str(e)}"}), status=500, mimetype='application/json')

    @app.route('/sms/verify', methods=['POST'])
    def sms_verify():
        """验证验证码接口"""
        try:
            ip_address = request.remote_addr
            user_agent = request.headers.get('User-Agent')
            
            sms_logger = logging.getLogger('sms')
            sms_logger.addFilter(RequestContextFilter(ip_address, user_agent))
            sms_logger.info("验证验证码请求")
            
            request_data = request.get_json()
            phone_number = request_data.get('phone')
            verification_code = request_data.get('code')
            
            if not phone_number:
                return Response(json.dumps({"code": -1, "message": "缺少手机号参数"}), status=400, mimetype='application/json')
            
            if not verification_code:
                return Response(json.dumps({"code": -1, "message": "缺少验证码参数"}), status=400, mimetype='application/json')
            
            if not re.match(r'^1[3-9]\d{9}$', phone_number):
                return Response(json.dumps({"code": -1, "message": "手机号格式错误"}), status=400, mimetype='application/json')
            
            if not re.match(r'^\d{6}$', verification_code):
                return Response(json.dumps({"code": -1, "message": "验证码格式错误"}), status=400, mimetype='application/json')
            
            is_valid = verification_code_manager.verify_code(phone_number, verification_code)
            sms_logger.info(f"验证验证码: 手机号={phone_number}, 验证码={verification_code}, 结果={is_valid}")
            
            return Response(json.dumps({
                "code": 0 if is_valid else -1,
                "message": "验证码验证成功" if is_valid else "验证码验证失败",
                "data": {"isValid": is_valid}
            }), status=200, mimetype='application/json')
            
        except Exception as e:
            logger.error(f"处理验证码验证请求失败: {e}")
            return Response(json.dumps({"code": -1, "message": f"处理失败: {str(e)}"}), status=500, mimetype='application/json')


def cleanup_expired_codes():
    """定期清理过期验证码"""
    while True:
        try:
            verification_code_manager.cleanup_expired_codes()
            time.sleep(60)
        except Exception as e:
            logger.error(f"清理过期验证码失败: {e}")
            time.sleep(60)


def cleanup_old_logs():
    """定期清理旧日志"""
    while True:
        try:
            if LOG_CONFIG['enable_sqlite'] and DATABASE_CONFIG['auto_cleanup_days'] > 0:
                deleted_count = db_manager.delete_old_logs(DATABASE_CONFIG['auto_cleanup_days'])
                if deleted_count > 0:
                    logger.info(f"自动清理了{deleted_count}条旧日志")
            time.sleep(86400)  # 每天检查一次
        except Exception as e:
            logger.error(f"清理旧日志失败: {e}")
            time.sleep(3600)  # 出错后1小时再尝试


if __name__ == '__main__':
    logger.info("Starting Unified Server")
    logger.info(f"API Proxy Service: {'Enabled' if SERVICE_CONFIG['enable_api_proxy'] else 'Disabled'}")
    logger.info(f"SMS Service: {'Enabled' if SERVICE_CONFIG['enable_sms_service'] else 'Disabled'}")
    logger.info(f"SQLite Log: {'Enabled' if LOG_CONFIG['enable_sqlite'] else 'Disabled'}")
    auto_cleanup_days = DATABASE_CONFIG['auto_cleanup_days']
    cleanup_status = 'Disabled' if auto_cleanup_days == 0 else f'Enabled ({auto_cleanup_days} days)'
    logger.info(f"Log Auto Cleanup: {cleanup_status}")
    logger.info(f"Server will run on http://{SERVICE_CONFIG['host']}:{SERVICE_CONFIG['port']}")
    logger.info("Press Ctrl+C to stop")
    
    # 启动清理过期验证码的线程
    if SERVICE_CONFIG['enable_sms_service']:
        cleanup_thread = threading.Thread(target=cleanup_expired_codes, daemon=True)
        cleanup_thread.start()
        logger.info("Started cleanup thread for expired verification codes")
    
    # 启动清理旧日志的线程
    if LOG_CONFIG['enable_sqlite']:
        log_cleanup_thread = threading.Thread(target=cleanup_old_logs, daemon=True)
        log_cleanup_thread.start()
        logger.info("Started cleanup thread for old logs")
    
    app.run(
        host=SERVICE_CONFIG['host'],
        port=SERVICE_CONFIG['port'],
        debug=SERVICE_CONFIG['debug'],
        threaded=True
    )
