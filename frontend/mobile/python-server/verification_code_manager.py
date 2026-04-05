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

# 导入配置
from config import VERIFICATION_CODE_CONFIG, SECURITY_CONFIG

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
                    
                    # 处理密码错误次数
                    password_errors = {}
                    for phone, info in data.get('password_errors', {}).items():
                        password_errors[phone] = (
                            info['count'],
                            info['last_error_time']
                        )
                    
                    # 处理账户锁定
                    locked_accounts = {}
                    for phone, info in data.get('locked_accounts', {}).items():
                        locked_accounts[phone] = (
                            info['locked_time'],
                            info['lock_reason']
                        )
                    
                    return {
                        'codes': codes,
                        'send_times': send_times,
                        'password_errors': password_errors,
                        'locked_accounts': locked_accounts
                    }
                finally:
                    fcntl.flock(f.fileno(), fcntl.LOCK_UN)
        except (FileNotFoundError, json.JSONDecodeError):
            return {'codes': {}, 'send_times': {}, 'password_errors': {}, 'locked_accounts': {}}
    
    def _save_data(self, codes: Optional[Dict[str, Tuple[str, float, int]]] = None, 
                   send_times: Optional[Dict[str, float]] = None,
                   password_errors: Optional[Dict[str, Tuple[int, float]]] = None,
                   locked_accounts: Optional[Dict[str, Tuple[float, str]]] = None):
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
        
        if password_errors is not None:
            password_errors_dict = {}
            for phone, (count, last_error_time) in password_errors.items():
                password_errors_dict[phone] = {
                    'count': count,
                    'last_error_time': last_error_time
                }
            data['password_errors'] = password_errors_dict
        
        if locked_accounts is not None:
            locked_accounts_dict = {}
            for phone, (locked_time, lock_reason) in locked_accounts.items():
                locked_accounts_dict[phone] = {
                    'locked_time': locked_time,
                    'lock_reason': lock_reason
                }
            data['locked_accounts'] = locked_accounts_dict
        
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
            time_diff = time.time() - send_times[phone_number]
            logger.info(f"检查验证码发送频率: 手机号={phone_number}, 时间差={time_diff:.2f}秒, 限制={rate_limit}秒")
            return time_diff >= rate_limit
    
    def record_password_error(self, phone_number: str, max_errors: Optional[int] = None) -> dict:
        """
        记录密码错误
        :param phone_number: 手机号码
        :param max_errors: 最大错误次数（超过则锁定），默认从配置获取
        :return: 错误信息
        """
        # 使用配置中的最大错误次数
        if max_errors is None:
            max_errors = SECURITY_CONFIG['password_lock_limit']
        
        with self._lock:
            data = self._get_data()
            password_errors = data['password_errors']
            
            if phone_number in password_errors:
                count, _ = password_errors[phone_number]
                new_count = count + 1
                password_errors[phone_number] = (new_count, time.time())
            else:
                new_count = 1
                password_errors[phone_number] = (new_count, time.time())
            
            logger.info(f"记录密码错误: 手机号={phone_number}, 错误次数={new_count}")
            
            # 检查是否达到锁定阈值
            if new_count >= max_errors:
                # 锁定账户
                self.lock_account(phone_number, f"密码错误次数过多 ({new_count}次)")
                # 重置错误次数
                del password_errors[phone_number]
                self._save_data(password_errors=password_errors)
                lock_duration = SECURITY_CONFIG['account_lock_duration']
                return {
                    'error_count': new_count,
                    'remaining_attempts': 0,
                    'locked': True,
                    'message': f"账户已被锁定，请{lock_duration}分钟后再试"
                }
            
            self._save_data(password_errors=password_errors)
            remaining = max(0, max_errors - new_count)
            return {
                'error_count': new_count,
                'remaining_attempts': remaining,
                'locked': False,
                'message': f"密码错误，还有{remaining}次尝试机会"
            }
    
    def reset_password_errors(self, phone_number: str) -> None:
        """
        重置密码错误次数
        :param phone_number: 手机号码
        """
        with self._lock:
            data = self._get_data()
            password_errors = data['password_errors']
            
            if phone_number in password_errors:
                del password_errors[phone_number]
                logger.info(f"重置密码错误次数: 手机号={phone_number}")
                self._save_data(password_errors=password_errors)
    
    def is_account_locked(self, phone_number: str, lock_duration: Optional[int] = None) -> bool:
        """
        检查账户是否被锁定
        :param phone_number: 手机号码
        :param lock_duration: 锁定时长（秒），默认从配置获取
        :return: 是否被锁定
        """
        # 使用配置中的锁定时长
        if lock_duration is None:
            lock_duration = SECURITY_CONFIG['account_lock_duration'] * 60
        
        with self._lock:
            data = self._get_data()
            locked_accounts = data['locked_accounts']
            
            if phone_number not in locked_accounts:
                return False
            
            locked_time, lock_reason = locked_accounts[phone_number]
            # 检查锁定是否过期
            if time.time() - locked_time > lock_duration:
                # 锁定过期，自动解锁
                del locked_accounts[phone_number]
                self._save_data(locked_accounts=locked_accounts)
                return False
            
            # 计算剩余锁定时间
            remaining_time = lock_duration - (time.time() - locked_time)
            logger.info(f"账户被锁定: 手机号={phone_number}, 锁定原因={lock_reason}, 剩余锁定时间={remaining_time:.0f}秒")
            return True
    
    def lock_account(self, phone_number: str, reason: str) -> None:
        """
        锁定账户
        :param phone_number: 手机号码
        :param reason: 锁定原因
        """
        with self._lock:
            data = self._get_data()
            locked_accounts = data['locked_accounts']
            
            locked_accounts[phone_number] = (time.time(), reason)
            logger.info(f"锁定账户: 手机号={phone_number}, 原因={reason}")
            self._save_data(locked_accounts=locked_accounts)
    
    def unlock_account(self, phone_number: str) -> None:
        """
        解锁账户
        :param phone_number: 手机号码
        """
        with self._lock:
            data = self._get_data()
            locked_accounts = data['locked_accounts']
            
            if phone_number in locked_accounts:
                del locked_accounts[phone_number]
                logger.info(f"解锁账户: 手机号={phone_number}")
                self._save_data(locked_accounts=locked_accounts)
    
    def get_password_error_info(self, phone_number: str, limit: int = 3) -> dict:
        """
        获取密码错误信息
        :param phone_number: 手机号码
        :param limit: 错误次数限制
        :return: 错误信息字典
        """
        with self._lock:
            data = self._get_data()
            password_errors = data['password_errors']
            
            if phone_number not in password_errors:
                return {
                    'error_count': 0,
                    'remaining_attempts': limit,
                    'need_verification': False
                }
            
            count, last_error_time = password_errors[phone_number]
            # 检查是否在配置的过期时间内
            expiration_hours = SECURITY_CONFIG['password_error_expiration']
            if time.time() - last_error_time > expiration_hours * 60 * 60:
                # 超过过期时间，重置错误次数
                del password_errors[phone_number]
                self._save_data(password_errors=password_errors)
                return {
                    'error_count': 0,
                    'remaining_attempts': limit,
                    'need_verification': False
                }
            
            remaining = max(0, limit - count)
            return {
                'error_count': count,
                'remaining_attempts': remaining,
                'need_verification': count >= limit
            }
    
    def check_password_error_limit(self, phone_number: str, limit: Optional[int] = None) -> bool:
        """
        检查密码错误是否达到限制
        :param phone_number: 手机号码
        :param limit: 错误次数限制，默认从配置获取
        :return: 是否需要验证码
        """
        # 使用配置中的错误次数限制
        if limit is None:
            limit = SECURITY_CONFIG['password_error_limit']
        error_info = self.get_password_error_info(phone_number, limit)
        return error_info['need_verification']
    
    def cleanup_expired_codes(self) -> None:
        """
        清理过期的验证码、密码错误记录和锁定账户
        """
        with self._lock:
            data = self._get_data()
            codes = data['codes']
            send_times = data['send_times']
            password_errors = data['password_errors']
            locked_accounts = data['locked_accounts']
            
            expired_phones = []
            for phone, (_, timestamp, _) in codes.items():
                if time.time() - timestamp > 300:  # 5分钟过期
                    expired_phones.append(phone)
            
            # 清理配置的过期时间前的密码错误记录
            expiration_hours = SECURITY_CONFIG['password_error_expiration']
            expired_error_phones = []
            for phone, (_, last_error_time) in password_errors.items():
                if time.time() - last_error_time > expiration_hours * 60 * 60:
                    expired_error_phones.append(phone)
            
            # 清理配置的锁定时长前的锁定账户
            lock_duration_minutes = SECURITY_CONFIG['account_lock_duration']
            expired_locked_phones = []
            for phone, (locked_time, _) in locked_accounts.items():
                if time.time() - locked_time > lock_duration_minutes * 60:
                    expired_locked_phones.append(phone)
            
            if expired_phones:
                logger.info(f"清理过期验证码: {expired_phones}")
                for phone in expired_phones:
                    del codes[phone]
                    if phone in send_times:
                        del send_times[phone]
            
            if expired_error_phones:
                logger.info(f"清理过期密码错误记录: {expired_error_phones}")
                for phone in expired_error_phones:
                    del password_errors[phone]
            
            if expired_locked_phones:
                logger.info(f"清理过期锁定账户: {expired_locked_phones}")
                for phone in expired_locked_phones:
                    del locked_accounts[phone]
            
            if expired_phones or expired_error_phones or expired_locked_phones:
                self._save_data(codes, send_times, password_errors, locked_accounts)


# 创建全局实例
verification_code_manager = VerificationCodeManager()
