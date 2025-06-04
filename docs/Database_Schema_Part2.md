# Car Test Site Booking Management System - Database Schema (Part 2)

## Additional Tables

### 14. Equipment Requests Table (equipment_requests)
```sql
CREATE TABLE equipment_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(50) UNIQUE NOT NULL COMMENT '申请ID',
    equipment_id VARCHAR(50) NOT NULL COMMENT '设备ID',
    user_id VARCHAR(50) NOT NULL COMMENT '申请人ID',
    request_type VARCHAR(20) NOT NULL COMMENT '申请类型: BORROW, RESERVE, MAINTENANCE',
    start_date TIMESTAMP NOT NULL COMMENT '开始时间',
    end_date TIMESTAMP NOT NULL COMMENT '结束时间',
    purpose TEXT COMMENT '使用目的',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING, APPROVED, REJECTED, RETURNED',
    approved_by VARCHAR(50) COMMENT '审批人',
    approved_time TIMESTAMP NULL COMMENT '审批时间',
    returned_time TIMESTAMP NULL COMMENT '归还时间',
    condition_on_return VARCHAR(20) COMMENT '归还时状态: GOOD, DAMAGED, LOST',
    notes TEXT COMMENT '备注',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_request_id (request_id),
    INDEX idx_equipment_id (equipment_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '设备申请表';
```

### 15. Messages Table (messages)
```sql
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(50) UNIQUE NOT NULL COMMENT '消息ID',
    sender_id VARCHAR(50) NOT NULL COMMENT '发送者ID',
    receiver_id VARCHAR(50) COMMENT '接收者ID',
    message_type VARCHAR(20) NOT NULL COMMENT '消息类型: SYSTEM, USER, NOTIFICATION',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    priority VARCHAR(20) DEFAULT 'NORMAL' COMMENT '优先级: LOW, NORMAL, HIGH, URGENT',
    status VARCHAR(20) DEFAULT 'UNREAD' COMMENT '状态: UNREAD, READ, ARCHIVED',
    category VARCHAR(50) COMMENT '分类',
    related_id VARCHAR(50) COMMENT '关联ID',
    related_type VARCHAR(50) COMMENT '关联类型',
    scheduled_time TIMESTAMP NULL COMMENT '定时发送时间',
    read_time TIMESTAMP NULL COMMENT '阅读时间',
    attachments JSON COMMENT '附件信息',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_message_id (message_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_message_type (message_type),
    INDEX idx_status (status),
    INDEX idx_created_time (created_time),
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '消息表';
```

### 16. Message Templates Table (message_templates)
```sql
CREATE TABLE message_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    template_id VARCHAR(50) UNIQUE NOT NULL COMMENT '模板ID',
    name VARCHAR(200) NOT NULL COMMENT '模板名称',
    type VARCHAR(50) NOT NULL COMMENT '模板类型',
    title VARCHAR(200) NOT NULL COMMENT '标题模板',
    content TEXT NOT NULL COMMENT '内容模板',
    variables JSON COMMENT '变量定义',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    description TEXT COMMENT '描述',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_template_id (template_id),
    INDEX idx_type (type),
    INDEX idx_status (status)
) COMMENT '消息模板表';
```

### 17. Files Table (files)
```sql
CREATE TABLE files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_id VARCHAR(50) UNIQUE NOT NULL COMMENT '文件ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    original_file_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    file_type VARCHAR(50) COMMENT '文件类型',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_url VARCHAR(500) COMMENT '文件URL',
    description TEXT COMMENT '文件描述',
    uploader_id VARCHAR(50) NOT NULL COMMENT '上传者ID',
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    download_count INT DEFAULT 0 COMMENT '下载次数',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    
    INDEX idx_file_id (file_id),
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_file_type (file_type),
    INDEX idx_upload_time (upload_time),
    FOREIGN KEY (uploader_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '文件表';
```

### 18. User Attachments Table (user_attachments)
```sql
CREATE TABLE user_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attachment_id VARCHAR(50) UNIQUE NOT NULL COMMENT '附件ID',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    file_id VARCHAR(50) NOT NULL COMMENT '文件ID',
    attachment_type VARCHAR(50) NOT NULL COMMENT '附件类型: ID_CARD, DRIVER_LICENSE, CERTIFICATE',
    description TEXT COMMENT '描述',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_attachment_id (attachment_id),
    INDEX idx_user_id (user_id),
    INDEX idx_file_id (file_id),
    INDEX idx_attachment_type (attachment_type),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE
) COMMENT '用户附件表';
```

