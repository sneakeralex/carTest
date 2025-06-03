-- 车辆管理系统数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS car_management_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用数据库
USE car_management_system;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码（加密存储）',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint(1) DEFAULT '0' COMMENT '性别：0未知，1男，2女',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：0禁用，1启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) NOT NULL COMMENT '角色编码',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：0禁用，1启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS `user_role_rel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 车辆类型表
CREATE TABLE IF NOT EXISTS `vehicle_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  `type_name` varchar(50) NOT NULL COMMENT '类型名称',
  `type_code` varchar(50) NOT NULL COMMENT '类型编码',
  `description` varchar(255) DEFAULT NULL COMMENT '类型描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_type_code` (`type_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车辆类型表';

-- 车辆表
CREATE TABLE IF NOT EXISTS `vehicle` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '车辆ID',
  `vehicle_no` varchar(50) NOT NULL COMMENT '车牌号',
  `vin` varchar(50) NOT NULL COMMENT '车架号',
  `type_id` bigint(20) NOT NULL COMMENT '车辆类型ID',
  `brand` varchar(50) NOT NULL COMMENT '品牌',
  `model` varchar(50) NOT NULL COMMENT '型号',
  `color` varchar(20) DEFAULT NULL COMMENT '颜色',
  `engine_no` varchar(50) DEFAULT NULL COMMENT '发动机号',
  `purchase_date` date DEFAULT NULL COMMENT '购买日期',
  `mileage` decimal(10,2) DEFAULT '0.00' COMMENT '行驶里程(km)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：0停用，1正常，2维修中，3报废',
  `owner_id` bigint(20) DEFAULT NULL COMMENT '车主ID（关联用户表）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vehicle_no` (`vehicle_no`),
  UNIQUE KEY `uk_vin` (`vin`),
  KEY `idx_type_id` (`type_id`),
  KEY `idx_owner_id` (`owner_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车辆表';

-- 维修保养表
CREATE TABLE IF NOT EXISTS `maintenance` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '维修保养ID',
  `vehicle_id` bigint(20) NOT NULL COMMENT '车辆ID',
  `maintenance_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '类型：1保养，2维修',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `mileage` decimal(10,2) DEFAULT '0.00' COMMENT '当前里程(km)',
  `description` varchar(500) DEFAULT NULL COMMENT '维修保养描述',
  `cost` decimal(10,2) DEFAULT '0.00' COMMENT '费用',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态：0待处理，1处理中，2已完成，3已取消',
  `operator_id` bigint(20) DEFAULT NULL COMMENT '操作人ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  KEY `idx_vehicle_id` (`vehicle_id`),
  KEY `idx_status` (`status`),
  KEY `idx_maintenance_type` (`maintenance_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='维修保养表';

-- 维修项目表
CREATE TABLE IF NOT EXISTS `maintenance_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `maintenance_id` bigint(20) NOT NULL COMMENT '维修保养ID',
  `item_name` varchar(100) NOT NULL COMMENT '项目名称',
  `item_code` varchar(50) DEFAULT NULL COMMENT '项目编码',
  `quantity` int(11) NOT NULL DEFAULT '1' COMMENT '数量',
  `unit_price` decimal(10,2) DEFAULT '0.00' COMMENT '单价',
  `total_price` decimal(10,2) DEFAULT '0.00' COMMENT '总价',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_maintenance_id` (`maintenance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='维修项目表';

-- 维修工单表
CREATE TABLE IF NOT EXISTS `work_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '工单ID',
  `order_no` varchar(50) NOT NULL COMMENT '工单编号',
  `maintenance_id` bigint(20) NOT NULL COMMENT '维修保养ID',
  `vehicle_id` bigint(20) NOT NULL COMMENT '车辆ID',
  `technician_id` bigint(20) DEFAULT NULL COMMENT '技术人员ID',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态：0待分配，1处理中，2已完成，3已取消',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_maintenance_id` (`maintenance_id`),
  KEY `idx_vehicle_id` (`vehicle_id`),
  KEY `idx_technician_id` (`technician_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='维修工单表';

-- 预约试驾表
CREATE TABLE IF NOT EXISTS `appointment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '预约ID',
  `appointment_no` varchar(50) NOT NULL COMMENT '预约编号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `vehicle_id` bigint(20) NOT NULL COMMENT '车辆ID',
  `appointment_time` datetime NOT NULL COMMENT '预约时间',
  `duration` int(11) DEFAULT '60' COMMENT '预计时长(分钟)',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态：0待审核，1已审核，2已完成，3已取消',
  `contact_name` varchar(50) NOT NULL COMMENT '联系人姓名',
  `contact_phone` varchar(20) NOT NULL COMMENT '联系人电话',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `feedback` varchar(500) DEFAULT NULL COMMENT '试驾反馈',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_appointment_no` (`appointment_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_vehicle_id` (`vehicle_id`),
  KEY `idx_status` (`status`),
  KEY `idx_appointment_time` (`appointment_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约试驾表';

-- 插入初始数据

-- 角色数据
INSERT INTO `role` (`role_name`, `role_code`, `description`) VALUES
('系统管理员', 'ROLE_ADMIN', '系统管理员，拥有所有权限'),
('普通用户', 'ROLE_USER', '普通用户，拥有基本操作权限'),
('技术人员', 'ROLE_TECHNICIAN', '技术人员，负责维修保养工作'),
('销售顾问', 'ROLE_SALES', '销售顾问，负责试驾预约等工作');

-- 用户数据
INSERT INTO `user` (`username`, `password`, `real_name`, `phone`, `email`, `gender`, `status`) VALUES
('admin', '$2a$10$1oJD8NXwoMDwHKZZhGm3JuBK.tJuZzS.gMg.YYjQkH7mWTZGqOyUu', '系统管理员', '13800138000', 'admin@example.com', 1, 1),
('user1', '$2a$10$1oJD8NXwoMDwHKZZhGm3JuBK.tJuZzS.gMg.YYjQkH7mWTZGqOyUu', '张三', '13800138001', 'user1@example.com', 1, 1),
('tech1', '$2a$10$1oJD8NXwoMDwHKZZhGm3JuBK.tJuZzS.gMg.YYjQkH7mWTZGqOyUu', '李四', '13800138002', 'tech1@example.com', 1, 1),
('sales1', '$2a$10$1oJD8NXwoMDwHKZZhGm3JuBK.tJuZzS.gMg.YYjQkH7mWTZGqOyUu', '王五', '13800138003', 'sales1@example.com', 1, 1);

-- 用户角色关联数据
INSERT INTO `user_role_rel` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- 车辆类型数据
INSERT INTO `vehicle_type` (`type_name`, `type_code`, `description`) VALUES
('轿车', 'SEDAN', '三厢或两厢轿车'),
('SUV', 'SUV', '运动型多用途车'),
('MPV', 'MPV', '多用途汽车'),
('跑车', 'SPORTS', '高性能跑车');

-- 车辆数据
INSERT INTO `vehicle` (`vehicle_no`, `vin`, `type_id`, `brand`, `model`, `color`, `engine_no`, `purchase_date`, `mileage`, `status`, `owner_id`) VALUES
('京A12345', 'LSVAU033512345678', 1, '大众', '帕萨特', '黑色', 'EA888123456', '2022-01-01', 15000.00, 1, 2),
('京B67890', 'LSVDE217612345678', 2, '丰田', 'RAV4', '白色', '2AR123456', '2022-02-15', 12000.00, 1, NULL),
('京C13579', 'LSVFD892312345678', 3, '本田', '奥德赛', '银色', 'K24W123456', '2022-03-20', 8000.00, 1, NULL),
('京D24680', 'LSVGH456712345678', 4, '保时捷', '911', '红色', 'MA1123456', '2022-04-10', 5000.00, 1, NULL);