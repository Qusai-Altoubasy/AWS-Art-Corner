# 🚀 Art Corner - Backend Service

**Advanced Inventory & Order Management Platform**

> A comprehensive, scalable backend architecture for a distributed order management system with real-time notifications, inventory tracking, and intelligent reporting.

## 📖 Overview

The **Art Corner Backend** is an enterprise-grade order management system designed to handle multi-role operations across customers, employees, and administrators. The platform leverages AWS cloud services for scalability, reliability, and performance.

### Key Objectives

✅ **50% reduction** in manual order processing effort  
✅ **24/7 availability** with automated backup and disaster recovery  
✅ **1000+ concurrent users** support with sub-2-second response times  
✅ **Real-time notifications** via email (< 5 minutes delivery)  
✅ **Role-based access control** (RBAC) for secure operations  
✅ **Comprehensive audit logging** for compliance and debugging  

---

## 🔧 Core Components

### 1. **Main API Server** (Java/Spring Boot)
- REST API endpoints for all operations
- User authentication & authorization
- Order processing workflows
- Product & inventory management
- Comprehensive error handling
- Request validation & sanitization

### 2. **Broadcast Service** (Java)
- Real-time event broadcasting
- WebSocket support for live updates
- Order status notifications
- Dashboard synchronization

### 3. **Worker Services** (Python Lambda)
- **Archive Worker**: Periodically archives inactive records to S3
- **Backup Worker**: Automated database backups to S3 (Fridays 3 AM)
- **Notification Service**: Email dispatch via AWS SES
  - Order placed notifications (to employees)
  - Order updated notifications (to customers)
  - Stock alert notifications (to admins)

### 4. **Notification Service** (Python)
Core handlers:
- `order_placed_handler.py` - Triggers when customer places order
- `order_updated_handler.py` - Triggers on order status changes
- `stock_alert_handler.py` - Triggers when inventory <= 1000 units

---

## 📁 Project Structure

```
backend/
├── DatabaseERD/
│   ├── QusaiERD.png          # Database schema visualization
│   └── QusaiERD.sql          # SQL DDL statements
│
├── lambdas/
│   ├── broadcast-lambda/     # Java Spring Boot API
│   │   ├── src/
│   │   │   ├── main/java/
│   │   │   │   ├── controllers/       # REST endpoints
│   │   │   │   ├── services/         # Business logic
│   │   │   │   ├── repositories/     # Data access
│   │   │   │   ├── entities/           # JPA entities
│   │   │   │   ├── security/         # Auth & RBAC
│   │   │   │   ├── config/           # Spring configuration
│   │   │   │   └── exceptions/       # Custom exceptions
│   │   │   └── resources/
│   │   │       ├── application.yaml  # Spring config
│   │   │       └── db/migrations/    # Flyway migrations
│   │   ├── pom.xml                   # Maven dependencies
│   │   └── Dockerfile                # Container image
│   │
│   ├── notification-service/  # Python Lambda Functions
│   │   ├── config/
│   │   │   └── vars.py              # Environment variables
│   │   ├── handlers/
│   │   │   ├── order_placed_handler.py
│   │   │   ├── order_updated_handler.py
│   │   │   └── stock_alert_handler.py
│   │   ├── services/
│   │   │   ├── ses_service.py       # Email delivery
│   │   │   └── sns_service.py       # SNS publishing
│   │   ├── main.py                  # Entry point
│   │   ├── router.py                # Event routing
│   │   ├── requirements.txt         # Python dependencies
│   │   └── venv/                    # Virtual environment
│   │
│   ├── archive-worker/        # Python Lambda - Data Archival
│   │   └── main.py           # Archives inactive records
│   │
│   └── backup-worker/         # Python Lambda - Database Backup
│       └── main.py           # Scheduled backup to S3
│
└── README.md
```

---

## ⭐ Key Features

### 1. **Order Management**
- ✅ Create, read, update orders
- ✅ Order status tracking (PENDING → ACCEPTED → PROCESSING → READY → DELIVERING → COMPLETED)
- ✅ Order cancellation (only when PENDING)
- ✅ Comprehensive audit logging
- ✅ Soft delete support (records marked inactive, retained for audit)

### 2. **Inventory Management**
- ✅ Real-time stock tracking
- ✅ Prevent negative inventory (row-level database locks)
- ✅ Automatic stock alerts (≤1000 units)
- ✅ Product lifecycle management
- ✅ Quantity validation before order confirmation

### 3. **User Management**
- ✅ Role-based access control (Customer, Employee, Admin)
- ✅ User activation/deactivation
- ✅ Activity audit trail

### 4. **Notification System**
- ✅ Email notifications (< 5-minute SLA)
- ✅ Event-driven architecture (SQS/SNS)
- ✅ Dead-letter queue for failed messages
- ✅ Template-based email generation

### 5. **Reporting & Analytics**
- ✅ Daily/monthly sales reports
- ✅ Customer order history
- ✅ Employee performance metrics

### 6. **Data Management**
- ✅ Automated backups (Fridays 3 AM)
- ✅ 90-day archive of inactive records
- ✅ Database versioning
- ✅ Point-in-time recovery (DynamoDB)
- ✅ Data encryption at rest & in transit

---

## 🗄️ Database Schema

### Core Tables

**Users**
- id (PK)
- email (UNIQUE)
- password (hashed)
- role (ENUM: CUSTOMER, EMPLOYEE, ADMIN)
- is_active (BOOLEAN)
- created_at, updated_at

**Products**
- id (PK)
- name
- description
- price
- quantity (current stock)
- min_stock_level
- is_active
- created_at, updated_at

**Orders**
- id (PK)
- customer_id (FK)
- status (ENUM: PENDING, ACCEPTED, PROCESSING, READY, DELIVERING, COMPLETED)
- total_amount
- created_at, updated_at
- deleted_at (soft delete)

**OrderItems**
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity
- unit_price
- subtotal

See `DatabaseERD/QusaiERD.sql` for complete DDL with indexes and constraints.

---

### Performance Optimization

**Database**
- Index optimization (see schema)
- Connection pooling: HikariCP (10-20 connections)
- Query caching (Redis/ElastiCache)
- Row-level locks for inventory updates