### 19. Test Tasks Table (test_tasks)
```sql
CREATE TABLE test_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id VARCHAR(50) UNIQUE NOT NULL COMMENT '任务ID',
    title VARCHAR(200) NOT NULL COMMENT '任务标题',
    description TEXT COMMENT '任务描述',
    task_type VARCHAR(50) NOT NULL COMMENT '任务类型',
    difficulty VARCHAR(20) DEFAULT 'MEDIUM' COMMENT '难度: EASY, MEDIUM, HARD',
    duration INT COMMENT '时长(分钟)',
    max_score DECIMAL(5,2) DEFAULT 100.00 COMMENT '满分',
    pass_score DECIMAL(5,2) DEFAULT 60.00 COMMENT '及格分',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    instructions TEXT COMMENT '说明',
    requirements JSON COMMENT '要求',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    created_by VARCHAR(50) COMMENT '创建人',
    updated_by VARCHAR(50) COMMENT '更新人',
    
    INDEX idx_task_id (task_id),
    INDEX idx_task_type (task_type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_status (status)
) COMMENT '测试任务表';
```

### 20. Test Registrations Table (test_registrations)
```sql
CREATE TABLE test_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(50) UNIQUE NOT NULL COMMENT '报名ID',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    task_id VARCHAR(50) NOT NULL COMMENT '任务ID',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
    scheduled_date TIMESTAMP COMMENT '预约考试时间',
    status VARCHAR(20) DEFAULT 'REGISTERED' COMMENT '状态: REGISTERED, SCHEDULED, COMPLETED, CANCELLED',
    score DECIMAL(5,2) COMMENT '得分',
    result VARCHAR(20) COMMENT '结果: PASS, FAIL',
    attempt_count INT DEFAULT 0 COMMENT '尝试次数',
    notes TEXT COMMENT '备注',
    completed_time TIMESTAMP NULL COMMENT '完成时间',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_registration_id (registration_id),
    INDEX idx_user_id (user_id),
    INDEX idx_task_id (task_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES test_tasks(task_id) ON DELETE CASCADE
) COMMENT '测试报名表';
```

## Database Relationships

### Entity Relationship Diagram (ERD) Description

1. **Users** (Central Entity)
   - One-to-Many with Vehicles (owner_id)
   - One-to-Many with Bookings (user_id)
   - One-to-Many with Maintenance (user_id, technician_id)
   - One-to-Many with Appointments (user_id)
   - One-to-Many with Equipment Requests (user_id)
   - One-to-Many with Messages (sender_id, receiver_id)
   - One-to-Many with Files (uploader_id)
   - Many-to-Many with Roles (through user_roles)

2. **Vehicles**
   - Many-to-One with Users (owner_id)
   - Many-to-One with Vehicle Types (type_id)
   - One-to-Many with Bookings (vehicle_id)
   - One-to-Many with Maintenance (vehicle_id)

3. **Test Sites**
   - One-to-Many with Time Slots (test_site_id)
   - One-to-Many with Bookings (test_site_id)

4. **Bookings**
   - Many-to-One with Users (user_id)
   - Many-to-One with Vehicles (vehicle_id)
   - Many-to-One with Test Sites (test_site_id)
   - Many-to-One with Time Slots (time_slot_id)

5. **Maintenance**
   - Many-to-One with Users (user_id, technician_id)
   - Many-to-One with Vehicles (vehicle_id)
   - One-to-Many with Maintenance Items (maintenance_no)
   - One-to-Many with Work Orders (maintenance_id)

6. **Equipment**
   - One-to-Many with Equipment Requests (equipment_id)

## Indexes and Performance Optimization

### Primary Indexes
- All tables have AUTO_INCREMENT primary keys
- Unique indexes on business keys (user_id, vehicle_no, booking_no, etc.)

### Secondary Indexes
- Foreign key columns for join performance
- Status columns for filtering
- Date/time columns for range queries
- Composite indexes for common query patterns

### Performance Considerations
1. **Partitioning**: Consider partitioning large tables by date (bookings, maintenance, messages)
2. **Archiving**: Implement data archiving strategy for historical records
3. **Caching**: Use Redis for frequently accessed data
4. **Read Replicas**: Consider read replicas for reporting queries

## Data Integrity Constraints

### Foreign Key Constraints
- CASCADE DELETE for dependent records
- SET NULL for optional references
- Proper referential integrity maintained

### Check Constraints
- Status values restricted to predefined enums
- Date validations (end_date > start_date)
- Positive values for prices and quantities

### Triggers (Recommended)
```sql
-- Update timestamps automatically
CREATE TRIGGER update_timestamp 
BEFORE UPDATE ON users 
FOR EACH ROW 
SET NEW.updated_time = CURRENT_TIMESTAMP;

-- Audit trail for sensitive operations
CREATE TRIGGER audit_user_changes 
AFTER UPDATE ON users 
FOR EACH ROW 
INSERT INTO audit_log (table_name, operation, old_values, new_values, changed_by, changed_at)
VALUES ('users', 'UPDATE', JSON_OBJECT(...), JSON_OBJECT(...), USER(), NOW());
```
