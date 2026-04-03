#!/usr/bin/env python3
"""
验证码管理模块
用于存储和验证验证码
"""

import time
import threading
from typing import Dict, Optional, Tuple

class VerificationCodeManager:
    def __init__(self):
        # 存储验证码信息: {phone_number: (code, timestamp, attempts)}
        self._code_store: Dict[str, Tuple[str, float, int]] = {}
        # 存储发送时间: {phone_number: timestamp}
        self._send_times: Dict[str, float] = {}
        # 线程锁
        self._lock = threading.Lock()
    
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
            self._code_store[phone_number] = (code, time.time(), 0)
            self._send_times[phone_number] = time.time()
    
    def verify_code(self, phone_number: str, code: str) -> bool:
        """
        验证验证码
        :param phone_number: 手机号码
        :param code: 验证码
        :return: 是否验证成功
        """
        with self._lock:
            if phone_number not in self._code_store:
                return False
            
            stored_code, timestamp, attempts = self._code_store[phone_number]
            
            # 检查验证码是否过期
            if time.time() - timestamp > 300:  # 5分钟过期
                del self._code_store[phone_number]
                return False
            
            # 检查验证次数
            if attempts >= 3:  # 最多尝试3次
                del self._code_store[phone_number]
                return False
            
            # 验证验证码
            if stored_code == code:
                # 验证成功，删除验证码
                del self._code_store[phone_number]
                return True
            else:
                # 验证失败，增加尝试次数
                self._code_store[phone_number] = (stored_code, timestamp, attempts + 1)
                return False
    
    def can_send_code(self, phone_number: str, rate_limit: int = 60) -> bool:
        """
        检查是否可以发送验证码（频率限制）
        :param phone_number: 手机号码
        :param rate_limit: 频率限制（秒）
        :return: 是否可以发送
        """
        with self._lock:
            if phone_number not in self._send_times:
                return True
            return time.time() - self._send_times[phone_number] >= rate_limit
    
    def cleanup_expired_codes(self) -> None:
        """
        清理过期的验证码
        """
        with self._lock:
            expired_phones = []
            for phone, (_, timestamp, _) in self._code_store.items():
                if time.time() - timestamp > 300:  # 5分钟过期
                    expired_phones.append(phone)
            
            for phone in expired_phones:
                del self._code_store[phone]

# 创建全局实例
verification_code_manager = VerificationCodeManager()
