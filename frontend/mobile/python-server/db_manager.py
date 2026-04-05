#!/usr/bin/env python3
"""
数据库管理模块
管理SQLite数据库，用于存储日志信息
"""

import sqlite3
import os
from pathlib import Path
from datetime import datetime

class DatabaseManager:
    def __init__(self, db_path):
        """
        初始化数据库管理器
        :param db_path: 数据库文件路径
        """
        self.db_path = db_path
        self._init_database()
    
    def _init_database(self):
        """
        初始化数据库表结构
        """
        # 确保数据库目录存在
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)
        
        # 连接数据库并创建表
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 创建日志表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    level TEXT NOT NULL,
                    service TEXT NOT NULL,
                    message TEXT NOT NULL,
                    details TEXT,
                    ip_address TEXT,
                    user_agent TEXT
                )
            ''')
            
            # 创建索引以提高查询性能
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_logs_service ON logs(service)')
            
            conn.commit()
    
    def insert_log(self, level, service, message, details=None, ip_address=None, user_agent=None):
        """
        插入日志记录
        :param level: 日志级别
        :param service: 服务名称
        :param message: 日志消息
        :param details: 详细信息
        :param ip_address: IP地址
        :param user_agent: 用户代理
        """
        timestamp = datetime.now().isoformat()
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''
                INSERT INTO logs (timestamp, level, service, message, details, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (timestamp, level, service, message, details, ip_address, user_agent)
            )
            conn.commit()
    
    def get_logs(self, limit=100, offset=0, level=None, service=None):
        """
        获取日志记录
        :param limit: 限制返回条数
        :param offset: 偏移量
        :param level: 按日志级别过滤
        :param service: 按服务名称过滤
        :return: 日志记录列表
        """
        query = 'SELECT * FROM logs WHERE 1=1'
        params = []
        
        if level:
            query += ' AND level = ?'
            params.append(level)
        
        if service:
            query += ' AND service = ?'
            params.append(service)
        
        query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?'
        params.extend([limit, offset])
        
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(query, params)
            return [dict(row) for row in cursor.fetchall()]
    
    def get_logs_by_time_range(self, start_time, end_time, limit=100):
        """
        根据时间范围获取日志
        :param start_time: 开始时间
        :param end_time: 结束时间
        :param limit: 限制返回条数
        :return: 日志记录列表
        """
        query = '''
        SELECT * FROM logs 
        WHERE timestamp >= ? AND timestamp <= ? 
        ORDER BY timestamp DESC 
        LIMIT ?
        '''
        
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(query, (start_time, end_time, limit))
            return [dict(row) for row in cursor.fetchall()]
    
    def delete_old_logs(self, days=30):
        """
        删除指定天数前的日志
        :param days: 天数
        :return: 删除的记录数
        """
        import datetime as dt
        cutoff_time = (dt.datetime.now() - dt.timedelta(days=days)).isoformat()
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM logs WHERE timestamp < ?', (cutoff_time,))
            deleted_count = cursor.rowcount
            conn.commit()
            return deleted_count
    
    def get_log_stats(self):
        """
        获取日志统计信息
        :return: 统计信息
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # 按级别统计
            cursor.execute('SELECT level, COUNT(*) as count FROM logs GROUP BY level')
            level_stats = {row['level']: row['count'] for row in cursor.fetchall()}
            
            # 按服务统计
            cursor.execute('SELECT service, COUNT(*) as count FROM logs GROUP BY service')
            service_stats = {row['service']: row['count'] for row in cursor.fetchall()}
            
            # 总记录数
            cursor.execute('SELECT COUNT(*) as total FROM logs')
            total = cursor.fetchone()['total']
            
            return {
                'total': total,
                'level_stats': level_stats,
                'service_stats': service_stats
            }

# 创建全局数据库管理器实例
def get_db_manager(db_path):
    """
    获取数据库管理器实例
    :param db_path: 数据库文件路径
    :return: DatabaseManager实例
    """
    return DatabaseManager(db_path)
