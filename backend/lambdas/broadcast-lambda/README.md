# ArtCorner ERP - Broadcast Lambda (Main API Backend)

![Java](https://img.shields.io/badge/Java-21-red?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?logo=springboot)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange?logo=awslambda)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)

## Overview

The **Broadcast Lambda** is the primary backend service powering the ArtCorner ERP ecosystem.

It is implemented as a high-performance **Spring Boot** application packaged into a Docker container and deployed to **AWS Lambda**.

The service is responsible for:

- Core business logic
- User management
- Inventory validation
- Order processing
- Reporting operations
- Shopping cart workflows
- Asynchronous event publishing

The backend follows an event-driven architecture and integrates tightly with AWS-managed services.

---

# Core Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Main backend language |
| Spring Boot 3.x | Enterprise backend framework |
| Docker | Lambda container packaging |
| PostgreSQL | Relational persistence |
| Spring Data JPA / Hibernate | ORM layer |
| DynamoDB SDK | Shopping cart storage |
| AWS SQS SDK | Event publishing |
| AWS Cognito | Authentication & user management |
| AWS Secrets Manager | Secure runtime configuration |

---

# Architecture Overview

```text
Client Applications
        ↓
    CloudFront
        ↓
    API Gateway
        ↓
Broadcast Lambda (Spring Boot)
        ↓
 ┌───────────────────────────────┐
 │ Business Logic Layer          │
 │ Inventory Validation          │
 │ Order Processing              │
 │ User Management               │
 │ Reporting                     │
 └───────────────────────────────┘
        ↓
 ┌───────────────┬───────────────┬───────────────┐
 │ Aurora RDS    │ DynamoDB      │ SQS FIFO      │
 │ PostgreSQL    │ Shopping Cart │ Event Queue   │
 └───────────────┴───────────────┴───────────────┘
```

---

# Key Features

## User Management via Cognito

The backend integrates with Amazon Cognito for:

- Authentication
- Authorization
- Role-based access control
- Secure JWT validation

---

## Dynamic Configuration

Runtime configuration is managed using:

- `AppProperties`
- AWS Secrets Manager

This enables:

- Environment-aware deployments
- Secure credential management
- Dynamic runtime behavior

---

# Shopping Cart Persistence

Shopping carts are stored in Amazon DynamoDB for low-latency access.

## Repository Design

```text
CartRepository
```

### DynamoDB Schema

| Attribute | Role |
|---|---|
| `customerId` | Partition Key |
| `productId` | Sort Key |

Benefits:

- Fast retrieval
- Horizontal scalability
- Optimized customer cart queries

---

# Inventory Validation

Before order creation:

- Product stock quantities are validated
- Inventory consistency checks are performed
- Business constraints are enforced

This ensures transactional integrity before event publication.

---

# Event-Driven Processing

After successful business operations, the backend publishes events into AWS SQS FIFO queues.

## Event Characteristics

- Ordered processing
- Message Group IDs
- Exactly-once semantics
- Decoupled downstream services

Example events:

- OrderPlaced
- OrderUpdated
- StockAlert

---

# Project Structure

```text
broadcast-lambda/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
├── Dockerfile
├── pom.xml
├── mvnw
└── mvnw.cmd
```

---

# AWS Integrations

| Service | Purpose |
|---|---|
| AWS Lambda | Serverless execution |
| Amazon Cognito | Identity management |
| Aurora PostgreSQL | Relational database |
| DynamoDB | Cart persistence |
| Amazon SQS FIFO | Event messaging |
| AWS Secrets Manager | Secure configuration |
| Amazon ECR | Container registry |

---

# Scalability & Performance

The service is optimized for:

- Stateless execution
- Horizontal Lambda scaling
- Asynchronous processing
- Reduced API response latency
- Efficient database interactions

---

# Observability

Operational monitoring includes:

- CloudWatch Logs
- Lambda metrics
- Queue monitoring
- Error tracking
- Transaction tracing

---

# ArtCorner ERP

Enterprise-grade backend infrastructure powered by Spring Boot, AWS Lambda, and event-driven cloud architecture.
