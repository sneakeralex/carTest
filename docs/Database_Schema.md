# Car Test Site Booking Management System - Database Schema

## Overview
This document describes the database schema for the Car Test Site Booking Management System. The system uses MySQL as the primary database with JPA/Hibernate for ORM mapping.

## Database Configuration
- **Database**: MySQL 8.0+
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Engine**: InnoDB

## Core Tables

### 1. Users Table (users)
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL COMMENT '用户ID',
    username VARCHAR(100) UNIQUE NOT NULL COMMENT '用户名/邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    gender VARCHAR(10) COMMENT '性别',
    birth_date DATE COMMENT '出生日期',
    id_card VARCHAR(20) COMMENT '身份证号',
    address TEXT COMMENT '地址',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE, INACTIVE, LOCKED',
    role VARCHAR(20) DEFAULT 'CUSTOMER' COMMENT '角色: ADMIN, CUSTOMER, TECHNICIAN',
    person_type VARCHAR(20) COMMENT '人员类型',
    qualification TEXT COMMENT '资质信息',
    is_published BOOLEAN DEFAULT FALSE COMMENT '是否发布',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_user_id (user_id),
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_role (role),
    INDEX idx_created_time (created_time)
) COMMENT '用户表';
```

### 2. Roles Table (roles)
```sql
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL COMMENT '角色编码',
    role_name VARCHAR(100) NOT NULL COMMENT '角色名称',
    description TEXT COMMENT '角色描述',
    permissions JSON COMMENT '权限列表',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_role_code (role_code),
    INDEX idx_status (status)
) COMMENT '角色表';
```

### 3. User Roles Table (user_roles)
```sql
CREATE TABLE user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    role_code VARCHAR(50) NOT NULL COMMENT '角色编码',
    assigned_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    assigned_by VARCHAR(50) COMMENT '分配人',
    
    UNIQUE KEY uk_user_role (user_id, role_code),
    INDEX idx_user_id (user_id),
    INDEX idx_role_code (role_code),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_code) REFERENCES roles(role_code) ON DELETE CASCADE
) COMMENT '用户角色关联表';
```

### 4. Vehicles Table (vehicles)
```sql
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_no VARCHAR(20) UNIQUE NOT NULL COMMENT '车牌号',
    vin VARCHAR(50) UNIQUE COMMENT '车架号',
    owner_id VARCHAR(50) NOT NULL COMMENT '车主ID',
    type_id VARCHAR(50) COMMENT '车辆类型ID',
    brand VARCHAR(50) COMMENT '品牌',
    model VARCHAR(50) COMMENT '型号',
    color VARCHAR(20) COMMENT '颜色',
    engine_no VARCHAR(50) COMMENT '发动机号',
    purchase_date DATE COMMENT '购买日期',
    mileage DECIMAL(10,2) COMMENT '里程数',
    status INT DEFAULT 1 COMMENT '状态: 1-正常, 2-维修中, 3-报废',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_vehicle_no (vehicle_no),
    INDEX idx_owner_id (owner_id),
    INDEX idx_vin (vin),
    INDEX idx_brand_model (brand, model),
    INDEX idx_status (status),
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '车辆表';
```

### 5. Vehicle Types Table (vehicle_types)
```sql
CREATE TABLE vehicle_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_code VARCHAR(50) UNIQUE NOT NULL COMMENT '类型编码',
    type_name VARCHAR(100) NOT NULL COMMENT '类型名称',
    description TEXT COMMENT '描述',
    specifications JSON COMMENT '规格参数',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_type_code (type_code)
) COMMENT '车辆类型表';
```

### 6. Test Sites Table (test_sites)
```sql
CREATE TABLE test_sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_id VARCHAR(50) UNIQUE NOT NULL COMMENT '检测站ID',
    name VARCHAR(200) NOT NULL COMMENT '检测站名称',
    address TEXT NOT NULL COMMENT '地址',
    phone VARCHAR(20) COMMENT '电话',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区域',
    latitude DECIMAL(10, 8) COMMENT '纬度',
    longitude DECIMAL(11, 8) COMMENT '经度',
    operating_hours VARCHAR(100) COMMENT '营业时间',
    services JSON COMMENT '服务项目',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    safety_requirements TEXT COMMENT '安全要求',
    contact_info JSON COMMENT '联系信息',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_site_id (site_id),
    INDEX idx_city_district (city, district),
    INDEX idx_status (status),
    INDEX idx_location (latitude, longitude)
) COMMENT '检测站表';
```

### 7. Time Slots Table (time_slots)
```sql
CREATE TABLE time_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_id VARCHAR(50) UNIQUE NOT NULL COMMENT '时段ID',
    test_site_id VARCHAR(50) NOT NULL COMMENT '检测站ID',
    date DATE NOT NULL COMMENT '日期',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    total_slots INT DEFAULT 10 COMMENT '总槽位数',
    available_slots INT DEFAULT 10 COMMENT '可用槽位数',
    status VARCHAR(20) DEFAULT 'AVAILABLE' COMMENT '状态',
    description TEXT COMMENT '描述',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_slot_id (slot_id),
    INDEX idx_test_site_date (test_site_id, date),
    INDEX idx_status (status),
    FOREIGN KEY (test_site_id) REFERENCES test_sites(site_id) ON DELETE CASCADE
) COMMENT '时间段表';
```

### 8. Bookings Table (bookings)
```sql
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_no VARCHAR(50) UNIQUE NOT NULL COMMENT '预约单号',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    vehicle_id VARCHAR(50) NOT NULL COMMENT '车辆ID',
    test_site_id VARCHAR(50) NOT NULL COMMENT '检测站ID',
    time_slot_id VARCHAR(50) NOT NULL COMMENT '时段ID',
    booking_date DATE NOT NULL COMMENT '预约日期',
    time_slot VARCHAR(20) NOT NULL COMMENT '时间段',
    service_type VARCHAR(50) NOT NULL COMMENT '服务类型',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING, CONFIRMED, COMPLETED, CANCELLED',
    notes TEXT COMMENT '备注',
    estimated_duration INT COMMENT '预计时长(分钟)',
    actual_start_time TIMESTAMP NULL COMMENT '实际开始时间',
    actual_end_time TIMESTAMP NULL COMMENT '实际结束时间',
    result VARCHAR(20) COMMENT '检测结果: PASS, FAIL',
    cancellation_reason TEXT COMMENT '取消原因',
    weather_id VARCHAR(50) COMMENT '天气ID',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',
    
    INDEX idx_booking_no (booking_no),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_test_site_id (test_site_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_no) ON DELETE CASCADE,
    FOREIGN KEY (test_site_id) REFERENCES test_sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(slot_id) ON DELETE CASCADE
) COMMENT '预约表';

