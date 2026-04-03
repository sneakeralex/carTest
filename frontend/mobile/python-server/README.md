# Python 统一服务管理手册

## 项目结构

```
python-server/
├── server.py                    # 统一服务入口（合并API代理和短信服务）
├── config.py                    # 配置管理
├── verification_code_manager.py # 验证码管理
├── .env                         # 环境变量配置
├── requirements.txt             # 依赖项
└── README.md                    # 本使用手册
```

## 功能说明

### 统一服务架构

本服务将API代理服务器和短信服务合并到一个Flask应用中，通过配置参数启用/禁用不同的服务功能：

- **API代理服务**：为内部API调用提供代理服务，自动签名请求并转发到目标服务器
- **短信服务**：使用腾讯云SMS SDK发送验证码，提供短信回调处理

### 主要接口

#### 通用接口

- `GET /health` - 统一健康检查接口
- `GET /services` - 获取服务状态接口

#### API代理服务接口（可配置启用/禁用）

- `POST /login` - 登录接口
- 其他路径 - 代理到目标服务器

#### 短信服务接口（可配置启用/禁用）

- `POST /sms/callback` - 短信回调接口
- `POST /sms/send` - 发送验证码接口
- `POST /sms/verify` - 验证验证码接口

## 环境要求

- Python 3.7+
- 依赖项：见 `requirements.txt`

## 安装与配置

### 1. 安装依赖

```bash
cd python-server
pip install -r requirements.txt
```

### 2. 配置环境变量

编辑 `.env` 文件，根据实际情况修改配置：

```
# 服务启用/禁用配置
ENABLE_API_PROXY=True          # 启用API代理服务
ENABLE_SMS_SERVICE=True        # 启用短信服务
SERVER_HOST=0.0.0.0           # 服务监听地址
SERVER_PORT=8080              # 服务端口
SERVER_DEBUG=False            # 调试模式

# API代理服务器配置
TARGET_BASE_URL=https://172.16.229.88:443/
APP_KEY=21345372
APP_SECRET=ZDiCR75CVHCpfravKC0o

# 短信服务配置
SMS_APP_ID=1401075985
SMS_APP_KEY=08d973ba96170b8b3d43ef4aacd34144
SMS_TEMPLATE_ID=2610261
SMS_SIGN_NAME=湖州泰湖信息安全技术

# 验证码配置
VERIFICATION_CODE_LENGTH=6
VERIFICATION_CODE_EXPIRATION=300
VERIFICATION_CODE_RATE_LIMIT=60

# 日志配置
LOG_LEVEL=INFO
LOG_FILE=python-server.log
```

### 3. 服务启用/禁用配置

通过修改 `.env` 文件中的以下参数来控制服务的启用和禁用：

- `ENABLE_API_PROXY=True/False` - 启用/禁用API代理服务
- `ENABLE_SMS_SERVICE=True/False` - 启用/禁用短信服务

## 启动服务

```bash
cd python-server
python server.py
```

服务将在配置的地址和端口上运行（默认：`http://0.0.0.0:8080`）。

## 服务管理

### 使用 systemd 管理服务

创建 `/etc/systemd/system/python-server.service`：

```ini
[Unit]
Description=Python Unified Server
After=network.target

[Service]
User=your_username
WorkingDirectory=/path/to/python-server
ExecStart=/usr/bin/python3 server.py
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```

#### 启用和启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable python-server
sudo systemctl start python-server
```

#### 查看服务状态

```bash
sudo systemctl status python-server
```

#### 重启服务

```bash
sudo systemctl restart python-server
```

#### 停止服务

```bash
sudo systemctl stop python-server
```

### 使用 Supervisor 管理服务

安装 Supervisor：

```bash
sudo apt-get install supervisor  # Ubuntu/Debian
sudo yum install supervisor      # CentOS/RHEL
```

创建配置文件 `/etc/supervisor/conf.d/python-server.conf`：

```ini
[program:python-server]
directory=/path/to/python-server
command=/usr/bin/python3 server.py
autostart=true
autorestart=true
startsecs=5
user=your_username
stdout_logfile=/path/to/python-server/server.log
stderr_logfile=/path/to/python-server/server.err.log
environment=PYTHONUNBUFFERED="1"
```

启动服务：

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start python-server
```

## 接口使用说明

### 健康检查接口

**请求**：

```bash
GET http://localhost:8080/health
```

**响应**：

```json
{
  "status": "healthy",
  "service": "unified-server",
  "version": "1.0.0",
  "timestamp": "2026-03-13T12:00:00",
  "services": {
    "api_proxy": true,
    "sms_service": true
  }
}
```

### 服务状态接口

**请求**：

```bash
GET http://localhost:8080/services
```

**响应**：

