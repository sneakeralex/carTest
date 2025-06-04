# Car Service Management System - API Documentation

## Overview
This document provides comprehensive API documentation for the Car Service Management System. The system provides RESTful APIs for managing users, vehicles, bookings, maintenance, and other car service operations.

**Base URL**: `http://localhost:8080/api`
**API Version**: v1
**Authentication**: JWT Bearer Token
**Response Format**: JSON

## Authentication

### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "USER001",
      "username": "user@example.com",
      "name": "张三",
      "role": "CUSTOMER"
    }
  }
}
```

### Register
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "newuser@example.com",
  "password": "password123",
  "name": "李四",
  "phone": "13800138000",
  "email": "newuser@example.com"
}
```

## 1. User Management APIs

### 1.1 Get Current User
```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "userId": "USER001",
    "username": "user@example.com",
    "name": "张三",
    "phone": "13800138000",
    "email": "user@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdTime": "2024-01-01T10:00:00"
  }
}
```

### 1.2 Update User Profile
```http
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "张三丰",
  "phone": "13900139000",
  "email": "zhangsan@example.com"
}
```

### 1.3 Change Password
```http
PUT /api/users/me/password
Authorization: Bearer {token}
Content-Type: application/x-www-form-urlencoded

oldPassword=oldpass123&newPassword=newpass456
```

### 1.4 Get User List (Admin)
```http
GET /api/v1/users?page=0&size=10&keyword=张三
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
        "userId": "USER001",
        "username": "user1@example.com",
        "name": "张三",
        "phone": "13800138000",
        "email": "user1@example.com",
        "role": "CUSTOMER",
        "status": "ACTIVE",
        "createdTime": "2024-01-01T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0
  }
}
```

### 1.5 Create User (Admin)
```http
POST /api/v1/users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "username": "newuser@example.com",
  "password": "password123",
  "name": "王五",
  "phone": "13700137000",
  "email": "newuser@example.com",
  "role": "CUSTOMER"
}
```

### 1.6 Update User (Admin)
```http
PUT /api/v1/users/USER001
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "王五五",
  "phone": "13700137001",
  "email": "wangwu@example.com",
  "status": "ACTIVE"
}
```

### 1.7 Delete User (Admin)
```http
DELETE /api/v1/users/USER001
Authorization: Bearer {admin_token}
```

### 1.8 Get User Statistics (Admin)
```http
GET /api/v1/users/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "totalUsers": 150,
    "activeUsers": 120,
    "inactiveUsers": 30,
    "newUsersThisMonth": 15,
    "customerCount": 100,
    "technicianCount": 20,
    "adminCount": 5
  }
}
```

## 2. Vehicle Management APIs

### 2.1 Get Vehicle List
```http
GET /api/v1/mobile/vehicles?brand=丰田&model=凯美瑞&status=正常&page=0&size=10
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
        "vehicleId": "VEH001",
        "licensePlate": "京A12345",
        "brand": "丰田",
        "model": "凯美瑞",
        "year": "2022",
        "color": "白色",
        "engineNumber": "1234567890",
        "chassisNumber": "ABCD1234567890",
        "status": "正常",
        "description": "车况良好",
        "createdTime": "2024-01-01T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 2.2 Get Vehicle Detail
```http
GET /api/v1/mobile/vehicles/VEH001
Authorization: Bearer {token}
```

### 2.3 Add User Vehicle
```http
POST /api/v1/mobile/vehicles/user/USER001
Authorization: Bearer {token}
Content-Type: application/json

{
  "licensePlate": "京B67890",
  "brand": "本田",
  "model": "雅阁",
  "year": "2023",
  "color": "黑色",
  "engineNumber": "ENG9876543210",
  "chassisNumber": "CHASSIS9876543210",
  "description": "新购车辆"
}
```

### 2.4 Update Vehicle
```http
PUT /api/v1/mobile/vehicles/VEH001
Authorization: Bearer {token}
Content-Type: application/json

