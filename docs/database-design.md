# 汽车测试场预约管理系统数据库设计

## 数据库概述

本文档详细描述了汽车测试场预约管理系统的数据库设计，包括表结构、字段说明、关系模型等。系统采用MySQL数据库，设计遵循第三范式规范。

## 业务背景

汽车测试场预约管理系统主要用于管理汽车测试场地的预约和测试业务流程，包括：
- 用户管理：注册用户、管理员、测试人员等
- 车辆管理：用户车辆信息登记和管理
- 测试场管理：测试场地信息、设施、安全要求等
- 预约管理：测试场地时间段预约、预约状态跟踪
- 测试任务管理：各种测试项目的定义和管理
- 测试报名：用户报名参加各种测试任务

## ER图

```
+---------------+       +---------------+       +---------------+
|    用户表      |       |    车辆表      |       |   测试场表     |
|   (user)      |       |  (vehicle)    |       |  (test_site)  |
+---------------+       +---------------+       +---------------+
        |                      |                       |
        |                      |                       |
        v                      v                       v
+---------------+       +---------------+       +---------------+
|    角色表      |       |   车辆类型表   |       |   时间段表     |
|    (role)     |       | (vehicle_type)|       |  (time_slot)  |
+---------------+       +---------------+       +---------------+
        |                      |                       |
        |                      |                       |
        v                      v                       v
+---------------+       +---------------+       +---------------+
|  用户角色关联表 |       |   预约测试表   |       |   测试任务表   |
|(user_role_rel)|       |   (booking)   |       |  (test_task)  |
+---------------+       +---------------+       +---------------+
                                |
                                |
                                v
                        +---------------+
                        |   测试报名表   |
                        |(test_registration)|
                        +---------------+
```

## 表结构设计

### 1. 用户表 (user)

存储系统用户信息，包括管理员、普通用户等。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 用户ID |
| username | varchar | 50 | 否 | 否 | 无 | 用户名 |
| password | varchar | 100 | 否 | 否 | 无 | 密码（加密存储） |
| real_name | varchar | 50 | 是 | 否 | 无 | 真实姓名 |
| phone | varchar | 20 | 是 | 否 | 无 | 手机号 |
| email | varchar | 100 | 是 | 否 | 无 | 邮箱 |
| avatar | varchar | 255 | 是 | 否 | 无 | 头像URL |
| gender | tinyint | 1 | 是 | 否 | 0 | 性别：0未知，1男，2女 |
| status | tinyint | 1 | 否 | 否 | 1 | 状态：0禁用，1启用 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| last_login_time | datetime | - | 是 | 否 | 无 | 最后登录时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 2. 角色表 (role)

存储系统角色信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 角色ID |
| role_name | varchar | 50 | 否 | 否 | 无 | 角色名称 |
| role_code | varchar | 50 | 否 | 否 | 无 | 角色编码 |
| description | varchar | 255 | 是 | 否 | 无 | 角色描述 |
| status | tinyint | 1 | 否 | 否 | 1 | 状态：0禁用，1启用 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 3. 用户角色关联表 (user_role_rel)

存储用户与角色的多对多关系。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 关联ID |
| user_id | bigint | 20 | 否 | 否 | 无 | 用户ID |
| role_id | bigint | 20 | 否 | 否 | 无 | 角色ID |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |

### 4. 车辆表 (vehicle)

存储车辆基本信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 车辆ID |
| vehicle_no | varchar | 50 | 否 | 否 | 无 | 车牌号 |
| vin | varchar | 50 | 否 | 否 | 无 | 车架号 |
| type_id | bigint | 20 | 否 | 否 | 无 | 车辆类型ID |
| brand | varchar | 50 | 否 | 否 | 无 | 品牌 |
| model | varchar | 50 | 否 | 否 | 无 | 型号 |
| color | varchar | 20 | 是 | 否 | 无 | 颜色 |
| engine_no | varchar | 50 | 是 | 否 | 无 | 发动机号 |
| purchase_date | date | - | 是 | 否 | 无 | 购买日期 |
| mileage | decimal | (10,2) | 是 | 否 | 0 | 行驶里程(km) |
| status | tinyint | 1 | 否 | 否 | 1 | 状态：0停用，1正常，2维修中，3报废 |
| owner_id | bigint | 20 | 是 | 否 | 无 | 车主ID（关联用户表） |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 5. 车辆类型表 (vehicle_type)

