# Python Server 统一服务

本服务将API代理服务器和短信服务合并到一个Flask应用中，通过配置参数启用/禁用不同的服务功能。

## 功能特性

- **API代理服务**：为内部API调用提供代理服务，自动签名请求并转发到目标服务器
- **短信服务**：使用腾讯云SMS SDK发送验证码，提供短信回调处理
- **SQLite日志系统**：将所有日志存储到SQLite数据库，支持日志查询和统计
- **Gunicorn生产服务器**：支持使用Gunicorn作为生产环境WSGI服务器

## 主要接口

### 通用接口

- `GET /health` - 统一健康检查接口
- `GET /services` - 获取服务状态接口

### 日志管理接口

- `GET /api/logs` - 获取日志记录（支持分页、按级别和服务过滤）
- `GET /api/logs/stats` - 获取日志统计信息
- `POST /api/logs/cleanup` - 清理旧日志

### API代理服务接口（可配置启用/禁用）

- `POST /login` - 登录接口
- 其他路径 - 代理到目标服务器

### 短信服务接口（可配置启用/禁用）

- `POST /sms/callback` - 短信回调接口
- `POST /sms/send` - 发送验证码接口
- `POST /sms/verify` - 验证验证码接口

## 环境要求

- Python 3.7+
- 依赖项：见 `requirements.txt`

## 安装配置

### 1. 安装依赖

```bash
cd python-server
pip install -r requirements.txt
```

### 2. 配置文件

复制 `.env.example` 文件并根据实际情况修改：

```bash
cp .env.example .env
# 编辑 .env 文件
```

### 3. 主要配置项

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `ENABLE_API_PROXY` | 是否启用API代理服务 | `True` |
| `ENABLE_SMS_SERVICE` | 是否启用短信服务 | `True` |
| `SERVER_HOST` | 服务器主机地址 | `0.0.0.0` |
| `SERVER_PORT` | 服务器端口 | `8080` |
| `DATABASE_PATH` | SQLite数据库路径 | `./data/logs.db` |
| `AUTO_CLEANUP_DAYS` | 自动清理日志天数 | `0` |
| `ENABLE_SQLITE_LOG` | 是否启用SQLite日志 | `True` |
| `GUNICORN_WORKERS` | Gunicorn工作进程数 | `4` |
| `GUNICORN_THREADS` | Gunicorn线程数 | `2` |

## 运行服务

### 开发环境（Flask内置服务器）

```bash
cd python-server
python server.py
```

### 生产环境（推荐使用Gunicorn）

#### 方式一：直接使用Gunicorn命令

```bash
cd python-server
gunicorn -c gunicorn_config.py server:app
```

#### 方式二：自定义参数

```bash
cd python-server
gunicorn -w 4 -b 0.0.0.0:8080 --threads 2 server:app
```

**参数说明**：
- `-w 4`：工作进程数（建议：CPU核心数 * 2 + 1）
- `-b 0.0.0.0:8080`：绑定地址和端口
- `--threads 2`：每个工作进程的线程数
- `server:app`：模块名:应用对象名

### 使用systemd管理（推荐）

#### 1. 创建虚拟环境

```bash
cd python-server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. 配置服务文件

复制服务文件模板：

```bash
sudo cp python-server.service /etc/systemd/system/
```

编辑服务文件，修改以下配置：

```ini
User=your_username                    # 你的用户名
Group=your_groupname                  # 你的组名
Environment=PYTHON_SERVER_HOME=/path/to/python-server  # 实际路径
```

**说明**：服务文件使用 `PYTHON_SERVER_HOME` 变量统一管理路径，只需修改这一个变量即可，其他路径会自动推导。

#### 3. 启动服务

```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start python-server

# 设置开机自启
sudo systemctl enable python-server

# 查看服务状态
sudo systemctl status python-server
```

#### 4. 管理服务

```bash
# 停止服务
sudo systemctl stop python-server

# 重启服务
sudo systemctl restart python-server

# 查看日志
sudo journalctl -u python-server -f

# 查看最近100行日志
sudo journalctl -u python-server -n 100
```

### 使用Supervisor管理

创建配置文件 `/etc/supervisor/conf.d/python-server.conf`：

```ini
[program:python-server]
directory=/path/to/python-server
command=/path/to/python-server/venv/bin/gunicorn -c gunicorn_config.py server:app
autostart=true
autorestart=true
startsecs=5
user=your_username
stdout_logfile=/path/to/python-server/logs/supervisor.log
stderr_logfile=/path/to/python-server/logs/supervisor.err.log
environment=PATH="/path/to/python-server/venv/bin"
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
    "sms_service": true,
    "sqlite_log": true
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
  "sqlite_log": true,
  "timestamp": "2026-03-13T12:00:00"
}
```

### 日志管理接口

#### 获取日志记录

**请求**：

```bash
GET http://localhost:8080/api/logs?limit=100&offset=0&level=INFO&service=login
```

**响应**：

```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2026-03-13T12:00:00.000000",
      "level": "INFO",
      "service": "login",
      "message": "登录请求",
      "details": null,
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0 ..."
    }
  ],
  "stats": {
    "total": 100,
    "level_stats": {
      "INFO": 80,
      "ERROR": 10,
      "WARNING": 10
    },
    "service_stats": {
      "login": 50,
      "proxy": 30,
      "sms": 20
    }
  },
  "total": 1
}
```

#### 获取日志统计信息

**请求**：

```bash
GET http://localhost:8080/api/logs/stats
```

**响应**：

```json
{
  "total": 100,
  "level_stats": {
    "INFO": 80,
    "ERROR": 10,
    "WARNING": 10
  },
  "service_stats": {
    "login": 50,
    "proxy": 30,
    "sms": 20
  }
}
```

#### 清理旧日志

**请求**：

```bash
POST http://localhost:8080/api/logs/cleanup
Content-Type: application/json

