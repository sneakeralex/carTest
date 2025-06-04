# Car Service Management System - API Summary

## Overview
Complete API endpoint summary for the Car Service Management System with 139 endpoints across 17 controllers.

## API Endpoints Summary

### 1. User Management (UserManagementController) - 13 endpoints
- `GET /api/v1/users` - Get user list with pagination and search
- `GET /api/v1/users/{userId}` - Get user details
- `POST /api/v1/users` - Create new user (Admin)
- `PUT /api/v1/users/{userId}` - Update user (Admin)
- `DELETE /api/v1/users/{userId}` - Delete user (Admin)
- `PUT /api/v1/users/{userId}/status` - Update user status (Admin)
- `GET /api/v1/users/{userId}/profile` - Get user profile
- `PUT /api/v1/users/{userId}/profile` - Update user profile
- `POST /api/v1/users/{userId}/avatar` - Upload user avatar
- `GET /api/v1/users/search` - Search users
- `GET /api/v1/users/stats` - Get user statistics (Admin)
- `POST /api/v1/users/batch` - Batch create users (Admin)
- `PUT /api/v1/users/batch/status` - Batch update user status (Admin)

### 2. Authentication (UserController) - 5 endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update current user info
- `PUT /api/users/me/password` - Change password

### 3. Vehicle Management (MobileVehicleController) - 11 endpoints
- `GET /api/v1/mobile/vehicles` - Get vehicle list with filters
- `GET /api/v1/mobile/vehicles/{vehicleId}` - Get vehicle details
- `GET /api/v1/mobile/vehicles/user/{userId}` - Get user vehicles
- `POST /api/v1/mobile/vehicles/user/{userId}` - Add user vehicle
- `PUT /api/v1/mobile/vehicles/{vehicleId}` - Update vehicle
- `DELETE /api/v1/mobile/vehicles/{vehicleId}` - Delete vehicle
- `POST /api/v1/mobile/vehicles/{vehicleId}/images` - Upload vehicle images
- `GET /api/v1/mobile/vehicles/{vehicleId}/images` - Get vehicle images
- `GET /api/v1/mobile/vehicles/brands` - Get vehicle brands
- `GET /api/v1/mobile/vehicles/models` - Get vehicle models
- `GET /api/v1/mobile/vehicles/models?brandId={brandId}` - Get models by brand

### 4. Vehicle Admin (VehicleController) - 6 endpoints
- `GET /api/vehicles` - Get all vehicles (Admin)
- `GET /api/vehicles/{vehicleNo}` - Get vehicle by number
- `GET /api/vehicles/my-vehicles` - Get current user vehicles
- `POST /api/vehicles` - Add vehicle
- `PUT /api/vehicles/{vehicleNo}` - Update vehicle
- `DELETE /api/vehicles/{vehicleNo}` - Delete vehicle

### 5. Vehicle Types (VehicleTypeController) - 5 endpoints
- `GET /api/vehicle-types` - Get all vehicle types
- `GET /api/vehicle-types/{typeCode}` - Get vehicle type by code
- `POST /api/vehicle-types` - Create vehicle type (Admin)
- `PUT /api/vehicle-types/{typeCode}` - Update vehicle type (Admin)
- `DELETE /api/vehicle-types/{typeCode}` - Delete vehicle type (Admin)

### 6. Booking Management (BookingController) - 12 endpoints
- `GET /api/v1/bookings` - Get booking list with filters
- `GET /api/v1/bookings/{bookingId}` - Get booking details
- `POST /api/v1/bookings` - Create booking
- `PUT /api/v1/bookings/{bookingId}` - Update booking
- `DELETE /api/v1/bookings/{bookingId}` - Delete booking
- `PUT /api/v1/bookings/{bookingId}/cancel` - Cancel booking
- `PUT /api/v1/bookings/{bookingId}/confirm` - Confirm booking (Admin)
- `PUT /api/v1/bookings/{bookingId}/complete` - Complete booking (Admin)
- `GET /api/v1/bookings/test-sites` - Get test sites
- `GET /api/v1/bookings/time-slots` - Get available time slots
- `GET /api/v1/bookings/user/{userId}` - Get user bookings
- `GET /api/v1/bookings/stats` - Get booking statistics

