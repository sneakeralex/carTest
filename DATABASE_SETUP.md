# 🗄️ Database Setup Guide

This guide will help you set up the MySQL database for the Car Management System.

## Prerequisites

- MySQL 8.0+ installed and running
- MySQL client or MySQL Workbench
- Java 17+ for running the backend

## Step 1: Install MySQL (if not already installed)

### macOS (using Homebrew)
```bash
brew install mysql
brew services start mysql
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Windows
Download and install MySQL from [official website](https://dev.mysql.com/downloads/mysql/)

## Step 2: Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts to:
- Set root password (use: `123456` to match config)
- Remove anonymous users
- Disallow root login remotely
- Remove test database
- Reload privilege tables

## Step 3: Create Database and User

### Option A: Using MySQL Command Line

1. **Connect to MySQL as root:**
```bash
mysql -u root -p
```

2. **Execute the initialization script:**
```sql
SOURCE /path/to/your/project/sql/init_database.sql;
```

### Option B: Manual Setup

1. **Connect to MySQL:**
```bash
mysql -u root -p
```

2. **Create database:**
```sql
CREATE DATABASE car_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Create user (optional, for production):**
```sql
CREATE USER 'carservice'@'localhost' IDENTIFIED BY 'carservice123';
GRANT ALL PRIVILEGES ON car_management_system.* TO 'carservice'@'localhost';
FLUSH PRIVILEGES;
```

4. **Use the database:**
```sql
USE car_management_system;
```

5. **Run the initialization script:**
```sql
SOURCE /path/to/your/project/sql/init_database.sql;
```

## Step 4: Verify Database Setup

1. **Check if tables were created:**
```sql
USE car_management_system;
SHOW TABLES;
```

You should see tables like:
- user
- vehicle
- vehicle_type
- test_site
- test_task

2. **Check sample data:**
```sql
SELECT * FROM user;
SELECT * FROM vehicle_type;
SELECT * FROM test_site;
```

## Step 5: Update Application Configuration (if needed)

The application is configured to use:
- **Host:** localhost
- **Port:** 3306 (default MySQL port)
- **Database:** car_management_system
- **Username:** root
- **Password:** 123456

If you want to use different credentials, update `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/car_management_system?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

## Step 6: Test Database Connection

1. **Start the backend application:**
```bash
cd backend
mvn spring-boot:run
```

2. **Check logs for successful connection:**
Look for messages like:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

3. **Test API endpoints:**
```bash
# Test user login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

## Default Test Accounts

The database comes with pre-configured test accounts:

### Admin Account
- **Username:** admin
- **Password:** admin123
- **Role:** ADMIN

### Test User Account
- **Username:** testuser
- **Password:** test123
- **Role:** CUSTOMER

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Ensure MySQL is running: `brew services start mysql` (macOS) or `sudo systemctl start mysql` (Linux)
   - Check if port 3306 is available: `netstat -an | grep 3306`

2. **Access denied:**
   - Verify username/password in application.yml
   - Check MySQL user permissions

3. **Database doesn't exist:**
   - Run the initialization script again
   - Manually create database: `CREATE DATABASE car_management_system;`

4. **Table creation errors:**
   - Check MySQL version (requires 8.0+)
   - Verify character set support

### Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Show current database
SELECT DATABASE();

-- Show all tables in current database
SHOW TABLES;

-- Describe table structure
DESCRIBE user;

-- Check table data
SELECT COUNT(*) FROM user;

-- Reset auto-increment
ALTER TABLE user AUTO_INCREMENT = 1;
```

## Next Steps

After successful database setup:

1. ✅ Database is ready
2. ✅ Start the backend application
3. ✅ Test API endpoints
4. ✅ Frontend will automatically connect to backend APIs
5. ✅ Enjoy the full-stack application!

## Production Considerations

For production deployment:

1. **Create dedicated database user** with limited privileges
2. **Enable SSL connections**
3. **Configure proper backup strategy**
4. **Set up monitoring and logging**
5. **Use environment variables** for sensitive configuration
