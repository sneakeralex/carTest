#!/usr/bin/env python3
"""
API Signer Python Script for Testing Internal Network APIs

This script implements the API signing logic from the Java ApiSigner utility,
allowing easy testing and debugging of signed requests to internal APIs.

Usage: python api_signer_test.py <path>
Example: python api_signer_test.py /api/vehicles
"""

import hashlib
import hmac
import base64
import urllib.parse
from datetime import datetime
import uuid
import requests
import json
import sys
from typing import Dict, List, Optional


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
        """Canonicalize URL for signing, matching Postman JS urlToSign."""
        try:
            # Parse URL to extract path (remove protocol and domain)
            parsed = urllib.parse.urlparse(full_url)
            # Assuming full_url includes domain, extract path starting after domain
            # JS does ss[0].substring(23), here we use parsed.path
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
                    query_parts.append(f"{key}={value}")

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

        # Build textToSign matching Postman JS: method\naccept\ncontent-type\nheaders\nurl
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


def send_signed_request(method: str, url: str, body: Optional[str] = None,
                       headers: Optional[Dict[str, str]] = None,
                       app_key: str = "test-key", app_secret: str = "test-secret") -> requests.Response:
    """Send a signed HTTP request."""
    if headers is None:
        headers = {}

    # Set default content type if body present
    if body and 'Content-Type' not in headers:
        headers['Content-Type'] = 'application/json'

    # Generate signature headers
    signature_headers = ApiSigner.sign_request(method, url, body or "", headers, app_key, app_secret)

    # Merge headers
    request_headers = {**headers, **signature_headers}

    print(f"Sending {method} request to {url}")
    print(f"Signature headers: {json.dumps(signature_headers, indent=2)}")
    if body:
        print(f"Body: {body}")

    # Send request
    response = requests.request(method, url, headers=request_headers, data=body)

    print(f"Response status: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print(f"Response body: {response.text}")

    return response


def main():
    """Main function for testing."""
    if len(sys.argv) != 2:
        print("Usage: python api_signer_test.py <path>")
        print("Example: python api_signer_test.py /api/vehicles")
        sys.exit(1)

    path = sys.argv[1]

    # Hardcoded parameters
    base_url = "https://172.16.229.88:443/"
    app_key = "21345372"
    app_secret = "ZDiCR75CVHCpfravKC0o"
    method = "POST"
    body = json.dumps([
        {
            "username": "userHH",
            "groupId": "d1",
            "groupAuth": "0",
            "remark": "备注",
            "expireTime": "2024-12-15T00:00:05.000+08:00",
            "personKey": "456",
            "password": "Ue07NAf1copLV8mtvunY5c1V8Abd9QmgbJVy0nmRR/BXQQVaUMW2L3BXC0r+D8Tp9oqh1VNYOhM2OKPY1sA2OnBNrdepVRKeQrl3WzZvzUM=",
            "salt": "713e0f9e04cf422db94b03d5da9d75ea",
            "extendMap": {
                "id": "111",
                "principalId": "1111",
                "principalType": "USER",
                "extFieldKey": "department",
                "extFieldValue": "huodong",
                "tenantIndexCode": "111"
            }
        }
    ])
    headers = {"Accept": "application/json", "appKey": app_key}

    # Construct full URL
    url = urllib.parse.urljoin(base_url, path)

    try:
        response = send_signed_request(method, url, body, headers, app_key, app_secret)
        print(f"\nFinal response: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
