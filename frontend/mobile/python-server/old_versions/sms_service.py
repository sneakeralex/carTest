#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
腾讯云短信发送服务
使用腾讯云SMS SDK发送验证码
包含短信回调接口
"""

from qcloudsms_py import SmsSingleSender
from qcloudsms_py.httpclient import HTTPError
import random
import logging
import json
import http.server
import socketserver
import threading
import re
from datetime import datetime

from config import SMS_SERVICE_CONFIG, VERIFICATION_CODE_CONFIG, LOG_CONFIG
from verification_code_manager import verification_code_manager

# 配置日志
logging.basicConfig(
    level=getattr(logging, LOG_CONFIG['level']),
    format=LOG_CONFIG['format'],
    filename=LOG_CONFIG['file']
)
logger = logging.getLogger(__name__)

class SmsService:
    def __init__(self):
        # 从配置文件获取腾讯云短信服务配置
        self.app_id = SMS_SERVICE_CONFIG['app_id']
        self.app_key = SMS_SERVICE_CONFIG['app_key']
        self.template_id = SMS_SERVICE_CONFIG['template_id']
        self.sign_name = SMS_SERVICE_CONFIG['sign_name']
        
        # 初始化短信发送器
        try:
            self.sms_sender = SmsSingleSender(self.app_id, self.app_key)
            logger.info("短信发送器初始化成功")
        except Exception as e:
            logger.error(f"短信发送器初始化失败: {e}")
            self.sms_sender = None
    
    def generate_verification_code(self, length=6):
        """
        生成随机验证码
        :param length: 验证码长度
        :return: 验证码字符串
        """
        return verification_code_manager.generate_code(length)
    
    def send_verification_code(self, phone_number, code):
        """
        发送验证码短信
        :param phone_number: 手机号码
        :param code: 验证码
        :return: 发送结果
        """
        if not self.sms_sender:
            return {
                "success": False,
                "message": "短信发送器未初始化"
            }
        
        try:
            # 短信模板参数 - 尝试不同的参数格式
            # 可能模板只需要一个参数（验证码）
            params = [code]  # 只传递验证码
            
            # 发送短信
            result = self.sms_sender.send_with_param(
                86,  # 国家码
                phone_number,  # 手机号码
                self.template_id,  # 模板ID
                params,  # 模板参数
                sign=self.sign_name,  # 签名
                extend="",  # 扩展码
                ext=""  # 服务端原样返回的参数
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
        """
        发送登录验证码
        :param phone_number: 手机号码
        :return: 发送结果
        """
        # 检查频率限制
        if not verification_code_manager.can_send_code(phone_number, VERIFICATION_CODE_CONFIG['rate_limit']):
            return {
                "success": False,
                "message": f"请{VERIFICATION_CODE_CONFIG['rate_limit']}秒后再试"
            }
        
        # 生成验证码
        code = self.generate_verification_code(VERIFICATION_CODE_CONFIG['length'])
        
        # 发送验证码
        result = self.send_verification_code(phone_number, code)
        
        # 如果发送成功，存储验证码
        if result["success"]:
            verification_code_manager.store_code(
                phone_number, 
                code, 
                VERIFICATION_CODE_CONFIG['expiration']
            )
            result["code"] = code
        
        return result

class SmsCallbackHandler(http.server.BaseHTTPRequestHandler):
    """
    处理短信回调请求的HTTP处理器
    """
    
    def do_GET(self):
        """
        处理GET请求
        """
        if self.path == '/health':
            # 健康检查接口
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "status": "healthy",
                "service": "sms-service",
                "version": "1.0.0",
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            # 路径不存在
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "code": -1,
                "message": "路径不存在"
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_POST(self):
        """
        处理POST请求
        """
        if self.path == '/sms/callback':
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # 解析回调数据
                callback_data = json.loads(post_data.decode('utf-8'))
                logger.info(f"收到短信回调: {callback_data}")
                
                # 处理回调数据
                self.process_callback(callback_data)
                
                # 返回成功响应
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "code": 0,
                    "message": "success"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                logger.error(f"处理短信回调失败: {e}")
                # 返回错误响应
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "code": -1,
                    "message": f"处理失败: {str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
        elif self.path == '/sms/send':
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # 解析请求数据
                request_data = json.loads(post_data.decode('utf-8'))
                phone_number = request_data.get('phone')
                
                if not phone_number:
                    # 返回错误响应
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "code": -1,
                        "message": "缺少手机号参数"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 验证手机号格式
                if not re.match(r'^1[3-9]\d{9}$', phone_number):
                    # 返回错误响应
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "code": -1,
                        "message": "手机号格式错误"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 发送验证码
                sms_service = SmsService()
                result = sms_service.send_login_verification(phone_number)
                
                # 返回响应
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "code": 0 if result["success"] else -1,
                    "message": result["message"],
                    "data": result.get("data"),
                    "verificationCode": result.get("code")
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                logger.error(f"处理发送验证码请求失败: {e}")
                # 返回错误响应
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "code": -1,
                    "message": f"处理失败: {str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
        elif self.path == '/sms/verify':
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # 解析请求数据
                request_data = json.loads(post_data.decode('utf-8'))
                phone_number = request_data.get('phone')
                verification_code = request_data.get('code')
                
                if not phone_number:
                    # 返回错误响应
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "code": -1,
                        "message": "缺少手机号参数"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                if not verification_code:
                    # 返回错误响应
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "code": -1,
                        "message": "缺少验证码参数"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 验证手机号格式
                if not re.match(r'^1[3-9]\d{9}$', phone_number):
                    # 返回错误响应
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "code": -1,
                        "message": "手机号格式错误"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 验证验证码格式
                if not re.match(r'^\d{6}$', verification_code):
                    # 返回错误响应
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        "code": -1,
                        "message": "验证码格式错误"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 验证验证码
                is_valid = verification_code_manager.verify_code(phone_number, verification_code)
                logger.info(f"验证验证码: 手机号={phone_number}, 验证码={verification_code}, 结果={is_valid}")
                
                # 返回响应
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "code": 0 if is_valid else -1,
                    "message": "验证码验证成功" if is_valid else "验证码验证失败",
                    "data": {
                        "isValid": is_valid
                    }
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                logger.error(f"处理验证码验证请求失败: {e}")
                # 返回错误响应
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "code": -1,
                    "message": f"处理失败: {str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            # 路径不存在
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "code": -1,
                "message": "路径不存在"
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def process_callback(self, callback_data):
        """
        处理回调数据
        :param callback_data: 回调数据
        """
        # 提取回调信息
        phone_number = callback_data.get('phone', '')
        status = callback_data.get('status', '')
        message_id = callback_data.get('messageId', '')
        error_code = callback_data.get('errorCode', '')
        error_message = callback_data.get('errorMessage', '')
        
        # 记录回调信息
        logger.info(f"短信回调详情: 手机号={phone_number}, 状态={status}, 消息ID={message_id}, 错误码={error_code}, 错误信息={error_message}")
        
        # 这里可以根据实际业务需求进行处理
        # 例如：更新数据库中的短信发送状态、触发后续业务逻辑等
        if status == 'SUCCESS':
            logger.info(f"短信发送成功: {phone_number}")
        else:
            logger.warning(f"短信发送失败: {phone_number}, 错误码: {error_code}, 错误信息: {error_message}")

class SmsCallbackServer:
    """
    短信回调服务器
    """
    
    def __init__(self, host='0.0.0.0', port=8000):
        self.host = host
        self.port = port
        self.server = None
        self.thread = None
        self.cleanup_thread = None
        self.running = False
    
    def start(self):
        """
        启动回调服务器
        """
        try:
            # 创建服务器
            self.server = socketserver.TCPServer((self.host, self.port), SmsCallbackHandler)
            logger.info(f"短信回调服务器启动成功，监听地址: {self.host}:{self.port}")
            logger.info(f"回调接口地址: http://{self.host}:{self.port}/sms/callback")
            logger.info(f"发送验证码接口地址: http://{self.host}:{self.port}/sms/send")
            logger.info(f"验证验证码接口地址: http://{self.host}:{self.port}/sms/verify")
            logger.info(f"健康检查接口地址: http://{self.host}:{self.port}/health")
            
            self.running = True
            
            # 在后台线程中运行服务器
            self.thread = threading.Thread(target=self.server.serve_forever)
            self.thread.daemon = True
            self.thread.start()
            
            # 启动清理过期验证码的线程
            self.cleanup_thread = threading.Thread(target=self._cleanup_expired_codes)
            self.cleanup_thread.daemon = True
            self.cleanup_thread.start()
            
            return True
        except Exception as e:
            logger.error(f"启动短信回调服务器失败: {e}")
            return False
    
    def _cleanup_expired_codes(self):
        """
        定期清理过期的验证码
        """
        import time
        while self.running:
            try:
                verification_code_manager.cleanup_expired_codes()
                time.sleep(60)  # 每分钟清理一次
            except Exception as e:
                logger.error(f"清理过期验证码失败: {e}")
                time.sleep(60)
    
    def stop(self):
        """
        停止回调服务器
        """
        self.running = False
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            logger.info("短信回调服务器已停止")

if __name__ == "__main__":
    # 启动短信回调服务器
    callback_server = SmsCallbackServer(
        host=SMS_SERVICE_CONFIG['host'],
        port=SMS_SERVICE_CONFIG['port']
    )
    callback_server.start()
    
    # 测试发送验证码
    sms_service = SmsService()
    phone = "13651895278"  # 测试手机号码
    result = sms_service.send_login_verification(phone)
    logger.info(f"发送结果: {result}")
    print(f"发送结果: {result}")
    
    # 保持服务器运行
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("\n正在停止服务器...")
        callback_server.stop()
        print("服务器已停止")
