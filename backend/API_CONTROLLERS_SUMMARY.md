# Mobile API Layer Controllers Summary

## Overview
This document provides a comprehensive summary of all the mobile API layer controllers created for the car management system. These controllers provide RESTful APIs specifically designed for mobile applications.

## API Controllers Created

### 1. UserManagementController (`/api/v1/user-management`)
**Purpose**: Mobile user center functionality including login, profile management, and face authentication.

**Key Endpoints**:
- `POST /login` - User login with multiple authentication methods
- `POST /logout` - User logout
- `GET /{userId}` - Get user information
- `PUT /{userId}` - Update user information
- `POST /{userId}/change-password` - Change password
- `POST /{userId}/avatar` - Upload avatar
- `GET /{userId}/employee` - Get employee information
- `PUT /{userId}/employee` - Update employee information
- `GET /{userId}/person` - Get personal information
- `PUT /{userId}/person` - Update personal information
- `POST /{userId}/face-auth/register` - Register face authentication
- `POST /{userId}/face-auth/verify` - Verify face authentication
- `GET /{userId}/face-auth` - Get face authentication info
- `PUT /{userId}/face-auth/status` - Update face authentication status

### 2. BookingController (`/api/v1/bookings`)
**Purpose**: Site booking and scheduling management for mobile users.

**Key Endpoints**:
- `GET /sites` - Get site list with filtering
- `GET /sites/{siteId}` - Get site details
- `GET /sites/{siteId}/schedules` - Get site schedules
- `GET /sites/{siteId}/availability` - Check site availability
- `POST /` - Create booking
- `GET /user/{userId}` - Get user bookings
- `GET /{bookingId}` - Get booking details
- `PUT /{bookingId}` - Update booking
- `POST /{bookingId}/cancel` - Cancel booking
- `GET /sites/{siteId}/weather` - Get weather information
- `GET /sites/{siteId}/weather/history` - Get weather history
- `GET /sites/{siteId}/weather/suitability` - Check weather suitability

### 3. TestRegistrationController (`/api/v1/test-registration`)
**Purpose**: Test task and project management for mobile users.

**Key Endpoints**:
- `POST /tasks` - Create test task
- `GET /tasks` - Get test task list
- `GET /tasks/{taskId}` - Get test task details
- `PUT /tasks/{taskId}` - Update test task
- `DELETE /tasks/{taskId}` - Delete test task
- `POST /tasks/{taskId}/projects` - Add test project
- `GET /tasks/{taskId}/projects` - Get test projects
- `PUT /projects/{projectId}` - Update test project
- `DELETE /projects/{projectId}` - Delete test project
- `POST /projects/{projectId}/vehicles` - Add task vehicle
- `GET /projects/{projectId}/vehicles` - Get task vehicles
- `POST /vehicles/{taskVehicleId}/contents` - Add test content
- `GET /vehicles/{taskVehicleId}/contents` - Get test contents
- `PUT /contents/{contentId}` - Update test content
- `DELETE /contents/{contentId}` - Delete test content
- `GET /contracts/{contractNo}` - Get contract information
- `GET /contracts/user/{userId}` - Get user contracts

### 4. EquipmentController (`/api/v1/equipment`)
**Purpose**: Equipment management and request handling for mobile users.

**Key Endpoints**:
- `GET /` - Get equipment list with filtering
- `GET /{equipmentId}` - Get equipment details
- `GET /{equipmentId}/availability` - Check equipment availability
- `POST /requests` - Create equipment request
- `GET /requests/user/{userId}` - Get user equipment requests
- `GET /requests/{requestId}` - Get equipment request details
- `PUT /requests/{requestId}` - Update equipment request
- `POST /requests/{requestId}/cancel` - Cancel equipment request
- `GET /{equipmentId}/maintenance` - Get equipment maintenance records
- `POST /{equipmentId}/maintenance` - Create maintenance record
- `GET /{equipmentId}/usage-stats` - Get equipment usage statistics
- `GET /categories` - Get equipment categories

### 5. MessageController (`/api/v1/messages`)
**Purpose**: Message and notification management for mobile users.

