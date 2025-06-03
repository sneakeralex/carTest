# 车辆管理系统数据库设计

## 数据库概述

本文档详细描述了车辆管理系统的数据库设计，包括表结构、字段说明、关系模型等。系统采用MySQL数据库，设计遵循第三范式规范。

## ER图

```
+---------------+       +---------------+       +---------------+
|    用户表      |       |    车辆表      |       |   维修保养表   |
|   (user)      |       |  (vehicle)    |       | (maintenance) |
+---------------+       +---------------+       +---------------+
        |                      |                       |
        |                      |                       |
        v                      v                       v
+---------------+       +---------------+       +---------------+
|    角色表      |       |   车辆类型表   |       |   维修项目表   |
|    (role)     |       | (vehicle_type)|       |(maintenance_item)|
+---------------+       +---------------+       +---------------+
        |                      |                       |
        |                      |                       |
        v                      v                       v
+---------------+       +---------------+       +---------------+
|  用户角色关联表 |       |   预约试驾表   |       |   维修工单表   |
|(user_role_rel)|       | (appointment) |       |  (work_order) |
+---------------+       +---------------+       +---------------+
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

### 6. 维修保养表 (maintenance)

存储车辆维修保养记录。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 维修保养ID |
| vehicle_id | bigint | 20 | 否 | 否 | 无 | 车辆ID |
| maintenance_type | tinyint | 1 | 否 | 否 | 1 | 类型：1保养，2维修 |
| start_time | datetime | - | 否 | 否 | 无 | 开始时间 |
| end_time | datetime | - | 是 | 否 | 无 | 结束时间 |
| mileage | decimal | (10,2) | 是 | 否 | 0 | 当前里程(km) |
| description | varchar | 500 | 是 | 否 | 无 | 维修保养描述 |
| cost | decimal | (10,2) | 是 | 否 | 0 | 费用 |
| status | tinyint | 1 | 否 | 否 | 0 | 状态：0待处理，1处理中，2已完成，3已取消 |
| operator_id | bigint | 20 | 是 | 否 | 无 | 操作人ID |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 7. 维修项目表 (maintenance_item)

存储维修保养项目明细。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 项目ID |
| maintenance_id | bigint | 20 | 否 | 否 | 无 | 维修保养ID |
| item_name | varchar | 100 | 否 | 否 | 无 | 项目名称 |
| item_code | varchar | 50 | 是 | 否 | 无 | 项目编码 |
| quantity | int | 11 | 否 | 否 | 1 | 数量 |
| unit_price | decimal | (10,2) | 是 | 否 | 0 | 单价 |
| total_price | decimal | (10,2) | 是 | 否 | 0 | 总价 |
| remark | varchar | 255 | 是 | 否 | 无 | 备注 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |

### 8. 维修工单表 (work_order)

存储维修工单信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 工单ID |
| order_no | varchar | 50 | 否 | 否 | 无 | 工单编号 |
| maintenance_id | bigint | 20 | 否 | 否 | 无 | 维修保养ID |
| vehicle_id | bigint | 20 | 否 | 否 | 无 | 车辆ID |
| technician_id | bigint | 20 | 是 | 否 | 无 | 技术人员ID |
| status | tinyint | 1 | 否 | 否 | 0 | 状态：0待分配，1处理中，2已完成，3已取消 |
| start_time | datetime | - | 是 | 否 | 无 | 开始时间 |
| end_time | datetime | - | 是 | 否 | 无 | 结束时间 |
| remark | varchar | 500 | 是 | 否 | 无 | 备注 |
| create_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | datetime | - | 否 | 否 | CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint | 1 | 否 | 否 | 0 | 是否删除：0否，1是 |

### 9. 预约试驾表 (appointment)

存储预约试驾信息。

| 字段名 | 数据类型 | 长度 | 允许空 | 主键 | 默认值 | 说明 |
| ------ | ------- | ---- | ------ | ---- | ------ | ---- |
| id | bigint | 20 | 否 | 是 | 自增 | 预约ID |
| appointment_no | varchar | 50 | 否 | 否 | 无 | 预约编号 |
| user_id | bigint | 20 | 否 | 否 | 无 | 用户ID |
| vehicle_id | bigint | 20 | 否 | 否 | 无 | 车辆ID |
| appointment_time | datetime | - | 否 | 否 | 无 | 预约时间 |
| duration | int | 11 | 是 | 否 | 60 | 预计时长(分钟) |
| status | tinyint | 1 | 否 | 否 | 0 | 状态：0待审核，1已审核，2已完成，3已取消 |
| contact_name | varchar | 50 | 否 | 否 | 无 | 联系人姓名 |
| contact_phone | varchar | 20 | 否 | 否 | 无 | 联系人电话 |
| remark | varchar | 500 | 是 | 否 | 无 | 备注 |
| feedback | varchar | 500 | 是 | 否 | 无 | 试驾反馈 |
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

### 6. 维修保养表 (maintenance)
- 主键索引：id
- 普通索引：vehicle_id, status, maintenance_type

### 7. 维修项目表 (maintenance_item)
- 主键索引：id
- 普通索引：maintenance_id

### 8. 维修工单表 (work_order)
- 主键索引：id
- 唯一索引：order_no
- 普通索引：maintenance_id, vehicle_id, technician_id, status

### 9. 预约试驾表 (appointment)
- 主键索引：id
- 唯一索引：appointment_no
- 普通索引：user_id, vehicle_id, status, appointment_time

## 表关系说明

1. 用户表(user) 与 角色表(role) 是多对多关系，通过用户角色关联表(user_role_rel)建立关联
2. 用户表(user) 与 车辆表(vehicle) 是一对多关系，一个用户可以拥有多辆车辆
3. 车辆表(vehicle) 与 车辆类型表(vehicle_type) 是多对一关系，多辆车辆可以属于同一类型
4. 车辆表(vehicle) 与 维修保养表(maintenance) 是一对多关系，一辆车可以有多条维修保养记录
5. 维修保养表(maintenance) 与 维修项目表(maintenance_item) 是一对多关系，一次维修保养可以包含多个项目
6. 维修保养表(maintenance) 与 维修工单表(work_order) 是一对一关系，一次维修保养对应一个工单
7. 用户表(user) 与 预约试驾表(appointment) 是一对多关系，一个用户可以有多次预约试驾记录
8. 车辆表(vehicle) 与 预约试驾表(appointment) 是一对多关系，一辆车可以被多次预约试驾

## 数据库初始化脚本

详见 `sql/init.sql` 文件。