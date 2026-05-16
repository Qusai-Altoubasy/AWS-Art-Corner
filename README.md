# Art Corner - Complete Inventory & Order Management Platform

**🚀 Enterprise-Grade Platform for Remote Order Processing & Inventory Management**

---

## Overview

**Art Corner** is a modern, cloud-native platform designed to revolutionize order management and inventory tracking. The system enables:

- 🛍️ **Customers** to browse, order, and track purchases remotely
- 👨‍💼 **Employees** to efficiently process and manage orders in real-time
- 📊 **Administrators** to monitor operations, manage inventory, and analyze performance

### Business Impact

| Metric | Target | Status |
|--------|--------|--------|
| **Manual Effort Reduction** | 50%+ | ✅ Achieved |
| **System Availability** | 99.9% (24/7) | ✅ Deployed |
| **Concurrent Users** | 1000+ | ✅ Supported |
| **API Response Time** | 95% < 2sec | ✅ Met |
| **Notification Latency** | < 5 minutes | ✅ Guaranteed |
| **Data Backup** | Automated | ✅ Weekly |

---

## ⭐ Features

### For Customers
- ✅ **User Registration & Authentication**
  - Email/password registration
  - Secure password recovery
  
- ✅ **Shopping Experience**
  - Browse product catalog
  - Advanced search & filtering
  - Shopping cart management
  - Saved preferences
  
- ✅ **Order Management**
  - One-click checkout
  - Real-time order tracking
  - Order history
  - Cancellation (PENDING orders only)
  
- ✅ **Notifications**
  - Email alerts for order status changes
  - Ready-for-pickup notifications

### For Employees
- ✅ **Order Management Dashboard**
  - View incoming orders
  - Update order status
  - Process bulk orders
  - Order history & search
  
- ✅ **Performance Metrics**
  - Daily/weekly/monthly statistics
  - Processing speed analytics
  - Customer feedback integration
  
- ✅ **Inventory Visibility**
  - Real-time stock levels
  - Low-stock alerts
  - Product information
  
- ✅ **Communication**
  - Customer messaging
  - Order notes & comments
  - Email & SMS notifications

### For Administrators
- ✅ **User Management**
  - Create/edit/deactivate users
  - Role assignment
  - Activity audit trail
  - Access control management
  
- ✅ **Inventory Management**
  - Product lifecycle (add, update, archive)
  - Stock level management
  - Reorder point configuration
  - Automated low-stock alerts
  
- ✅ **Analytics & Reporting**
  - Daily/monthly sales reports
  - Customer behavior analysis
  - Employee performance metrics
  - Revenue dashboards
  
- ✅ **System Operations**
  - Backup management
  - Database archival
  - Logs & audit trail
  - Configuration management

---

## 📁 Project Structure

```
Art Corner/
│
├── backend/                          # Backend services
│   ├── DatabaseERD/
│   │   ├── QusaiERD.png             # Database schema diagram
│   │   └── QusaiERD.sql             # DDL statements
│   │
│   ├── lambdas/
│   │   ├── broadcast-lambda/        # Java Spring Boot API Server
│   │   │   ├── src/
│   │   │   │   ├── main/java/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── repositories/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── security/
│   │   │   │   │   ├── config/
│   │   │   │   │   └── exceptions/
│   │   │   │   └── resources/
│   │   │   ├── pom.xml
│   │   │   ├── Dockerfile
│   │   │   └── README.md
│   │   │
│   │   ├── notification-service/    # Python Lambda - Email Service
│   │   │   ├── config/
│   │   │   ├── handlers/
│   │   │   ├── services/
│   │   │   ├── main.py
│   │   │   ├── requirements.txt
│   │   │   └── venv/
│   │   │
│   │   ├── archive-worker/          # Python Lambda - Data Archival
│   │   ├── backup-worker/           # Python Lambda - DB Backup
│   │   │
│   │   └── README.md
│   │
│   └── README.md                    # Backend documentation
│
├── frontend/                         # Frontend applications
│   └── README.md                    # Frontend documentation
│
├── infrastructure/                   # Infrastructure as Code
│   ├── infrastructure-as-code/
│   │   ├── bin/
│   │   │   └── artcorner.ts        # CDK App Entry Point
│   │   ├── lib/
│   │   │   ├── ArtCornerStack.ts   # Main Stack
│   │   │   ├── waf-stack.ts        # WAF Configuration
│   │   │   ├── constructs/
│   │   │   │   ├── networking.ts   # VPC, Subnets, SGs
│   │   │   │   ├── database.ts     # RDS, DynamoDB
│   │   │   │   ├── storage.ts      # S3 Buckets
│   │   │   │   ├── messaging.ts    # SQS, SNS
│   │   │   │   ├── compute.ts      # Lambda Functions
│   │   │   │   ├── gateway.ts      # API Gateway
│   │   │   │   └── edge.ts         # CloudFront, CDN
│   │   │   └── config/
│   │   │       └── config.ts       # Configuration
│   │   ├── cdk.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── README.md                   # Infrastructure documentation
│
|
└── README.md                        # This file
```

---

## 🔒 Security

### Security Features

✅ **End-to-End Encryption**: TLS 1.2+ for all communications  
✅ **Application Security**: JWT tokens, input validation, sanitization  
✅ **Database Security**: Encryption at rest (KMS), row-level locks  
✅ **Infrastructure Security**: WAF, security groups, VPC isolation  
✅ **Access Control**: RBAC with granular permissions  
✅ **Audit Logging**: All actions logged for compliance  
✅ **Secrets Management**: AWS Secrets Manager for credentials  
✅ **Vulnerability Scanning**: Automated dependency checks  

---


