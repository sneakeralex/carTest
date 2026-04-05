#!/usr/bin/env python3
"""
SQLite日志处理器
将日志记录到SQLite数据库
"""

import logging
from datetime import datetime
from db_manager import get_db_manager

class SQLiteHandler(logging.Handler):
    def __init__(self, db_path):
        """
        初始化SQLite日志处理器
        :param db_path: 数据库文件路径
        """
        super().__init__()
        self.db_manager = get_db_manager(db_path)
    
    def emit(self, record):
        """
        处理日志记录
        :param record: 日志记录对象
        """
        try:
            # 格式化日志消息
            message = self.format(record)
            
            # 提取日志级别
            level = record.levelname
            
            # 提取服务名称（从logger名称获取）
            service = record.name.split('.')[-1] if '.' in record.name else record.name
            
            # 提取详细信息
            details = None
            if hasattr(record, 'exc_info') and record.exc_info:
                import traceback
                details = traceback.format_exc(record.exc_info)
            elif hasattr(record, 'stack_info') and record.stack_info:
                details = record.stack_info
            
            # 提取IP地址和用户代理（如果有）
            ip_address = getattr(record, 'ip_address', None)
            user_agent = getattr(record, 'user_agent', None)
            
            # 插入日志记录
            self.db_manager.insert_log(
                level=level,
                service=service,
                message=message,
                details=details,
                ip_address=ip_address,
                user_agent=user_agent
            )
        except Exception as e:
            # 避免日志处理器本身出错导致递归错误
            print(f"Error in SQLiteHandler: {e}")

class RequestContextFilter(logging.Filter):
    """
    日志过滤器，用于添加请求上下文信息
    """
    def __init__(self, ip_address=None, user_agent=None):
        super().__init__()
        self.ip_address = ip_address
        self.user_agent = user_agent
    
    def filter(self, record):
        """
        过滤并添加上下文信息
        :param record: 日志记录对象
        :return: 总是返回True
        """
        if self.ip_address:
            record.ip_address = self.ip_address
        if self.user_agent:
            record.user_agent = self.user_agent
        return True