**Key Endpoints**:
- `GET /user/{userId}` - Get user messages with filtering
- `GET /{messageId}` - Get message details
- `POST /{messageId}/read` - Mark message as read
- `POST /batch-read` - Batch mark messages as read
- `DELETE /{messageId}` - Delete message
- `POST /batch-delete` - Batch delete messages
- `POST /send` - Send message
- `GET /user/{userId}/unread-count` - Get unread message count
- `GET /templates` - Get message templates
- `GET /templates/{templateId}` - Get message template details
- `POST /send-with-template` - Send message with template
- `GET /settings/user/{userId}` - Get user message settings
- `PUT /settings/user/{userId}` - Update user message settings

### 6. MobileVehicleController (`/api/v1/mobile/vehicles`)
**Purpose**: Vehicle management specifically for mobile applications.

**Key Endpoints**:
- `GET /` - Get vehicle list with filtering
- `GET /{vehicleId}` - Get vehicle details
- `GET /user/{userId}` - Get user vehicles
- `POST /user/{userId}` - Add user vehicle
- `PUT /{vehicleId}` - Update vehicle information
- `DELETE /{vehicleId}` - Delete vehicle
- `POST /{vehicleId}/images` - Upload vehicle images
- `GET /{vehicleId}/images` - Get vehicle images
- `GET /brands` - Get vehicle brands
- `GET /models` - Get vehicle models

### 7. DashboardController (`/api/v1/dashboard`)
**Purpose**: Mobile dashboard and home screen data.

**Key Endpoints**:
- `GET /user/{userId}` - Get user dashboard data
- `GET /user/{userId}/stats` - Get user statistics
- `GET /user/{userId}/recent-activities` - Get recent activities
- `GET /user/{userId}/todos` - Get user todos
- `GET /user/{userId}/quick-actions` - Get quick actions
- `GET /announcements` - Get system announcements
- `GET /weather` - Get weather information

### 8. FileController (`/api/v1/files`)
**Purpose**: File upload, download, and management for mobile users.

**Key Endpoints**:
- `POST /upload` - Upload single file
- `POST /batch-upload` - Batch upload files
- `GET /download/{fileId}` - Download file
- `GET /{fileId}` - Get file information
- `GET /` - Get file list with filtering
- `DELETE /{fileId}` - Delete file
- `POST /batch-delete` - Batch delete files
- `GET /{fileId}/preview` - Get file preview URL
- `PUT /{fileId}` - Update file information
- `GET /stats` - Get file statistics

## Common Features

### 1. Unified Response Format
All controllers use the `ApiResponse<T>` wrapper for consistent response formatting:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {...},
  "timestamp": 1234567890
}
```

### 2. Comprehensive Error Handling
- Standardized error responses
- Detailed error logging
- User-friendly error messages in Chinese

### 3. Swagger Documentation
- Complete OpenAPI 3.0 documentation
- Chinese descriptions for all endpoints
- Parameter validation and examples

### 4. Pagination Support
- Spring Data pagination for list endpoints
- Configurable page size and sorting

### 5. File Upload Support
- MultipartFile support for image and document uploads
- Batch upload capabilities

### 6. Date/Time Handling
- ISO 8601 format support
- Proper LocalDateTime formatting

### 7. Validation
- Jakarta validation annotations
- Request DTO validation

## Implementation Status
- ✅ **Controllers Created**: All 8 controllers implemented
- ✅ **Compilation**: Successfully compiles without errors
- ✅ **Documentation**: Comprehensive Swagger documentation
- ✅ **Error Handling**: Standardized error responses
- ⏳ **Service Implementation**: Business logic to be implemented
- ⏳ **Database Integration**: Entity mappings and repositories
- ⏳ **Security**: Authentication and authorization
- ⏳ **Testing**: Unit and integration tests

## Next Steps
1. Implement service layer business logic
2. Set up database connections and create tables
3. Add JWT authentication and authorization
4. Create comprehensive test suites
5. Deploy and test with mobile applications

## Notes
- All service dependencies are commented out to avoid compilation errors
- Controllers return placeholder responses with "功能开发中" messages
- Ready for business logic implementation
- Follows RESTful API design principles
- Designed specifically for mobile application requirements