```json
{
  "api_proxy": true,
  "sms_service": true,
  "timestamp": "2026-03-13T12:00:00"
}
```

### API代理服务

#### 登录接口

**请求**：

```bash
POST http://localhost:8080/login
Content-Type: application/json

{
  "phone": "13651895278",
  "password": "password123"
  # 或使用验证码登录
  # "verification_code": "123456"
}
```

**响应**：

```json
{
  "message": "登录成功",
  "user": {
    "id": "1",
    "name": "张三",
    "phone": "13651895278",
    "...": "..."
  }
}
```

### 短信服务

#### 发送验证码接口

**请求**：

```bash
POST http://localhost:8080/sms/send
Content-Type: application/json

{
  "phone": "13651895278"
}
```

**响应**：

```json
{
  "code": 0,
  "message": "验证码发送成功",
  "data": {...},
  "verificationCode": "123456"
}
```

#### 验证验证码接口

**请求**：

```bash
POST http://localhost:8080/sms/verify
Content-Type: application/json

{
  "phone": "13651895278",
  "code": "123456"
}
```

**响应**：

```json
{
  "code": 0,
  "message": "验证码验证成功",
  "data": {
    "isValid": true
  }
}
```

## 日志管理

- 服务日志：`python-server.log`
- 系统日志（systemd）：`journalctl -u python-server`
- Supervisor日志：`/path/to/python-server/server.log`

## 监控与维护

1. **健康检查**：定期调用 `/health` 接口检查服务状态
2. **日志监控**：监控日志文件，及时发现异常
3. **服务状态**：使用 `systemctl status` 或 `supervisorctl status` 查看服务状态
4. **重启服务**：当服务异常时，使用 `systemctl restart` 或 `supervisorctl restart` 重启服务

## 配置示例

### 场景1：只启用API代理服务

```
ENABLE_API_PROXY=True
ENABLE_SMS_SERVICE=False
SERVER_PORT=8080
```

### 场景2：只启用短信服务

```
ENABLE_API_PROXY=False
ENABLE_SMS_SERVICE=True
SERVER_PORT=8080
```

### 场景3：同时启用两个服务

```
ENABLE_API_PROXY=True
ENABLE_SMS_SERVICE=True
SERVER_PORT=8080
```

## 安全注意事项

1. **环境变量**：不要将敏感信息（如APP\_SECRET、SMS\_APP\_KEY）硬编码在代码中
2. **日志**：确保日志中不包含敏感信息
3. **频率限制**：服务已实现验证码发送频率限制，防止滥用
4. **验证码存储**：验证码存储在内存中，定期清理，确保安全性
5. **HTTPS**：在生产环境中，建议使用HTTPS加密传输

## 故障排查

### 常见问题

1. **服务启动失败**：检查端口是否被占用，配置是否正确
2. **验证码发送失败**：检查腾讯云SMS配置是否正确，签名是否审核通过
3. **API代理失败**：检查目标服务器地址是否可达，APP\_KEY和APP\_SECRET是否正确
4. **验证码验证失败**：检查验证码是否过期，是否输入正确

### 排查步骤

1. 查看服务日志，了解具体错误信息
2. 检查网络连接是否正常
3. 验证配置文件中的参数是否正确
4. 测试相关接口，确认问题范围
5. 根据错误信息进行针对性修复

## 版本更新

### 更新步骤

1. 备份配置文件和日志
2. 更新代码文件
3. 重启服务
4. 测试服务是否正常运行

### 注意事项

- 更新前确保备份重要数据
- 更新后进行全面测试，确保服务正常运行
- 记录更新内容，便于问题追溯

## 旧版本迁移

如果您之前使用的是分离的 `api_proxy_server.py` 和 `sms_service.py`，迁移到统一服务的步骤如下：

1. **备份现有配置**：
   ```bash
   cp .env .env.backup
   ```
2. **更新配置文件**：
   - 按照新的 `.env` 格式更新配置
   - 添加服务启用/禁用参数
3. **更新服务管理配置**：
   - 如果使用systemd，更新服务文件指向 `server.py`
   - 如果使用Supervisor，更新配置文件指向 `server.py`
4. **重启服务**：
   ```bash
   sudo systemctl restart python-server
   # 或
   sudo supervisorctl restart python-server
   ```
5. **验证服务**：
   - 调用 `/health` 接口确认服务正常运行
   - 测试各个功能接口

## 性能优化建议

1. **使用生产环境WSGI服务器**：
   在生产环境中，建议使用Gunicorn或uWSGI替代Flask内置服务器：
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8080 server:app
   ```
2. **配置Nginx反向代理**：
   使用Nginx作为反向代理，提高性能和安全性
3. **启用HTTPS**：
   在生产环境中启用HTTPS加密传输
4. **监控和报警**：
   配置监控和报警系统，及时发现和处理问题