存储车辆类型信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 类型ID |
| type_name | varchar | 50 | 否 | 否 | 无 | 类型名称 |
| type_code | varchar | 50 | 否 | 否 | 无 | 类型编码 |
| description | varchar | 255 | 是 | 否 | 无 | 类型描述 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 6. 测试场表 (test_site)

存储汽车测试场地信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 测试场ID |
| site_name | varchar | 100 | 否 | 否 | 无 | 测试场名称 |
| site_code | varchar | 50 | 否 | 否 | 无 | 测试场编码 |
| address | varchar | 255 | 否 | 否 | 无 | 测试场地址 |
| city | varchar | 50 | 否 | 否 | 无 | 所在城市 |
| district | varchar | 50 | 是 | 否 | 无 | 所在区域 |
| latitude | decimal | (10,8) | 是 | 否 | 无 | 纬度 |
| longitude | decimal | (11,8) | 是 | 否 | 无 | 经度 |
| contact_phone | varchar | 20 | 是 | 否 | 无 | 联系电话 |
| operating_hours | varchar | 100 | 是 | 否 | 无 | 营业时间 |
| test_types | varchar | 255 | 是 | 否 | 无 | 支持的测试类型 |
| facilities | text | - | 是 | 否 | 无 | 设施描述 |
| safety_requirements | text | - | 是 | 否 | 无 | 安全要求 |
| rating | decimal | (3,2) | 是 | 否 | 0 | 评分(0-5) |
| status | tinyint | 1 | 否 | 否 | 1 | 状态：0停用，1正常 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 7. 时间段表 (time_slot)

存储测试场可预约的时间段。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 时间段ID |
| site_id | bigint | 20 | 否 | 否 | 无 | 测试场ID |
| date | date | - | 否 | 否 | 无 | 日期 |
| start_time | time | - | 否 | 否 | 无 | 开始时间 |
| end_time | time | - | 否 | 否 | 无 | 结束时间 |
| total_slots | int | 11 | 否 | 否 | 10 | 总槽位数 |
| available_slots | int | 11 | 否 | 否 | 10 | 可用槽位数 |
| status | tinyint | 1 | 否 | 否 | 1 | 状态：0不可用，1可用 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |

### 8. 预约测试表 (booking)

存储汽车测试预约信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 预约ID |
| booking_no | varchar | 50 | 否 | 否 | 无 | 预约编号 |
| user_id | bigint | 20 | 否 | 否 | 无 | 用户ID |
| vehicle_id | bigint | 20 | 否 | 否 | 无 | 车辆ID |
| site_id | bigint | 20 | 否 | 否 | 无 | 测试场ID |
| time_slot_id | bigint | 20 | 否 | 否 | 无 | 时间段ID |
| booking_date | date | - | 否 | 否 | 无 | 预约日期 |
| time_slot | varchar | 20 | 否 | 否 | 无 | 时间段 |
| test_type | varchar | 50 | 否 | 否 | 无 | 测试类型 |
| status | tinyint | 1 | 否 | 否 | 0 | 状态：0待确认，1已确认，2已完成，3已取消 |
| estimated_duration | int | 11 | 是 | 否 | 60 | 预计时长(分钟) |
| actual_start_time | datetime | - | 是 | 否 | 无 | 实际开始时间 |
| actual_end_time | datetime | - | 是 | 否 | 无 | 实际结束时间 |
| test_result | varchar | 20 | 是 | 否 | 无 | 测试结果：PASS通过，FAIL未通过 |
| notes | varchar | 500 | 是 | 否 | 无 | 备注 |
| cancellation_reason | varchar | 255 | 是 | 否 | 无 | 取消原因 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 9. 测试任务表 (test_task)

