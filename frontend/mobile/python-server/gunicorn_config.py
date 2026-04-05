#!/usr/bin/env python3
"""
Gunicorn配置文件
用于生产环境部署
"""

import multiprocessing
import os
import sys

# 添加当前目录到Python路径，以便导入config模块
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 导入项目配置
from config import SERVICE_CONFIG, LOG_CONFIG

# 服务器绑定地址
bind = f"{SERVICE_CONFIG['host']}:{SERVICE_CONFIG['port']}"

# 工作进程数（推荐：CPU核心数 * 2 + 1）
workers = int(os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))

# 每个工作进程的线程数
threads = int(os.getenv('GUNICORN_THREADS', 2))

# 工作模式（sync, gevent, eventlet等）
worker_class = 'sync'

# 最大并发请求数
worker_connections = 1000

# 最大请求数后重启worker（防止内存泄漏）
max_requests = 1000
max_requests_jitter = 100

# 超时时间（秒）
timeout = 30

# 保持连接时间（秒）
keepalive = 2

# 进程名称
proc_name = 'python-server'

# 日志配置
accesslog = os.getenv('GUNICORN_ACCESS_LOG', 'logs/access.log')
errorlog = os.getenv('GUNICORN_ERROR_LOG', 'logs/error.log')
loglevel = os.getenv('GUNICORN_LOG_LEVEL', LOG_CONFIG['level'])

# 确保日志目录存在
log_dir = os.path.dirname(accesslog)
if log_dir and not os.path.exists(log_dir):
    os.makedirs(log_dir, exist_ok=True)

log_dir = os.path.dirname(errorlog)
if log_dir and not os.path.exists(log_dir):
    os.makedirs(log_dir, exist_ok=True)

# 守护进程模式（False表示前台运行）
daemon = False

# 进程ID文件
pidfile = os.getenv('GUNICORN_PID_FILE', 'logs/gunicorn.pid')

# 用户和组（需要root权限）
# user = 'nobody'
# group = 'nobody'

# 安全设置
limit_request_line = 4096
limit_request_fields = 100
limit_request_field_size = 8190

# 预加载应用（可以节省内存，但要注意全局变量的线程安全）
preload_app = True

# 重启时的优雅超时
graceful_timeout = 30

# 捕获SIGTERM信号
capture_output = True

# 启用标准输出流
enable_stdio_inheritance = True
