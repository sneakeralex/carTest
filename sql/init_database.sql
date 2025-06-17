-- Car Management System Database Initialization Script
-- Execute this script to set up the database and initial data

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS car_management_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE car_management_system;

-- Create user table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL COMMENT '用户ID',
    username VARCHAR(100) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    real_name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    avatar VARCHAR(500) COMMENT '头像URL',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    role VARCHAR(20) DEFAULT 'CUSTOMER' COMMENT '角色',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_status (status)
) COMMENT '用户表';

-- Create vehicle_type table
CREATE TABLE IF NOT EXISTS vehicle_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_id VARCHAR(50) UNIQUE NOT NULL COMMENT '车型ID',
    type_name VARCHAR(100) NOT NULL COMMENT '车型名称',
    type_code VARCHAR(50) UNIQUE NOT NULL COMMENT '车型编码',
    category VARCHAR(50) COMMENT '车辆类别',
    description TEXT COMMENT '描述',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_type_code (type_code),
    INDEX idx_category (category),
    INDEX idx_status (status)
) COMMENT '车辆类型表';

-- Create vehicle table
CREATE TABLE IF NOT EXISTS vehicle (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_no VARCHAR(50) UNIQUE NOT NULL COMMENT '车辆编号',
    license_plate VARCHAR(20) UNIQUE NOT NULL COMMENT '车牌号',
    vin VARCHAR(50) UNIQUE COMMENT 'VIN码',
    brand VARCHAR(100) NOT NULL COMMENT '品牌',
    model VARCHAR(100) NOT NULL COMMENT '型号',
    color VARCHAR(50) COMMENT '颜色',
    year_of_manufacture INT COMMENT '制造年份',
    engine_number VARCHAR(100) COMMENT '发动机号',
    type_id VARCHAR(50) COMMENT '车型ID',
    owner_id VARCHAR(50) NOT NULL COMMENT '车主ID',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    registration_date DATE COMMENT '注册日期',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_license_plate (license_plate),
    INDEX idx_vin (vin),
    INDEX idx_owner_id (owner_id),
    INDEX idx_type_id (type_id),
    INDEX idx_status (status),
    FOREIGN KEY (owner_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES vehicle_type(type_id) ON DELETE SET NULL
) COMMENT '车辆表';

-- Create test_site table
CREATE TABLE IF NOT EXISTS test_site (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_id VARCHAR(50) UNIQUE NOT NULL COMMENT '测试场ID',
    site_name VARCHAR(200) NOT NULL COMMENT '测试场名称',
    site_code VARCHAR(50) UNIQUE NOT NULL COMMENT '测试场编码',
    address TEXT NOT NULL COMMENT '地址',
    phone VARCHAR(20) COMMENT '电话',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区域',
    latitude DECIMAL(10, 8) COMMENT '纬度',
    longitude DECIMAL(11, 8) COMMENT '经度',
    operating_hours VARCHAR(100) COMMENT '营业时间',
    description TEXT COMMENT '描述',
    area DECIMAL(10,2) COMMENT '场地面积',
    max_vehicles INT DEFAULT 10 COMMENT '最大容纳车辆数',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_site_code (site_code),
    INDEX idx_city (city),
    INDEX idx_district (district),
    INDEX idx_status (status)
) COMMENT '测试场表';

-- Create test_task table
CREATE TABLE IF NOT EXISTS test_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id VARCHAR(50) UNIQUE NOT NULL COMMENT '测试任务ID',
    task_name VARCHAR(200) NOT NULL COMMENT '任务名称',
    task_code VARCHAR(50) UNIQUE NOT NULL COMMENT '任务编码',
    task_type VARCHAR(50) NOT NULL COMMENT '任务类型',
    description TEXT COMMENT '描述',
    difficulty VARCHAR(20) DEFAULT 'MEDIUM' COMMENT '难度等级',
    estimated_duration INT COMMENT '预计时长(小时)',
    fee DECIMAL(10,2) DEFAULT 0 COMMENT '费用',
    max_participants INT DEFAULT 10 COMMENT '最大参与人数',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_task_code (task_code),
    INDEX idx_task_type (task_type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
) COMMENT '测试任务表';

-- Insert initial data
-- Insert vehicle types
INSERT IGNORE INTO vehicle_type (type_id, type_name, type_code, category, description) VALUES
('VT001', '轿车', 'SEDAN', 'PASSENGER', '普通轿车'),
('VT002', 'SUV', 'SUV', 'PASSENGER', '运动型多用途车辆'),
('VT003', '货车', 'TRUCK', 'COMMERCIAL', '货运车辆'),
('VT004', '客车', 'BUS', 'COMMERCIAL', '客运车辆');

-- Insert test sites
INSERT IGNORE INTO test_site (site_id, site_name, site_code, address, phone, city, district, operating_hours, description, area, max_vehicles) VALUES
('TS001', '北京汽车测试场', 'BJ001', '北京市朝阳区测试路1号', '010-12345678', '北京', '朝阳区', '08:00-18:00', '专业汽车测试场地', 5000.00, 20),
('TS002', '上海汽车检测中心', 'SH001', '上海市浦东新区检测大道2号', '021-87654321', '上海', '浦东新区', '09:00-17:00', '综合汽车检测中心', 3000.00, 15),
('TS003', '广州车辆测试基地', 'GZ001', '广州市天河区测试园3号', '020-11111111', '广州', '天河区', '08:30-17:30', '南方汽车测试基地', 4000.00, 18);

-- Insert test tasks
INSERT IGNORE INTO test_task (task_id, task_name, task_code, task_type, description, difficulty, estimated_duration, fee, max_participants) VALUES
('TT001', '车辆性能测试', 'PERF001', 'PERFORMANCE', '全面的车辆性能评估测试', 'MEDIUM', 4, 500.00, 10),
('TT002', '安全性能测试', 'SAFE001', 'SAFETY', '车辆安全系统全面检测', 'HARD', 6, 800.00, 8),
('TT003', '排放测试', 'EMIS001', 'EMISSION', '车辆尾气排放标准检测', 'EASY', 2, 200.00, 15),
('TT004', '综合检测', 'COMP001', 'COMPREHENSIVE', '车辆综合性能检测', 'HARD', 8, 1200.00, 5);

-- Insert admin user (password: admin123)
INSERT IGNORE INTO user (user_id, username, password, real_name, phone, email, role, status) VALUES
('USR001', 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyF5bNNnTaHbDUaUBJa2jxvf2Oy', '系统管理员', '13800138000', 'admin@cartest.com', 'ADMIN', 'ACTIVE');

-- Insert test user (password: test123)
INSERT IGNORE INTO user (user_id, username, password, real_name, phone, email, role, status) VALUES
('USR002', 'testuser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '测试用户', '13900139000', 'test@cartest.com', 'CUSTOMER', 'ACTIVE');

-- Insert sample vehicles
INSERT IGNORE INTO vehicle (vehicle_no, license_plate, vin, brand, model, color, year_of_manufacture, type_id, owner_id) VALUES
('V001', '京A12345', 'WVWZZZ1JZ3W386752', '奥迪', 'A4L', '白色', 2022, 'VT001', 'USR002'),
('V002', '京B67890', 'LSGGH52U6DH123456', '宝马', 'X3', '黑色', 2021, 'VT002', 'USR002'),
('V003', '京C11111', 'WDD2130461A123456', '奔驰', 'C200', '银色', 2023, 'VT001', 'USR002');

COMMIT;