### 7. Test Registration (TestRegistrationController) - 15 endpoints
- `GET /api/v1/test-registration/tasks` - Get test tasks
- `GET /api/v1/test-registration/tasks/{taskId}` - Get task details
- `POST /api/v1/test-registration/tasks` - Create test task (Admin)
- `PUT /api/v1/test-registration/tasks/{taskId}` - Update test task (Admin)
- `DELETE /api/v1/test-registration/tasks/{taskId}` - Delete test task (Admin)
- `GET /api/v1/test-registration/registrations` - Get registrations
- `GET /api/v1/test-registration/registrations/{registrationId}` - Get registration details
- `POST /api/v1/test-registration/registrations` - Create registration
- `PUT /api/v1/test-registration/registrations/{registrationId}` - Update registration
- `DELETE /api/v1/test-registration/registrations/{registrationId}` - Cancel registration
- `PUT /api/v1/test-registration/registrations/{registrationId}/schedule` - Schedule test
- `PUT /api/v1/test-registration/registrations/{registrationId}/complete` - Complete test
- `GET /api/v1/test-registration/user/{userId}/registrations` - Get user registrations
- `GET /api/v1/test-registration/task/{taskId}/registrations` - Get task registrations
- `GET /api/v1/test-registration/stats` - Get registration statistics

### 8. Equipment Management (EquipmentController) - 11 endpoints
- `GET /api/v1/equipment` - Get equipment list
- `GET /api/v1/equipment/{equipmentId}` - Get equipment details
- `POST /api/v1/equipment` - Create equipment (Admin)
- `PUT /api/v1/equipment/{equipmentId}` - Update equipment (Admin)
- `DELETE /api/v1/equipment/{equipmentId}` - Delete equipment (Admin)
- `GET /api/v1/equipment/categories` - Get equipment categories
- `POST /api/v1/equipment/requests` - Create equipment request
- `GET /api/v1/equipment/requests` - Get equipment requests
- `PUT /api/v1/equipment/requests/{requestId}/approve` - Approve request (Admin)
- `PUT /api/v1/equipment/requests/{requestId}/return` - Return equipment
- `GET /api/v1/equipment/stats` - Get equipment statistics

### 9. Maintenance Management (MaintenanceController) - 8 endpoints
- `GET /api/maintenances` - Get maintenance list (Admin)
- `GET /api/maintenances/{maintenanceNo}` - Get maintenance details
- `GET /api/maintenances/my-maintenances` - Get current user maintenances
- `GET /api/maintenances/vehicle/{vehicleId}` - Get vehicle maintenances
- `POST /api/maintenances` - Create maintenance
- `PUT /api/maintenances/{maintenanceNo}` - Update maintenance
- `PUT /api/maintenances/{maintenanceNo}/cancel` - Cancel maintenance
- `PUT /api/maintenances/{maintenanceNo}/complete` - Complete maintenance (Admin)

### 10. Maintenance Items (MaintenanceItemController) - 4 endpoints
- `GET /api/maintenanceItem/list/{maintenanceNo}` - Get maintenance items
- `POST /api/maintenanceItem/batchSave/{maintenanceId}` - Batch save items
- `DELETE /api/maintenanceItem/{itemId}` - Delete item
- `DELETE /api/maintenanceItem/maintenance/{maintenanceNo}` - Delete all items

### 11. Work Orders (WorkOrderController) - 9 endpoints
- `GET /api/work-orders` - Get work orders (Admin/Technician)
- `GET /api/work-orders/{orderNo}` - Get work order details
- `GET /api/work-orders/maintenance/{maintenanceId}` - Get work order by maintenance
- `GET /api/work-orders/technician/{technicianId}` - Get technician work orders
- `POST /api/work-orders` - Create work order (Admin)
- `PUT /api/work-orders/{orderNo}/assign-technician` - Assign technician (Admin)
- `PUT /api/work-orders/{orderNo}/start` - Start work order
- `PUT /api/work-orders/{orderNo}/complete` - Complete work order
- `PUT /api/work-orders/{orderNo}/cancel` - Cancel work order (Admin)