{
  "days": 30
}
```

**响应**：

```json
{
  "message": "成功清理100条旧日志",
  "deleted_count": 100
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

## 日志系统说明

### SQLite数据库结构

**logs表**：

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 自增主键 |
| timestamp | TEXT | 时间戳（ISO格式） |
| level | TEXT | 日志级别（INFO/ERROR/WARNING/DEBUG） |
| service | TEXT | 服务名称（login/proxy/sms/health等） |
| message | TEXT | 日志消息 |
| details | TEXT | 详细信息（如异常栈） |
| ip_address | TEXT | 客户端IP地址 |
| user_agent | TEXT | 客户端用户代理 |

### 日志级别

- **INFO**：一般信息，如请求处理、服务启动等
- **WARNING**：警告信息，如短信发送失败等
- **ERROR**：错误信息，如API调用失败、服务异常等
- **DEBUG**：调试信息，如详细的请求参数、响应内容等

### 日志清理

系统已配置为不自动清理日志（`AUTO_CLEANUP_DAYS=0`），所有日志将永久保留。如需手动清理，可使用清理接口：

```bash
POST /api/logs/cleanup
```

### Gunicorn日志

Gunicorn会生成两类日志文件：

- **访问日志** (`logs/access.log`)：记录所有HTTP请求
- **错误日志** (`logs/error.log`)：记录应用程序错误和Gunicorn运行状态

## 安全注意事项

1. **环境变量**：不要将敏感信息（如APP_SECRET、SMS_APP_KEY）硬编码在代码中
2. **日志**：确保日志中不包含敏感信息
3. **频率限制**：服务已实现验证码发送频率限制，防止滥用
4. **验证码存储**：验证码存储在内存中，定期清理，确保安全性
5. **HTTPS**：在生产环境中，建议使用HTTPS加密传输
6. **数据库**：SQLite数据库文件应设置适当的权限，防止未授权访问
7. **Gunicorn**：生产环境建议使用Gunicorn，配置适当的worker数量和超时时间

## 故障排查

### 常见问题

1. **服务启动失败**：检查端口是否被占用，配置是否正确
2. **验证码发送失败**：检查腾讯云SMS配置是否正确，签名是否审核通过
3. **API代理失败**：检查目标服务器地址是否可达，APP_KEY和APP_SECRET是否正确
4. **验证码验证失败**：检查验证码是否过期，是否输入正确
5. **日志写入失败**：检查数据库目录权限，确保服务有写入权限
6. **Gunicorn启动失败**：检查Gunicorn是否正确安装，配置文件是否正确

### 排查步骤

1. 查看服务日志，了解具体错误信息
2. 检查网络连接是否正常
3. 验证配置文件中的参数是否正确
4. 测试相关接口，确认问题范围
5. 查看SQLite数据库中的日志记录，了解详细信息
6. 查看Gunicorn日志文件，了解服务运行状态

## 性能优化建议

### Gunicorn配置优化

1. **工作进程数**：
   - 推荐公式：`workers = CPU核心数 * 2 + 1`
   - I/O密集型应用可适当增加
   - CPU密集型应用可适当减少

2. **线程数**：
   - 推荐值：2-4
   - 根据应用类型调整

3. **工作模式**：
   - `sync`：默认模式，适合CPU密集型
   - `gevent`：适合I/O密集型，需要安装gevent
   - `eventlet`：适合I/O密集型，需要安装eventlet

### 其他优化

1. **配置Nginx反向代理**：
   使用Nginx作为反向代理，提高性能和安全性

2. **启用HTTPS**：
   在生产环境中启用HTTPS加密传输

3. **监控和报警**：
   配置监控和报警系统，及时发现和处理问题

4. **日志管理**：
   定期检查日志数据库大小，根据实际情况进行手动清理

5. **数据库优化**：
   - 定期执行VACUUM命令优化SQLite数据库
   - 考虑使用更强大的数据库（如PostgreSQL）处理大量日志

## 项目结构

```
python-server/
├── server.py                    # 统一服务入口
├── config.py                    # 配置管理
├── db_manager.py                # 数据库管理
├── sqlite_handler.py            # SQLite日志处理器
├── verification_code_manager.py # 验证码管理
├── gunicorn_config.py           # Gunicorn配置文件
├── python-server.service        # systemd服务文件
├── .env                         # 环境变量配置
├── .env.example                 # 环境变量配置模板
├── requirements.txt             # 依赖项
├── README.md                    # 使用手册
└── old_versions/                # 旧版本（保留备用）
    ├── api_proxy_server.py      # 旧版API代理服务器
    └── sms_service.py           # 旧版短信服务
```

## Gunicorn vs Flask内置服务器

| 特性 | Flask内置服务器 | Gunicorn |
|------|----------------|----------|
| **适用场景** | 开发环境 | 生产环境 |
| **性能** | 单进程，性能有限 | 多进程多线程，高性能 |
| **稳定性** | 不适合长期运行 | 稳定可靠，支持自动重启 |
| **并发处理** | 单线程 | 多进程多线程 |
| **日志管理** | 基础日志 | 完善的日志系统 |
| **进程管理** | 无 | 支持进程监控和管理 |
| **安全性** | 基础安全 | 生产级安全配置 |

**推荐**：生产环境务必使用Gunicorn！
