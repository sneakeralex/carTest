# API 接口列表

本文档汇总了项目中使用的所有 API 接口路径，按照模块进行分类。

## 车辆相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/vehicles` | GET | 获取车辆列表 |
| `/vehicles/{id}` | GET | 获取车辆详情 |
| `/vehicles` | POST | 创建车辆 |
| `/vehicles/{id}` | PUT | 更新车辆 |
| `/vehicles/{id}` | DELETE | 删除车辆 |
| `/artemis/api/resource/v1/vehicle/vehicleList` | POST | 获取车辆列表（真实 API） |

## 预约相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/appointments` | GET | 获取预约列表 |
| `/appointments/{id}` | GET | 获取预约详情 |
| `/appointments` | POST | 创建预约 |
| `/appointments/{id}` | PUT | 更新预约 |
| `/appointments/{id}/cancel` | PUT | 取消预约 |
| `/appointments/{id}/feedback` | PUT | 提交反馈 |
| `/artemis/api/v1/booking/list` | GET | 获取预约列表（真实 API） |
| `/artemis/api/v1/booking/add` | POST | 创建预约（真实 API） |
| `/artemis/api/v1/booking/detail/{id}` | GET | 获取预约详情（真实 API） |
| `/artemis/api/v1/booking/update` | POST | 更新预约（真实 API） |
| `/artemis/api/v1/booking/cancel/{id}` | PUT | 取消预约（真实 API） |
| `/artemis/api/v1/booking/driverList` | POST | 获取驾驶员列表（真实 API） |
| `/artemis/api/v1/booking/getTestType/{projectNo}/{vin}` | GET | 获取试验类型（真实 API） |
| `/artemis/api/v1/booking/getTestContent` | POST | 获取试验内容（真实 API） |
| `/artemis/api/v1/booking/groundList` | GET | 获取场地列表（真实 API） |

## 维修保养相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/maintenances` | GET | 获取维修保养列表 |
| `/maintenances/{id}` | GET | 获取维修保养详情 |
| `/maintenances` | POST | 创建维修保养 |
| `/maintenances/{id}` | PUT | 更新维修保养 |
| `/maintenances/{id}/cancel` | PUT | 取消维修保养 |

## 设备相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/iotrm/v1/device/page` | POST | 获取设备列表（真实 API） |
| `/artemis/api/iotrm/v1/device` | POST | 创建设备（真实 API） |
| `/artemis/api/iotrm/v1/device` | PUT | 更新设备（真实 API） |
| `/artemis/api/iotrm/v1/device/{id}` | DELETE | 删除设备（真实 API） |
| `/artemis/api/iotrm/v1/device/application/page` | POST | 获取设备申请列表（真实 API） |
| `/artemis/api/iotrm/v1/device/application/{id}` | GET | 获取设备申请详情（真实 API） |
| `/artemis/api/iotrm/v1/device/application` | POST | 提交设备申请（真实 API） |
| `/artemis/api/iotrm/v1/device/application/{id}` | PUT | 更新设备申请状态（真实 API） |
| `/artemis/api/iotrm/v1/device/application/{id}/approve` | PUT | 审批设备申请（真实 API） |
| `/artemis/api/iotrm/v1/device/application/{id}/cancel` | PUT | 取消设备申请（真实 API） |

## 测试场地相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/v1/test-site/{siteId}` | GET | 获取测试场地详情（真实 API） |
| `/artemis/api/v1/test-site/available-slots` | GET | 获取测试场地可用时间段（真实 API） |
| `/artemis/api/v1/test-site/booking` | POST | 创建测试场地预约（真实 API） |
| `/artemis/api/v1/test-site/bookings` | GET | 获取测试场地预约列表（真实 API） |
| `/artemis/api/v1/test-site/booking/{bookingId}` | GET | 获取测试场地预约详情（真实 API） |
| `/artemis/api/v1/test-site/booking/{bookingId}` | PUT | 更新测试场地预约（真实 API） |
| `/artemis/api/v1/test-site/booking/{bookingId}/cancel` | PUT | 取消测试场地预约（真实 API） |
| `/artemis/api/v1/test-site/user/{userId}/bookings` | GET | 获取用户测试场地预约列表（真实 API） |
| `/artemis/api/v1/test-site/booking/stats` | GET | 获取测试场地预约统计（真实 API） |