### 12. Appointments (AppointmentController) - 7 endpoints
- `GET /api/appointments` - Get appointments (Admin)
- `GET /api/appointments/{appointmentNo}` - Get appointment details
- `GET /api/appointments/user/{userId}` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{appointmentNo}` - Update appointment
- `PUT /api/appointments/{appointmentNo}/approve` - Approve appointment (Admin)
- `PUT /api/appointments/{appointmentNo}/complete` - Complete appointment (Admin)

### 13. Message Management (MessageController) - 13 endpoints
- `GET /api/v1/messages` - Get message list
- `GET /api/v1/messages/{messageId}` - Get message details
- `POST /api/v1/messages` - Send message
- `PUT /api/v1/messages/{messageId}` - Update message
- `DELETE /api/v1/messages/{messageId}` - Delete message
- `PUT /api/v1/messages/{messageId}/read` - Mark as read
- `PUT /api/v1/messages/batch/read` - Batch mark as read
- `GET /api/v1/messages/unread-count` - Get unread count
- `GET /api/v1/messages/templates` - Get message templates
- `POST /api/v1/messages/templates` - Create message template (Admin)
- `PUT /api/v1/messages/templates/{templateId}` - Update template (Admin)
- `DELETE /api/v1/messages/templates/{templateId}` - Delete template (Admin)
- `POST /api/v1/messages/broadcast` - Broadcast message (Admin)

### 14. File Management (FileController) - 11 endpoints
- `POST /api/v1/files/upload` - Upload single file
- `POST /api/v1/files/batch-upload` - Batch upload files
- `GET /api/v1/files/download/{fileId}` - Download file
- `GET /api/v1/files/{fileId}` - Get file info
- `GET /api/v1/files` - Get file list with filters
- `DELETE /api/v1/files/{fileId}` - Delete file
- `POST /api/v1/files/batch-delete` - Batch delete files
- `GET /api/v1/files/{fileId}/preview` - Get file preview URL
- `PUT /api/v1/files/{fileId}` - Update file info
- `GET /api/v1/files/stats` - Get file statistics

### 15. User Attachments (UserAttachmentController) - 5 endpoints
- `POST /api/user-attachments/upload/{userId}` - Upload user attachment
- `GET /api/user-attachments/{attachmentId}` - Get attachment
- `GET /api/user-attachments/user/{userId}` - Get user attachments
- `DELETE /api/user-attachments/{attachmentId}` - Delete attachment
- `GET /api/user-attachments/download/{fileName}` - Download attachment

### 16. Role Management (RoleController) - 7 endpoints
- `GET /api/roles` - Get all roles (Admin)
- `GET /api/roles/{roleCode}` - Get role details (Admin)
- `GET /api/roles/user/{userId}` - Get user roles (Admin)
- `POST /api/roles` - Add role (Admin)
- `PUT /api/roles/{roleCode}` - Update role (Admin)
- `DELETE /api/roles/{roleCode}` - Delete role (Admin)
- `POST /api/roles/assign` - Assign role to user (Admin)

### 17. Dashboard (DashboardController) - 7 endpoints
- `GET /api/v1/mobile/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/mobile/dashboard/recent-bookings` - Get recent bookings
- `GET /api/v1/mobile/dashboard/notifications` - Get notifications
- `GET /api/v1/mobile/dashboard/quick-actions` - Get quick actions
- `GET /api/v1/mobile/dashboard/weather` - Get weather info
- `GET /api/v1/mobile/dashboard/announcements` - Get announcements
- `GET /api/v1/mobile/dashboard/user-profile` - Get user profile summary

## Response Format Standards

### Success Response
```json
{
  "code": 200,
  "message": "Success",
  "data": { ... }
}
```

### Error Response
```json
{
  "code": 400,
  "message": "Error message",
  "data": null
}
```

### Pagination Response
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [...],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0
  }
}
```

## Authentication & Authorization

### JWT Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access Control
- **ADMIN**: Full system access
- **CUSTOMER**: User-specific operations
- **TECHNICIAN**: Technical operations
- **GUEST**: Public endpoints only

## Status Codes
- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Rate Limiting
- **General APIs**: 1000 requests/hour per user
- **File Upload**: 100 requests/hour per user
- **Authentication**: 10 requests/minute per IP

## API Versioning
- Current version: v1
- Version specified in URL path: `/api/v1/`
- Backward compatibility maintained for 2 major versions