存储测试任务信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 任务ID |
| task_name | varchar | 100 | 否 | 否 | 无 | 任务名称 |
| task_code | varchar | 50 | 否 | 否 | 无 | 任务编码 |
| task_type | varchar | 50 | 否 | 否 | 无 | 任务类型 |
| description | text | - | 是 | 否 | 无 | 任务描述 |
| difficulty | varchar | 20 | 是 | 否 | MEDIUM | 难度：EASY简单，MEDIUM中等，HARD困难 |
| duration | int | 11 | 是 | 否 | 60 | 预计时长(分钟) |
| max_score | decimal | (5,2) | 是 | 否 | 100 | 满分 |
| pass_score | decimal | (5,2) | 是 | 否 | 60 | 及格分 |
| requirements | text | - | 是 | 否 | 无 | 测试要求 |
| instructions | text | - | 是 | 否 | 无 | 操作说明 |
| status | tinyint | 1 | 否 | 否 | 1 | 状态：0停用，1启用 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 10. 测试报名表 (test_registration)

存储用户测试报名信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 报名ID |
| registration_no | varchar | 50 | 否 | 否 | 无 | 报名编号 |
| user_id | bigint | 20 | 否 | 否 | 无 | 用户ID |
| task_id | bigint | 20 | 否 | 否 | 无 | 任务ID |
| registration_date | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 报名时间 |
| scheduled_date | datetime | - | 是 | 否 | 无 | 预约考试时间 |
| status | tinyint | 1 | 否 | 否 | 0 | 状态：0已报名，1已预约，2已完成，3已取消 |
| score | decimal | (5,2) | 是 | 否 | 无 | 得分 |
| result | varchar | 20 | 是 | 否 | 无 | 结果：PASS通过，FAIL未通过 |
| attempt_count | int | 11 | 否 | 否 | 0 | 尝试次数 |
| notes | varchar | 500 | 是 | 否 | 无 | 备注 |
| completed_time | datetime | - | 是 | 否 | 无 | 完成时间 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

## 索引设计

### 1. 用户表 (user)
- 主键索引：id
- 唯一索引：username
- 普通索引：phone, email

### 2. 角色表 (role)
- 主键索引：id
- 唯一索引：role_code

### 3. 用户角色关联表 (user_role_rel)
- 主键索引：id
- 普通索引：user_id, role_id

### 4. 车辆表 (vehicle)
- 主键索引：id
- 唯一索引：vehicle_no, vin
- 普通索引：type_id, owner_id, status

### 5. 车辆类型表 (vehicle_type)
- 主键索引：id
- 唯一索引：type_code

### 6. 测试场表 (test_site)
- 主键索引：id
- 唯一索引：site_code
- 普通索引：city, district, status

### 7. 时间段表 (time_slot)
- 主键索引：id
- 普通索引：site_id, date, status

### 8. 预约测试表 (booking)
- 主键索引：id
- 唯一索引：booking_no
- 普通索引：user_id, vehicle_id, site_id, time_slot_id, status, booking_date

### 9. 测试任务表 (test_task)
- 主键索引：id
- 唯一索引：task_code
- 普通索引：task_type, difficulty, status

### 10. 测试报名表 (test_registration)
- 主键索引：id
- 唯一索引：registration_no
- 普通索引：user_id, task_id, status, scheduled_date

## 表关系说明

1. 用户表(user) 与 角色表(role) 是多对多关系，通过用户角色关联表(user_role_rel)建立关联
2. 用户表(user) 与 车辆表(vehicle) 是一对多关系，一个用户可以拥有多辆车辆
3. 车辆表(vehicle) 与 车辆类型表(vehicle_type) 是多对一关系，多辆车辆可以属于同一类型
4. 测试场表(test_site) 与 时间段表(time_slot) 是一对多关系，一个测试场可以有多个时间段
5. 用户表(user) 与 预约测试表(booking) 是一对多关系，一个用户可以有多次预约测试记录
6. 车辆表(vehicle) 与 预约测试表(booking) 是一对多关系，一辆车可以被多次预约测试
7. 测试场表(test_site) 与 预约测试表(booking) 是一对多关系，一个测试场可以被多次预约
8. 时间段表(time_slot) 与 预约测试表(booking) 是一对多关系，一个时间段可以有多个预约
9. 用户表(user) 与 测试报名表(test_registration) 是一对多关系，一个用户可以报名多个测试任务
10. 测试任务表(test_task) 与 测试报名表(test_registration) 是一对多关系，一个测试任务可以有多个报名记录

## 数据库初始化脚本

详见 `sql/init.sql` 文件。