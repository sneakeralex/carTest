#!/usr/bin/env python3
"""
配置文件
管理统一服务的配置信息
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# 获取当前文件所在目录
BASE_DIR = Path(__file__).parent

# 加载环境变量（从当前目录的.env文件加载）
env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path)

# 服务启用/禁用配置
SERVICE_CONFIG = {
    'enable_api_proxy': os.getenv('ENABLE_API_PROXY', 'True').lower() == 'true',
    'enable_sms_service': os.getenv('ENABLE_SMS_SERVICE', 'True').lower() == 'true',
    'host': os.getenv('SERVER_HOST', '0.0.0.0'),
    'port': int(os.getenv('SERVER_PORT', '8080')),
    'debug': os.getenv('SERVER_DEBUG', 'False').lower() == 'true'
}

# API代理服务器配置
API_PROXY_CONFIG = {
    'target_base_url': os.getenv('TARGET_BASE_URL', 'https://172.16.229.88:443/'),
    'app_key': os.getenv('APP_KEY', '21345372'),
    'app_secret': os.getenv('APP_SECRET', 'ZDiCR75CVHCpfravKC0o')
}

# 短信服务配置
SMS_SERVICE_CONFIG = {
    'app_id': os.getenv('SMS_APP_ID', '1401075985'),
    'app_key': os.getenv('SMS_APP_KEY', '08d973ba96170b8b3d43ef4aacd34144'),
    'template_id': int(os.getenv('SMS_TEMPLATE_ID', '2610261')),
    'sign_name': os.getenv('SMS_SIGN_NAME', '湖州泰湖信息安全技术')
}

# 验证码配置
VERIFICATION_CODE_CONFIG = {
    'length': int(os.getenv('VERIFICATION_CODE_LENGTH', '6')),
    'expiration': int(os.getenv('VERIFICATION_CODE_EXPIRATION', '300')),  # 5分钟
    'rate_limit': int(os.getenv('VERIFICATION_CODE_RATE_LIMIT', '60'))  # 60秒
}

# 日志配置
LOG_CONFIG = {
    'level': os.getenv('LOG_LEVEL', 'INFO'),
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'file': os.getenv('LOG_FILE', 'python-server.log')
}
