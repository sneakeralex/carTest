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
from flask import Flask, request, Response
from typing import Dict, List, Optional

from qcloudsms_py import SmsSingleSender
from qcloudsms_py.httpclient import HTTPError

from config import SERVICE_CONFIG, API_PROXY_CONFIG, SMS_SERVICE_CONFIG, VERIFICATION_CODE_CONFIG, LOG_CONFIG
from verification_code_manager import verification_code_manager

# 配置日志
logging.basicConfig(
    level=getattr(logging, LOG_CONFIG['level']),
    format=LOG_CONFIG['format'],
    filename=LOG_CONFIG['file']
)
logger = logging.getLogger(__name__)


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


class SmsService:
    """短信服务类"""
    
    def __init__(self):
        self.app_id = SMS_SERVICE_CONFIG['app_id']
        self.app_key = SMS_SERVICE_CONFIG['app_key']
        self.template_id = SMS_SERVICE_CONFIG['template_id']
        self.sign_name = SMS_SERVICE_CONFIG['sign_name']
        
        try:
            self.sms_sender = SmsSingleSender(self.app_id, self.app_key)
            logger.info("短信发送器初始化成功")
        except Exception as e:
            logger.error(f"短信发送器初始化失败: {e}")
            self.sms_sender = None
    
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
            
            logger.info(f"发送验证码成功: {result}")
            return {
                "success": True,
                "message": "验证码发送成功",
                "data": result,
                "code": code
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


# 创建Flask应用
app = Flask(__name__)

# 初始化服务
sms_service = SmsService() if SERVICE_CONFIG['enable_sms_service'] else None

# API代理配置
TARGET_BASE_URL = API_PROXY_CONFIG['target_base_url']
APP_KEY = API_PROXY_CONFIG['app_key']
APP_SECRET = API_PROXY_CONFIG['app_secret']


@app.route('/health', methods=['GET'])
def health_check():
    """统一健康检查接口"""
    try:
        response = {
            "status": "healthy",
            "service": "unified-server",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "api_proxy": SERVICE_CONFIG['enable_api_proxy'],
                "sms_service": SERVICE_CONFIG['enable_sms_service']
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
    return Response(json.dumps({
        "api_proxy": SERVICE_CONFIG['enable_api_proxy'],
        "sms_service": SERVICE_CONFIG['enable_sms_service'],
        "timestamp": datetime.now().isoformat()
    }), status=200, mimetype='application/json')


# API代理服务路由
if SERVICE_CONFIG['enable_api_proxy']:
    @app.route('/login', methods=['POST'])
    def login():
        """Login endpoint"""
        try:
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

            logger.info(f"[LOGIN] Querying staff API {target_url} with phone={phone}")

            resp = requests.post(target_url, headers=request_headers, data=internal_body, verify=False, timeout=30)

            try:
                resp_json = resp.json()
            except Exception:
                logger.error(f"[LOGIN] Failed to parse staff API response as JSON: {resp.text}")
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

            if matching_user is None:
                return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

            user = matching_user

            if verification_code:
                logger.info(f"[LOGIN] Using verification code login for {phone}")
            else:
                stored_pwd = None
                if isinstance(user, dict):
                    for key in ('password', 'passwd', 'pwd', 'passWord'):
                        if key in user:
                            stored_pwd = user[key]
                            break

                if stored_pwd is None:
                    return Response(json.dumps({"error": "无法验证用户密码"}, ensure_ascii=False), status=502, mimetype='application/json')

                if str(password) != str(stored_pwd):
                    return Response(json.dumps({"error": "登录失败"}, ensure_ascii=False), status=401, mimetype='application/json')

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
            logger.info(f"Received {request.method} {request.url}")

            if path and path.strip('/').lower().endswith('login'):
                return login()

            if path is not None and path.strip('/') == 'login':
                target_url = urllib.parse.urljoin(TARGET_BASE_URL, 'login')
            else:
                target_url = urllib.parse.urljoin(TARGET_BASE_URL, path)

            if request.query_string:
                target_url += '?' + request.query_string.decode('utf-8')

            logger.info(f"Target URL: {target_url}")

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

            logger.info(f"Response status: {response.status_code}")

            proxy_response = Response(
                response.content,
                status=response.status_code,
                headers=dict(response.headers)
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
            callback_data = request.get_json()
            logger.info(f"收到短信回调: {callback_data}")
            
            phone_number = callback_data.get('phone', '')
            status = callback_data.get('status', '')
            message_id = callback_data.get('messageId', '')
            error_code = callback_data.get('errorCode', '')
            error_message = callback_data.get('errorMessage', '')
            
            logger.info(f"短信回调详情: 手机号={phone_number}, 状态={status}, 消息ID={message_id}")
            
            if status == 'SUCCESS':
                logger.info(f"短信发送成功: {phone_number}")
            else:
                logger.warning(f"短信发送失败: {phone_number}, 错误码: {error_code}, 错误信息: {error_message}")
            
            return Response(json.dumps({"code": 0, "message": "success"}), status=200, mimetype='application/json')
            
        except Exception as e:
            logger.error(f"处理短信回调失败: {e}")
            return Response(json.dumps({"code": -1, "message": f"处理失败: {str(e)}"}), status=500, mimetype='application/json')

    @app.route('/sms/send', methods=['POST'])
    def sms_send():
        """发送验证码接口"""
        try:
            request_data = request.get_json()
            phone_number = request_data.get('phone')
            
            if not phone_number:
                return Response(json.dumps({"code": -1, "message": "缺少手机号参数"}), status=400, mimetype='application/json')
            
            if not re.match(r'^1[3-9]\d{9}$', phone_number):
                return Response(json.dumps({"code": -1, "message": "手机号格式错误"}), status=400, mimetype='application/json')
            
            result = sms_service.send_login_verification(phone_number)
            
            return Response(json.dumps({
                "code": 0 if result["success"] else -1,
                "message": result["message"],
                "data": result.get("data"),
                "verificationCode": result.get("code")
            }), status=200, mimetype='application/json')
            
        except Exception as e:
            logger.error(f"处理发送验证码请求失败: {e}")
            return Response(json.dumps({"code": -1, "message": f"处理失败: {str(e)}"}), status=500, mimetype='application/json')

    @app.route('/sms/verify', methods=['POST'])
    def sms_verify():
        """验证验证码接口"""
        try:
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
            logger.info(f"验证验证码: 手机号={phone_number}, 验证码={verification_code}, 结果={is_valid}")
            
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


if __name__ == '__main__':
    logger.info("Starting Unified Server")
    logger.info(f"API Proxy Service: {'Enabled' if SERVICE_CONFIG['enable_api_proxy'] else 'Disabled'}")
    logger.info(f"SMS Service: {'Enabled' if SERVICE_CONFIG['enable_sms_service'] else 'Disabled'}")
    logger.info(f"Server will run on http://{SERVICE_CONFIG['host']}:{SERVICE_CONFIG['port']}")
    logger.info("Press Ctrl+C to stop")
    
    # 启动清理过期验证码的线程
    if SERVICE_CONFIG['enable_sms_service']:
        cleanup_thread = threading.Thread(target=cleanup_expired_codes, daemon=True)
        cleanup_thread.start()
        logger.info("Started cleanup thread for expired verification codes")
    
    app.run(
        host=SERVICE_CONFIG['host'],
        port=SERVICE_CONFIG['port'],
        debug=SERVICE_CONFIG['debug'],
        threaded=True
    )
