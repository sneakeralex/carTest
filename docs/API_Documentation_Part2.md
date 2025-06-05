# Car Test Site Booking Management System - API Documentation (Part 2)

## 4. Test Task Management APIs

### 4.1 Get Test Task List
```http
GET /api/v1/test-registration/tasks?page=0&size=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "taskId": "TASK001",
        "taskName": "车辆性能测试",
        "taskCode": "PERF_TEST_001",
        "taskType": "性能测试",
        "description": "车辆加速、制动、操控性能综合测试",
        "difficulty": "MEDIUM",
        "duration": 120,
        "maxScore": 100.00,
        "passScore": 70.00,
        "status": "ACTIVE",
        "createdTime": "2024-01-01T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 4.2 Create Test Task
```http
POST /api/v1/test-registration/tasks
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "taskName": "车辆安全测试",
  "taskCode": "SAFETY_TEST_001",
  "taskType": "安全测试",
  "description": "车辆制动系统、安全气囊、碰撞安全测试",
  "difficulty": "HARD",
  "duration": 180,
  "maxScore": 100.00,
  "passScore": 80.00,
  "requirements": "车辆必须通过基础检查",
  "instructions": "按照安全测试标准流程执行"
}
```

### 4.3 Update Test Task
```http
PUT /api/v1/test-registration/tasks/TASK001
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "description": "车辆加速、制动、操控性能综合测试（更新版）",
  "duration": 150,
  "passScore": 75.00
}
```

### 4.4 Complete Test Task
```http
PUT /api/v1/test-registration/registrations/REG001/complete
Authorization: Bearer {admin_token}
```

### 4.5 Cancel Test Registration
```http
DELETE /api/v1/test-registration/registrations/REG001
Authorization: Bearer {token}
```

### 4.6 Get User Test Registrations
```http
GET /api/v1/test-registration/user/USER001/registrations
Authorization: Bearer {token}
```

### 4.7 Get Task Registrations
```http
GET /api/v1/test-registration/task/TASK001/registrations
Authorization: Bearer {admin_token}
```

## 5. Test Consultation Appointment APIs

### 5.1 Get Appointment List
```http
GET /api/appointments?page=0&size=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "appointmentNo": "APT20240101001",
        "userId": "USER001",
        "userName": "张三",
        "phone": "13800138000",
        "serviceType": "测试咨询",
        "appointmentDate": "2024-01-15T14:00:00",
        "status": "PENDING",
        "description": "车辆性能测试项目咨询",
        "createdTime": "2024-01-01T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 5.2 Create Appointment
```http
POST /api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceType": "测试咨询",
  "appointmentDate": "2024-01-15T14:00:00",
  "description": "车辆安全测试项目咨询",
  "phone": "13800138000"
}
```

### 5.3 Update Appointment
```http
PUT /api/appointments/APT20240101001
Authorization: Bearer {token}
Content-Type: application/json

{
  "appointmentDate": "2024-01-16T14:00:00",
  "description": "车辆异响问题咨询（更新时间）"
}
```

### 5.4 Approve Appointment
```http
PUT /api/appointments/APT20240101001/approve
Authorization: Bearer {admin_token}
```

### 5.5 Complete Appointment
```http
PUT /api/appointments/APT20240101001/complete
Authorization: Bearer {admin_token}
```

### 5.6 Cancel Appointment
```http
PUT /api/appointments/APT20240101001/cancel
Authorization: Bearer {token}
```

### 5.7 Get User Appointments
```http
GET /api/appointments/user/USER001
Authorization: Bearer {token}
```

## 6. Equipment Management APIs

### 6.1 Get Equipment List
```http
GET /api/v1/equipment?status=AVAILABLE&page=0&size=10
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "equipmentId": "EQP001",
        "name": "车辆性能测试仪",
        "category": "测试设备",
        "model": "PT-3000",
        "manufacturer": "博世",
        "status": "AVAILABLE",
        "location": "测试场A区",
        "purchaseDate": "2023-01-01",
        "warrantyExpiry": "2025-01-01",
        "lastMaintenanceDate": "2024-01-01",
        "nextMaintenanceDate": "2024-04-01"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 6.2 Create Equipment Request
```http
POST /api/v1/equipment/requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "equipmentId": "EQP001",
  "requestType": "BORROW",
  "startDate": "2024-01-15T09:00:00",
  "endDate": "2024-01-15T17:00:00",
  "purpose": "车辆性能测试",
  "notes": "需要进行车辆加速和制动性能测试"
}
```

### 6.3 Approve Equipment Request
```http
PUT /api/v1/equipment/requests/REQ001/approve
Authorization: Bearer {admin_token}
```

### 6.4 Return Equipment
```http
PUT /api/v1/equipment/requests/REQ001/return
Authorization: Bearer {token}
Content-Type: application/json

{
  "condition": "GOOD",
  "notes": "设备状态良好，无损坏"
}
```

### 6.5 Get Equipment Categories
```http
GET /api/v1/equipment/categories
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "categoryId": "CAT001",
      "name": "性能测试设备",
      "description": "用于车辆性能测试的专业设备",
      "equipmentCount": 15
    },
    {
      "categoryId": "CAT002",
      "name": "安全测试设备",
      "description": "车辆安全测试使用的专业设备",
      "equipmentCount": 25
    }
  ]
}
```

### 6.6 Schedule Equipment Maintenance
```http
POST /api/v1/equipment/EQP001/maintenance
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "maintenanceType": "定期校准",
  "scheduledDate": "2024-01-20T09:00:00",
  "description": "测试设备精度校准和功能检查",
  "technicianId": "TECH001"
}
```

### 6.7 Get Equipment Usage History
```http
GET /api/v1/equipment/EQP001/usage-history?page=0&size=10
Authorization: Bearer {admin_token}
```

### 6.8 Get Equipment Statistics
```http
GET /api/v1/equipment/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "totalEquipment": 50,
    "availableEquipment": 35,
    "inUseEquipment": 10,
    "maintenanceEquipment": 3,
    "outOfServiceEquipment": 2,
    "utilizationRate": 70.0,
    "maintenanceDueCount": 5
  }
}
```
