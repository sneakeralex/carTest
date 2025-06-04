# Car Test Site Booking Management System - API Documentation (Part 2)

## 4. Maintenance Management APIs

### 4.1 Get Maintenance List
```http
GET /api/maintenances?page=0&size=10
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
        "maintenanceNo": "MT20240101001",
        "vehicleId": "VEH001",
        "licensePlate": "京A12345",
        "userId": "USER001",
        "userName": "张三",
        "type": "保养",
        "description": "定期保养",
        "status": "PENDING",
        "scheduledDate": "2024-01-15T09:00:00",
        "estimatedCost": 500.00,
        "createdTime": "2024-01-01T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 4.2 Create Maintenance
```http
POST /api/maintenances
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicleId": "VEH001",
  "type": "维修",
  "description": "发动机异响检修",
  "scheduledDate": "2024-01-15T09:00:00",
  "priority": "HIGH",
  "notes": "客户反映发动机有异响"
}
```

### 4.3 Update Maintenance
```http
PUT /api/maintenances/MT20240101001
Authorization: Bearer {token}
Content-Type: application/json

{
  "scheduledDate": "2024-01-16T09:00:00",
  "description": "发动机异响检修（更新时间）",
  "notes": "客户要求延期"
}
```

### 4.4 Complete Maintenance
```http
PUT /api/maintenances/MT20240101001/complete
Authorization: Bearer {admin_token}
```

### 4.5 Cancel Maintenance
```http
PUT /api/maintenances/MT20240101001/cancel
Authorization: Bearer {token}
```

### 4.6 Get User Maintenances
```http
GET /api/maintenances/my-maintenances
Authorization: Bearer {token}
```

### 4.7 Get Vehicle Maintenances
```http
GET /api/maintenances/vehicle/VEH001
Authorization: Bearer {token}
```

## 5. Appointment Management APIs

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
        "serviceType": "维修咨询",
        "appointmentDate": "2024-01-15T14:00:00",
        "status": "PENDING",
        "description": "车辆异响问题咨询",
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
  "serviceType": "维修咨询",
  "appointmentDate": "2024-01-15T14:00:00",
  "description": "车辆异响问题咨询",
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
        "name": "发动机检测仪",
        "category": "检测设备",
        "model": "ED-2000",
        "manufacturer": "博世",
        "status": "AVAILABLE",
        "location": "检测车间A",
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
  "purpose": "车辆检测",
  "notes": "需要进行发动机检测"
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
      "name": "检测设备",
      "description": "用于车辆检测的设备",
      "equipmentCount": 15
    },
    {
      "categoryId": "CAT002",
      "name": "维修工具",
      "description": "车辆维修使用的工具",
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
  "maintenanceType": "定期保养",
  "scheduledDate": "2024-01-20T09:00:00",
  "description": "设备定期保养检查",
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