### 9. Maintenance Table (maintenance)
```sql
CREATE TABLE maintenance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    maintenance_no VARCHAR(50) UNIQUE NOT NULL COMMENT '维修单号',
    vehicle_id VARCHAR(50) NOT NULL COMMENT '车辆ID',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    type VARCHAR(50) NOT NULL COMMENT '类型: 保养, 维修, 检查',
    description TEXT NOT NULL COMMENT '描述',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
    priority VARCHAR(20) DEFAULT 'NORMAL' COMMENT '优先级: LOW, NORMAL, HIGH, URGENT',
    scheduled_date TIMESTAMP NOT NULL COMMENT '预约时间',
    actual_start_time TIMESTAMP NULL COMMENT '实际开始时间',
    actual_end_time TIMESTAMP NULL COMMENT '实际结束时间',
    estimated_cost DECIMAL(10,2) COMMENT '预估费用',
    actual_cost DECIMAL(10,2) COMMENT '实际费用',
    technician_id VARCHAR(50) COMMENT '技师ID',
    notes TEXT COMMENT '备注',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除',
    version INT DEFAULT 0 COMMENT '版本号',

    INDEX idx_maintenance_no (maintenance_no),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_technician_id (technician_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_no) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(user_id) ON DELETE SET NULL
) COMMENT '维修保养表';
```

