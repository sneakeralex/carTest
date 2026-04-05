#!/usr/bin/env python3
"""
验证码管理模块
用于存储和验证验证码
使用临时文件存储，解决多进程问题
"""

import time
import threading
import json
import os
import fcntl
from pathlib import Path
from typing import Dict, Optional, Tuple
import logging

# 配置日志
logger = logging.getLogger('verification_code')

# 获取项目根目录
BASE_DIR = Path(__file__).parent
# 验证码存储文件路径
STORAGE_FILE = BASE_DIR / 'data' / 'verification_codes.json'

# 确保存储目录存在
STORAGE_FILE.parent.mkdir(parents=True, exist_ok=True)


class VerificationCodeManager:
    def __init__(self):
        self._lock = threading.Lock()
        # 初始化存储文件
        self._init_storage()
    
    def _init_storage(self):
        """初始化存储文件"""
        if not STORAGE_FILE.exists():
            self._save_data({}, {})
    
    def _get_data(self) -> Dict:
        """从文件读取数据"""
        try:
            with open(STORAGE_FILE, 'r', encoding='utf-8') as f:
                fcntl.flock(f.fileno(), fcntl.LOCK_SH)
                try:
                    data = json.load(f)
                    # 转换数据格式
                    codes = {}
                    for phone, info in data.get('codes', {}).items():
                        codes[phone] = (
                            info['code'],
                            info['timestamp'],
                            info['attempts']
                        )
                    send_times = data.get('send_times', {})
                    return {
                        'codes': codes,
                        'send_times': send_times
                    }
                finally:
                    fcntl.flock(f.fileno(), fcntl.LOCK_UN)
        except (FileNotFoundError, json.JSONDecodeError):
            return {'codes': {}, 'send_times': {}}
    
    def _save_data(self, codes: Optional[Dict[str, Tuple[str, float, int]]] = None, 
                   send_times: Optional[Dict[str, float]] = None):
        """保存数据到文件"""
        # 获取现有数据
        data = self._get_data()
        
        # 更新数据
        if codes is not None:
            codes_dict = {}
            for phone, (code, timestamp, attempts) in codes.items():
                codes_dict[phone] = {
                    'code': code,
                    'timestamp': timestamp,
                    'attempts': attempts
                }
            data['codes'] = codes_dict
        
        if send_times is not None:
            data['send_times'] = send_times
        
        # 写入文件
        with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
            fcntl.flock(f.fileno(), fcntl.LOCK_EX)
            try:
                json.dump(data, f, ensure_ascii=False, indent=2)
            finally:
                fcntl.flock(f.fileno(), fcntl.LOCK_UN)
    
    def generate_code(self, length: int = 6) -> str:
        """
        生成随机验证码
        :param length: 验证码长度
        :return: 验证码字符串
        """
        import random
        return ''.join(random.choices('0123456789', k=length))
    
    def store_code(self, phone_number: str, code: str, expiration: int = 300) -> None:
        """
        存储验证码
        :param phone_number: 手机号码
        :param code: 验证码
        :param expiration: 过期时间（秒）
        """
        with self._lock:
            logger.info(f"存储验证码: 手机号={phone_number}, 验证码={code}, 过期时间={expiration}秒")
            
            # 读取现有数据
            data = self._get_data()
            codes = data['codes']
            send_times = data['send_times']
            
            logger.info(f"存储前的验证码数量: {len(codes)}")
            
            # 更新数据
            codes[phone_number] = (code, time.time(), 0)
            send_times[phone_number] = time.time()
            
            # 保存数据
            self._save_data(codes, send_times)
            
            logger.info(f"存储后的验证码数量: {len(codes)}")
            logger.info(f"当前存储的验证码手机号: {list(codes.keys())}")
    
    def verify_code(self, phone_number: str, code: str) -> bool:
        """
        验证验证码
        :param phone_number: 手机号码
        :param code: 验证码
        :return: 是否验证成功
        """
        with self._lock:
            logger.info(f"验证验证码: 手机号={phone_number}, 验证码={code}")
            
            # 读取数据
            data = self._get_data()
            codes = data['codes']
            send_times = data['send_times']
            
            logger.info(f"验证前，当前存储的验证码手机号: {list(codes.keys())}")
            
            # 检查验证码是否存在
            if phone_number not in codes:
                logger.warning(f"验证码不存在: 手机号={phone_number}")
                logger.info(f"当前存储的验证码手机号: {list(codes.keys())}")
                return False
            
            stored_code, timestamp, attempts = codes[phone_number]
            logger.info(f"存储的验证码: {stored_code}, 时间戳: {timestamp}, 尝试次数: {attempts}")
            
            # 检查验证码是否过期
            if time.time() - timestamp > 300:  # 5分钟过期
                logger.warning(f"验证码已过期: 手机号={phone_number}, 验证码={stored_code}")
                del codes[phone_number]
                if phone_number in send_times:
                    del send_times[phone_number]
                self._save_data(codes, send_times)
                logger.info(f"删除过期验证码后，存储的验证码数量: {len(codes)}")
                return False
            
            # 检查验证次数
            if attempts >= 3:  # 最多尝试3次
                logger.warning(f"验证次数过多: 手机号={phone_number}, 已尝试{attempts}次")
                del codes[phone_number]
                if phone_number in send_times:
                    del send_times[phone_number]
                self._save_data(codes, send_times)
                logger.info(f"删除超过尝试次数的验证码后，存储的验证码数量: {len(codes)}")
                return False
            
            # 验证验证码
            if stored_code == code:
                # 验证成功，删除验证码
                logger.info(f"验证码验证成功: 手机号={phone_number}, 验证码={code}")
                del codes[phone_number]
                if phone_number in send_times:
                    del send_times[phone_number]
                self._save_data(codes, send_times)
                logger.info(f"验证成功后，存储的验证码数量: {len(codes)}")
                return True
            else:
                # 验证失败，增加尝试次数
                logger.warning(f"验证码验证失败: 手机号={phone_number}, 输入验证码={code}, 存储验证码={stored_code}")
                codes[phone_number] = (stored_code, timestamp, attempts + 1)
                self._save_data(codes, send_times)
                logger.info(f"验证失败后，尝试次数增加到: {attempts + 1}")
                return False
    
    def can_send_code(self, phone_number: str, rate_limit: int = 60) -> bool:
        """
        检查是否可以发送验证码（频率限制）
        :param phone_number: 手机号码
        :param rate_limit: 频率限制（秒）
        :return: 是否可以发送
        """
        with self._lock:
            data = self._get_data()
            send_times = data['send_times']
            
            if phone_number not in send_times:
                return True
            return time.time() - send_times[phone_number] >= rate_limit
    
    def cleanup_expired_codes(self) -> None:
        """
        清理过期的验证码
        """
        with self._lock:
            data = self._get_data()
            codes = data['codes']
            send_times = data['send_times']
            
            expired_phones = []
            for phone, (_, timestamp, _) in codes.items():
                if time.time() - timestamp > 300:  # 5分钟过期
                    expired_phones.append(phone)
            
            if expired_phones:
                logger.info(f"清理过期验证码: {expired_phones}")
                for phone in expired_phones:
                    del codes[phone]
                    if phone in send_times:
                        del send_times[phone]
                self._save_data(codes, send_times)


# 创建全局实例
verification_code_manager = VerificationCodeManager()