{
  "color": "银色",
  "description": "更新车辆颜色"
}
```

### 2.5 Delete Vehicle
```http
DELETE /api/v1/mobile/vehicles/VEH001
Authorization: Bearer {token}
```

### 2.6 Upload Vehicle Images
```http
POST /api/v1/mobile/vehicles/VEH001/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [image1.jpg, image2.jpg]
```

**Response:**
```json
{
  "code": 200,
  "message": "车辆图片上传成功",
  "data": [
    "http://example.com/images/VEH001_1.jpg",
    "http://example.com/images/VEH001_2.jpg"
  ]
}
```

### 2.7 Get Vehicle Images
```http
GET /api/v1/mobile/vehicles/VEH001/images
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "imageId": "IMG001",
      "vehicleId": "VEH001",
      "imageUrl": "http://example.com/images/VEH001_1.jpg",
      "imageType": "外观",
      "description": "车辆外观图片",
      "uploadTime": "2024-01-01T10:00:00"
    }
  ]
}
```

### 2.8 Get Vehicle Brands
```http
GET /api/v1/mobile/vehicles/brands
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "brandId": "BRAND001",
      "brandName": "丰田",
      "logoUrl": "http://example.com/logos/丰田.png"
    },
    {
      "brandId": "BRAND002",
      "brandName": "本田",
      "logoUrl": "http://example.com/logos/本田.png"
    }
  ]
}
```

### 2.9 Get Vehicle Models
```http
GET /api/v1/mobile/vehicles/models?brandId=BRAND001
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "modelId": "MODEL001",
      "brandId": "BRAND001",
      "modelName": "凯美瑞",
      "specifications": "2.0L 自动挡"
    },
    {
      "modelId": "MODEL002",
      "brandId": "BRAND001",
      "modelName": "卡罗拉",
      "specifications": "1.8L 自动挡"
    }
  ]
}
```

## 3. Booking Management APIs

### 3.1 Get Booking List
```http
GET /api/v1/bookings?status=PENDING&page=0&size=10
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
        "bookingId": "BOOK001",
        "bookingNo": "BK20240101001",
        "userId": "USER001",
        "userName": "张三",
        "vehicleId": "VEH001",
        "licensePlate": "京A12345",
        "testSiteId": "SITE001",
        "testSiteName": "北京检测站",
        "bookingDate": "2024-01-15",
        "timeSlot": "09:00-10:00",
        "status": "PENDING",
        "serviceType": "年检",
        "notes": "首次年检",
        "createdTime": "2024-01-01T10:00:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  }
}
```

### 3.2 Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicleId": "VEH001",
  "testSiteId": "SITE001",
  "bookingDate": "2024-01-15",
  "timeSlot": "09:00-10:00",
  "serviceType": "年检",
  "notes": "首次年检"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "预约创建成功",
  "data": {
    "bookingId": "BOOK001",
    "bookingNo": "BK20240101001",
    "status": "PENDING",
    "estimatedDuration": 60,
    "createdTime": "2024-01-01T10:00:00"
  }
}
```

### 3.3 Update Booking
```http
PUT /api/v1/bookings/BOOK001
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingDate": "2024-01-16",
  "timeSlot": "10:00-11:00",
  "notes": "更改预约时间"
}
```

### 3.4 Cancel Booking
```http
PUT /api/v1/bookings/BOOK001/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "临时有事，无法按时到达"
}
```

### 3.5 Get Test Sites
```http
GET /api/v1/bookings/test-sites?city=北京
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "testSiteId": "SITE001",
      "name": "北京检测站",
      "address": "北京市朝阳区xxx路123号",
      "phone": "010-12345678",
      "city": "北京",
      "district": "朝阳区",
      "operatingHours": "08:00-18:00",
      "services": ["年检", "环保检测", "安全检测"],
      "rating": 4.5,
      "latitude": 39.9042,
      "longitude": 116.4074
    }
  ]
}
```

### 3.6 Get Available Time Slots
```http
GET /api/v1/bookings/time-slots?testSiteId=SITE001&date=2024-01-15
Authorization: Bearer {token}
```

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "timeSlot": "09:00-10:00",
      "available": true,
      "remainingSlots": 3
    },
    {
      "timeSlot": "10:00-11:00",
      "available": false,
      "remainingSlots": 0
    }
  ]
}
```