## 测试任务相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/v1/test-task/list` | GET | 获取测试任务列表（真实 API） |
| `/artemis/api/v1/test-task/{taskId}` | GET | 获取测试任务详情（真实 API） |
| `/artemis/api/v1/test-task` | POST | 创建测试任务（真实 API） |
| `/artemis/api/v1/test-registration/list` | GET | 获取测试报名列表（真实 API） |
| `/artemis/api/v1/test-registration/{registrationId}` | GET | 获取测试报名详情（真实 API） |
| `/artemis/api/v1/test-registration` | POST | 创建测试报名（真实 API） |
| `/artemis/api/v1/test-registration/{registrationId}` | PUT | 更新测试报名（真实 API） |
| `/artemis/api/v1/test-registration/{registrationId}/cancel` | PUT | 取消测试报名（真实 API） |
| `/artemis/api/v1/test-registration/{registrationId}/schedule` | PUT | 安排测试（真实 API） |
| `/artemis/api/v1/test-registration/{registrationId}/complete` | PUT | 完成测试（真实 API） |
| `/artemis/api/v1/test-registration/user/{userId}` | GET | 获取用户测试报名列表（真实 API） |
| `/artemis/api/v1/test-registration/task/{taskId}` | GET | 获取任务报名列表（真实 API） |
| `/artemis/api/v1/test/stats` | GET | 获取测试统计（真实 API） |
| `/artemis/api/v1/test-registration/stats/{userId}` | GET | 获取测试报名统计（真实 API） |

## 仪表板相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/dashboard/v1/mobile/stats` | GET | 获取仪表板统计信息（真实 API） |
| `/artemis/api/notification/v1/list` | GET | 获取通知列表（真实 API） |
| `/artemis/api/dashboard/v1/quick-actions` | GET | 获取快捷操作（真实 API） |
| `/artemis/api/weather/v1/current` | GET | 获取天气信息（真实 API） |

## 天气相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/v1/oeeooo7` | GET | 获取天气信息（真实 API） |

## 场地排期相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/v1/ground/scheduling` | GET | 获取场地排期（真实 API） |

## 日程相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/schedule/daily` | GET | 获取每日日程（真实 API） |
| `/artemis/api/schedule/site` | GET | 获取场地排期（真实 API） |
| `/artemis/api/schedule/weather` | GET | 获取天气信息（真实 API） |
| `/artemis/api/schedule/booking` | POST | 创建预约（真实 API） |

## 合同相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/v1/contact/queryContract` | POST | 获取合同列表（真实 API） |
| `/artemis/api/v1/contact/queryContractDetail` | POST | 获取合同详情（真实 API） |

## 员工相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/manage/auth/v2/manage/userService/list` | GET | 获取员工列表（真实 API） |
| `/artemis/api/manage/auth/v2/manage/userService/{id}` | GET | 获取员工详情（真实 API） |
| `/artemis/api/manage/auth/v2/manage/userService` | POST | 创建员工（真实 API） |
| `/artemis/api/manage/auth/v2/manage/userService/{id}` | PUT | 更新员工（真实 API） |
| `/artemis/api/manage/auth/v2/manage/userService/{id}/document` | POST | 上传员工文档（真实 API） |
| `/artemis/api/manage/auth/v2/manage/userService/{id}/document/{docId}` | DELETE | 删除员工文档（真实 API） |
| `/artemis/api/v1/staff` | GET | 获取员工列表 |
| `/artemis/api/v1/saveStaff` | POST | 保存员工 |

## 测试咨询相关

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/appointment/v1/list` | GET | 获取测试咨询列表（真实 API） |
| `/artemis/api/appointment/v1/{id}` | GET | 获取测试咨询详情（真实 API） |
| `/artemis/api/appointment/v1` | POST | 创建测试咨询（真实 API） |
| `/artemis/api/appointment/v1/{id}` | PUT | 更新测试咨询（真实 API） |
| `/artemis/api/appointment/v1/{id}/cancel` | PUT | 取消测试咨询（真实 API） |
| `/artemis/api/appointment/v1/user` | GET | 获取用户测试咨询（真实 API） |
| `/artemis/api/appointment/v1/{id}/approve` | PUT | 审批测试咨询（真实 API） |
| `/artemis/api/appointment/v1/{id}/reschedule` | PUT | 改期测试咨询（真实 API） |

## 其他

| 接口路径 | 方法 | 描述 |
|---------|------|------|
| `/artemis/api/v1/booking/getVinList` | POST | 获取 VIN 列表（真实 API） |
| `/artemis/api/v1/booking/getBookingNo` | POST | 获取预约编号（真实 API） |