### 10. Maintenance Items Table (maintenance_items)
```sql
CREATE TABLE maintenance_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(50) UNIQUE NOT NULL COMMENT '项目ID',
    maintenance_no VARCHAR(50) NOT NULL COMMENT '维修单号',
    item_name VARCHAR(200) NOT NULL COMMENT '项目名称',
    item_type VARCHAR(50) COMMENT '项目类型',
    description TEXT COMMENT '描述',
    quantity INT DEFAULT 1 COMMENT '数量',
    unit_price DECIMAL(10,2) COMMENT '单价',
    total_price DECIMAL(10,2) COMMENT '总价',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态',
    notes TEXT COMMENT '备注',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_item_id (item_id),
    INDEX idx_maintenance_no (maintenance_no),
    INDEX idx_item_type (item_type),
    FOREIGN KEY (maintenance_no) REFERENCES maintenance(maintenance_no) ON DELETE CASCADE
) COMMENT '维修项目表';
```

### 11. Work Orders Table (work_orders)
```sql
CREATE TABLE work_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '工单号',
    maintenance_id VARCHAR(50) COMMENT '维修ID',
    title VARCHAR(200) NOT NULL COMMENT '工单标题',
    description TEXT NOT NULL COMMENT '工单描述',
    priority VARCHAR(20) DEFAULT 'NORMAL' COMMENT '优先级',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED',
    assigned_to VARCHAR(50) COMMENT '分配给技师ID',
    estimated_hours DECIMAL(5,2) COMMENT '预估工时',
    actual_hours DECIMAL(5,2) COMMENT '实际工时',
    start_time TIMESTAMP NULL COMMENT '开始时间',
    end_time TIMESTAMP NULL COMMENT '结束时间',
    completion_notes TEXT COMMENT '完成备注',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',

    INDEX idx_order_no (order_no),
    INDEX idx_maintenance_id (maintenance_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    FOREIGN KEY (maintenance_id) REFERENCES maintenance(maintenance_no) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
) COMMENT '工单表';
```

### 12. Appointments Table (appointments)
```sql
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_no VARCHAR(50) UNIQUE NOT NULL COMMENT '预约号',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    service_type VARCHAR(50) NOT NULL COMMENT '服务类型',
    appointment_date TIMESTAMP NOT NULL COMMENT '预约时间',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING, APPROVED, COMPLETED, CANCELLED',
    description TEXT COMMENT '描述',
    phone VARCHAR(20) COMMENT '联系电话',
    notes TEXT COMMENT '备注',
    approved_by VARCHAR(50) COMMENT '审批人',
    approved_time TIMESTAMP NULL COMMENT '审批时间',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_appointment_no (appointment_no),
    INDEX idx_user_id (user_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '预约表';
```

### 13. Equipment Table (equipment)
```sql
CREATE TABLE equipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment_id VARCHAR(50) UNIQUE NOT NULL COMMENT '设备ID',
    name VARCHAR(200) NOT NULL COMMENT '设备名称',
    category VARCHAR(50) NOT NULL COMMENT '设备类别',
    model VARCHAR(100) COMMENT '型号',
    manufacturer VARCHAR(100) COMMENT '制造商',
    serial_number VARCHAR(100) COMMENT '序列号',
    status VARCHAR(20) DEFAULT 'AVAILABLE' COMMENT '状态: AVAILABLE, IN_USE, MAINTENANCE, OUT_OF_SERVICE',
    location VARCHAR(200) COMMENT '位置',
    purchase_date DATE COMMENT '购买日期',
    purchase_price DECIMAL(12,2) COMMENT '购买价格',
    warranty_expiry DATE COMMENT '保修到期日',
    last_maintenance_date DATE COMMENT '上次维护日期',
    next_maintenance_date DATE COMMENT '下次维护日期',
    specifications JSON COMMENT '规格参数',
    notes TEXT COMMENT '备注',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_equipment_id (equipment_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_location (location)
) COMMENT '设备表';
```
```
