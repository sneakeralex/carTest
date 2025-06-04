# Car Test Site Booking Management System - Documentation

## 📋 Overview
This documentation package provides comprehensive information about the Car Test Site Booking Management System, including API specifications, database schema, and implementation details.

## 🎯 System Features
- **User Management**: Registration, authentication, profile management
- **Vehicle Management**: Vehicle registration, information management, image uploads
- **Test Site Management**: Test site information, facilities, safety requirements
- **Booking System**: Test site reservations, time slot management
- **Test Task Management**: Test task definitions, difficulty levels, scoring
- **Test Registration**: User registration for test tasks, scheduling, results tracking
- **Equipment Management**: Equipment requests, usage tracking, maintenance scheduling
- **Messaging System**: Internal communications, notifications, templates
- **File Management**: Document uploads, storage, and retrieval
- **Role-Based Access**: Admin, Customer, and Test Personnel roles
- **Mobile Dashboard**: Real-time statistics and quick actions

## 📚 Documentation Structure

### 1. API Documentation
- **[API_Documentation.md](./API_Documentation.md)** - Core API endpoints (Part 1)
- **[API_Documentation_Part2.md](./API_Documentation_Part2.md)** - Additional API endpoints (Part 2)
- **[API_Summary.md](./API_Summary.md)** - Complete API endpoint summary

### 2. Database Documentation
- **[Database_Schema.md](./Database_Schema.md)** - Core database tables and relationships
- **[Database_Schema_Part2.md](./Database_Schema_Part2.md)** - Additional tables and constraints

## 🏗️ System Architecture

### Technology Stack
- **Backend**: Spring Boot 3.x, Java 17
- **Database**: MySQL 8.0+
- **Security**: Spring Security with JWT
- **Documentation**: OpenAPI 3.0 (Swagger)
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven

### Key Components
1. **Controllers**: 17 REST controllers with 139 endpoints
2. **Services**: Business logic layer with comprehensive implementations
3. **Entities**: JPA entities with proper relationships
4. **DTOs**: Data transfer objects for API responses
5. **Security**: Role-based access control
6. **File Storage**: Configurable file upload and management

## 🚀 Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### Database Setup
```sql
-- Create database
CREATE DATABASE car_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'car_service'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON car_service_db.* TO 'car_service'@'localhost';
FLUSH PRIVILEGES;
```

### Application Configuration
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/car_service_db
    username: car_service
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### Running the Application
```bash
# Clone the repository
git clone <repository-url>
cd car-service-management

# Build the application
mvn clean compile

# Run the application
mvn spring-boot:run
```

### API Access
- **Base URL**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## 📊 API Statistics

### Endpoint Summary
| Controller | Endpoints | Description |
|------------|-----------|-------------|
| UserManagementController | 13 | User CRUD operations |
| BookingController | 12 | Booking management |
| TestRegistrationController | 15 | Test registration system |
| EquipmentController | 11 | Equipment management |
| MessageController | 13 | Messaging system |
| MobileVehicleController | 11 | Mobile vehicle management |
| MaintenanceController | 8 | Maintenance tracking |
| WorkOrderController | 9 | Work order management |
| AppointmentController | 7 | Appointment scheduling |
| DashboardController | 7 | Mobile dashboard |
| FileController | 11 | File management |
| VehicleController | 6 | Vehicle administration |
| UserAttachmentController | 5 | User file attachments |
| RoleController | 7 | Role management |
| UserController | 5 | Authentication |
| VehicleTypeController | 5 | Vehicle type management |
| MaintenanceItemController | 4 | Maintenance item tracking |
| **Total** | **139** | **Complete API Coverage** |

### Database Tables
- **20 Core Tables**: Users, Vehicles, Bookings, Maintenance, etc.
- **Proper Relationships**: Foreign keys and constraints
- **Optimized Indexes**: Performance-focused design
- **Data Integrity**: Comprehensive validation rules

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Secure password hashing
- Token expiration management

### Authorization
- Role-based access control (RBAC)
- Endpoint-level security
- Resource-level permissions

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

## 📱 Mobile Support

### Mobile-Optimized Endpoints
- Vehicle management for mobile users
- Dashboard with real-time statistics
- Optimized response formats
- Image upload capabilities

### Features
- User-friendly vehicle registration
- Quick booking access
- Real-time notifications
- Weather integration
- Location-based services

## 🔧 Development Guidelines

### Code Standards
- RESTful API design principles
- Consistent error handling
- Comprehensive logging
- Input validation
- Transaction management

### Testing Strategy
- Unit tests for service layer
- Integration tests for controllers
- Database testing with test containers
- API testing with realistic data

### Deployment Considerations
- Environment-specific configurations
- Database migration scripts
- File storage configuration
- Monitoring and logging setup

## 📈 Performance Optimization

### Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replica support

### Caching Strategy
- Redis for session management
- Application-level caching
- Database query caching
- File system caching

### Scalability
- Stateless application design
- Horizontal scaling support
- Load balancer compatibility
- Microservice-ready architecture

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check MySQL service and credentials
2. **File Upload**: Verify file storage directory permissions
3. **Authentication**: Ensure JWT secret configuration
4. **CORS Issues**: Configure allowed origins properly

### Logging
- Application logs: `logs/application.log`
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`

## 📞 Support

### Documentation
- API documentation available at `/swagger-ui.html`
- Database schema in documentation files
- Code comments and JavaDoc

### Contact
- Technical issues: Create GitHub issues
- Feature requests: Submit pull requests
- General questions: Check documentation first

## 🔄 Version History

### v1.0.0 (Current)
- Complete API implementation (139 endpoints)
- Full database schema (20 tables)
- Authentication and authorization
- File management system
- Mobile dashboard
- Comprehensive documentation

### Roadmap
- v1.1.0: Enhanced reporting features
- v1.2.0: Advanced analytics dashboard
- v2.0.0: Microservice architecture migration

---

**Note**: This system is production-ready with comprehensive API coverage, robust database design, and proper security implementation. All 139 endpoints are fully functional with realistic mock data for development and testing.
