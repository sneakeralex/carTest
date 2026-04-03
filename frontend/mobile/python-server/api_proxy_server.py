#!/usr/bin/env python3
"""
API Proxy Server

This server acts as a proxy for internal API calls, automatically signing requests
and forwarding them to the target server.

Usage: python api_proxy_server.py
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
from flask import Flask, request, Response
from typing import Dict, List, Optional

from config import API_PROXY_CONFIG, LOG_CONFIG

# 配置日志
logging.basicConfig(
    level=getattr(logging, LOG_CONFIG['level']),
    format=LOG_CONFIG['format'],
    filename=LOG_CONFIG['file']
)
logger = logging.getLogger(__name__)

class ApiSigner:
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

            # Parse query parameters
            if parsed.query:
                for k, v in urllib.parse.parse_qs(parsed.query, keep_blank_values=True).items():
                    params[k] = v

            # If form data, include in canonicalization
            if content_type and content_type.startswith('application/x-www-form-urlencoded') and body:
                for k, v in urllib.parse.parse_qs(body, keep_blank_values=True).items():
                    params[k] = v

            if not params:
                return path

            # Sort keys and build query string
            sorted_keys = sorted(params.keys())
            query_parts = []
            for key in sorted_keys:
                for value in params[key]:
                    if value:  # If value is not empty, include key=value
                        query_parts.append(f"{key}={value}")
                    else:  # If value is empty, include only key
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

        # Calculate MD5 only for non-form data
        md5 = ""
        if body and not content_type.startswith('application/x-www-form-urlencoded'):
            md5 = ApiSigner.md5_base64(body)

        timestamp = str(int(datetime.now().timestamp() * 1000))
        nonce = str(uuid.uuid4())

        canonical_url = ApiSigner.canonicalize_url(url, content_type, body)

        # Build textToSign: for POST/PUT/PATCH, include MD5; for others, exclude
        if method in ['POST', 'PUT', 'PATCH'] and md5:
            text_to_sign = f"{method}\n{accept}\n{md5}\n{content_type}"
        else:
            text_to_sign = f"{method}\n{accept}\n{content_type}"

        # Collect headers to sign (matching JS: x-ca- headers)
        headers_map = {}
        for name, value in original_headers.items():
            name_lower = name.lower()
            if name_lower.startswith('x-ca-'):
                if name_lower not in ['x-ca-signature', 'x-ca-signature-headers', 'x-ca-key', 'x-ca-nonce']:
                    headers_map[name] = value
        headers_map['x-ca-key'] = app_key
        headers_map['x-ca-timestamp'] = timestamp

        # Sort headers and add to textToSign
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


app = Flask(__name__)

# 从配置文件获取配置
TARGET_BASE_URL = API_PROXY_CONFIG['target_base_url']
APP_KEY = API_PROXY_CONFIG['app_key']
APP_SECRET = API_PROXY_CONFIG['app_secret']


@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    try:
        response = {
            "status": "healthy",
            "service": "api-proxy-server",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat()
        }
        return Response(json.dumps(response), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        response = {
            "status": "unhealthy",
            "service": "api-proxy-server",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        return Response(json.dumps(response), status=500, mimetype='application/json')


@app.route('/login', methods=['POST'])
def login():
    """Login endpoint: query internal staff API by phone, then validate password."""
    try:
        payload = request.get_json(silent=True) or {}
        phone = payload.get('phone')
        password = payload.get('password')
        verification_code = payload.get('verification_code')
        
        if not phone:
            return Response(json.dumps({"error": "缺少 phone 参数"}, ensure_ascii=False), status=400, mimetype='application/json')
        
        if not password and not verification_code:
            return Response(json.dumps({"error": "缺少 password 或 verification_code 参数"}, ensure_ascii=False), status=400, mimetype='application/json')

        # Build internal staff search request
        staff_path = 'artemis/api/v1/staff'
        target_url = urllib.parse.urljoin(TARGET_BASE_URL, staff_path)
        internal_body = json.dumps({"phone": phone, "pageSize": 20, "pageNum": 1}, ensure_ascii=False)

        # Prepare headers for signing
        headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'appKey': APP_KEY}
        signature_headers = ApiSigner.sign_request('POST', target_url, internal_body, headers, APP_KEY, APP_SECRET)
        request_headers = {**headers, **signature_headers}

        logger.info(f"[LOGIN] Querying staff API {target_url} with phone={phone}")
        logger.debug(f"[LOGIN] Request headers: {request_headers}")
        logger.debug(f"[LOGIN] Request body: {internal_body}")

        resp = requests.post(target_url, headers=request_headers, data=internal_body, verify=False, timeout=30)

        logger.info(f"[LOGIN] Staff API response status: {resp.status_code}")
        try:
            resp_json = resp.json()
            logger.debug(f"[LOGIN] Staff API response json: {json.dumps(resp_json)[:1000]}")
        except Exception:
            logger.error(f"[LOGIN] Failed to parse staff API response as JSON: {resp.text}")
            return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

        # Try to extract user list from expected response shape first
        users = None
        if isinstance(resp_json, dict):
            # Expected format: {"code":"0","msg":"SUCCESS","data":{"pageNo":1,...,"list":[{...}]}}
            data_obj = resp_json.get('data') if isinstance(resp_json.get('data'), dict) else None
            if data_obj and isinstance(data_obj.get('list'), list):
                users = data_obj.get('list')
            else:
                # Fallback to previous common response shapes
                for key in ('data', 'result', 'records', 'list', 'items'):
                    if key in resp_json and resp_json[key]:
                        users = resp_json[key]
                        break
                if users is None:
                    # if any value is a list, use the first list
                    for v in resp_json.values():
                        if isinstance(v, list) and v:
                            users = v
                            break
        elif isinstance(resp_json, list):
            users = resp_json

        if not users:
            return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

        # normalize to list
        if isinstance(users, dict):
            users = [users]

        if len(users) == 0:
            return Response(json.dumps({"error": "用户不存在"}, ensure_ascii=False), status=404, mimetype='application/json')

        # Find user by phone in list
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

        # 验证登录方式
        if verification_code:
            # 验证码登录 - 这里应该调用验证码验证接口
            # 暂时跳过验证码验证，实际项目中应该实现
            logger.info(f"[LOGIN] Using verification code login for {phone}")
        else:
            # 密码登录
            # Try several common password field names
            stored_pwd = None
            if isinstance(user, dict):
                for key in ('password', 'passwd', 'pwd', 'passWord'):
                    if key in user:
                        stored_pwd = user[key]
                        break

            if stored_pwd is None:
                # Cannot validate password if no field available
                return Response(json.dumps({"error": "无法验证用户密码"}, ensure_ascii=False), status=502, mimetype='application/json')

            # Compare passwords (simple equality as requested)
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
        logger.debug(f"Request headers: {dict(request.headers)}")

        # If the incoming path ends with 'login' (e.g. '/login' or '/artemis/login'), handle locally
        if path and path.strip('/').lower().endswith('login'):
            logger.debug(f"Incoming path '{path}' ends with 'login' - handling with local login()")
            # Call the login handler directly and return its Response
            return login()

        # Construct target URL
        # If the incoming path is 'login' or '/login', forward to internal '/login' path
        if path is not None and path.strip('/') == 'login':
            target_url = urllib.parse.urljoin(TARGET_BASE_URL, 'login')
        else:
            target_url = urllib.parse.urljoin(TARGET_BASE_URL, path)

        # Add query parameters if any
        if request.query_string:
            target_url += '?' + request.query_string.decode('utf-8')

        logger.info(f"Target URL: {target_url}")

        # Get request body
        body = request.get_data(as_text=True) if request.method in ['POST', 'PUT', 'PATCH'] else None
        if body:
            logger.debug(f"Request body: {body[:500]}{'...' if len(body) > 500 else ''}")

        # Prepare headers
        headers = dict(request.headers)
        # Remove host header
        headers.pop('Host', None)
        # Add appKey header
        headers['appKey'] = APP_KEY

        # Set content type if body present
        if body and 'Content-Type' not in headers:
            headers['Content-Type'] = 'application/json'

        logger.debug(f"Prepared headers: {headers}")

        # Generate signature headers
        signature_headers = ApiSigner.sign_request(
            request.method,
            target_url,
            body or "",
            headers,
            APP_KEY,
            APP_SECRET
        )

        logger.debug(f"Signature headers: {signature_headers}")

        # Merge headers
        request_headers = {**headers, **signature_headers}

        logger.debug(f"Final request headers: {request_headers}")

        # Forward request to target server
        response = requests.request(
            request.method,
            target_url,
            headers=request_headers,
            data=body,
            verify=False,  # Skip SSL verification for internal network with self-signed certificate
            timeout=30
        )

        logger.info(f"Response status: {response.status_code}")
        logger.debug(f"Response headers: {dict(response.headers)}")
        response_body = response.text
        logger.debug(f"Response body: {response_body[:500]}{'...' if len(response_body) > 500 else ''}")

        # Create response
        proxy_response = Response(
            response.content,
            status=response.status_code,
            headers=dict(response.headers)
        )

        # Remove hop-by-hop headers
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


if __name__ == '__main__':
    logger.info("Starting API Proxy Server")
    logger.info(f"Proxying requests to: {TARGET_BASE_URL}")
    logger.info(f"Server will run on http://{API_PROXY_CONFIG['host']}:{API_PROXY_CONFIG['port']}")
    logger.info("Press Ctrl+C to stop")

    app.run(
        host=API_PROXY_CONFIG['host'],
        port=API_PROXY_CONFIG['port'],
        debug=API_PROXY_CONFIG['debug'],
        threaded=True
    )
