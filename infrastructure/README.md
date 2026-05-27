# ArtCorner ERP - Infrastructure as Code (CDK)

![AWS](https://img.shields.io/badge/AWS-CDK-orange?logo=amazonaws)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Infrastructure](https://img.shields.io/badge/Infrastructure-As_Code-green)
![Serverless](https://img.shields.io/badge/Architecture-Serverless-purple)

## Overview

The **ArtCorner ERP Infrastructure** is a fully cloud-native, serverless, and event-driven AWS environment provisioned using **AWS CDK (TypeScript)**.

This infrastructure layer orchestrates the complete backend ecosystem required for the ERP platform, including networking, databases, compute services, asynchronous messaging, email delivery, monitoring, and scalable Lambda deployments.

The architecture is designed for:

- High availability
- Scalability
- Cost optimization
- Event-driven communication
- Secure private networking
- Environment isolation (`dev` / `prod`)

---

# Architecture Overview

The infrastructure stack provisions the following AWS resources:

## Networking

- Multi-AZ VPC Architecture
- Public and Private Subnets
- Security Groups and IAM-based access control

### Private Subnets

All compute and database resources are isolated inside private subnets:

- Aurora PostgreSQL Cluster
- Containerized Lambda Functions
- Internal Services

This design minimizes external exposure and improves security posture.

---

## Databases

### Amazon Aurora PostgreSQL (RDS)

Primary relational database for:

- Orders
- Inventory
- Reports
- User-related business data
- Financial operations

Features:

- Multi-AZ deployment
- Automated backups
- Read scalability
- Secure private connectivity

---

### Amazon DynamoDB

Used for high-speed shopping cart persistence.

Typical use cases:

- Temporary cart sessions
- Fast customer cart retrieval
- Low-latency transactional reads/writes

---

## Messaging & Event-Driven Services

### Amazon SQS FIFO Queues

The backend publishes transactional events into FIFO queues for reliable asynchronous processing.

Features:

- Guaranteed ordering
- Exactly-once processing semantics
- Message Group IDs
- Dead Letter Queue (DLQ) support

---

### Dead Letter Queues (DLQ)

Failed messages are automatically redirected for:

- Retry handling
- Diagnostics
- Operational monitoring
- Failure isolation

---

## Notifications

### Amazon SNS

SNS Topics are used for:

- Employee alerts
- Administrative notifications
- Operational system events

---

### Amazon SES

SES powers transactional email delivery for:

- Order confirmations
- Status updates
- Customer communication
- Internal reporting

---

# Infrastructure Components

```text
infrastructure/
└── infrastructure-as-code/
    ├── bin/
    ├── lib/
    ├── config/
    ├── package.json
    ├── tsconfig.json
    └── cdk.json
```

---

# Configuration Management

Environment-specific behavior is managed through:

```text
config/config.ts
```

The configuration layer dynamically handles:

- Deployment environments (`dev` / `prod`)
- Resource naming conventions
- Stack tagging
- Lambda memory allocation
- Timeout configurations
- Concurrency scaling limits
- Database sizing
- Queue retention policies

Example responsibilities:

```ts
export const config = {
  environment: "dev",
  lambdaMemory: 2048,
  reservedConcurrency: 10,
  enableDeletionProtection: false,
};
```

---

# Security Design

The infrastructure follows AWS security best practices:

- IAM least-privilege permissions
- Private subnet isolation
- Secrets stored in AWS Secrets Manager
- Security Group restrictions
- Encrypted database connections
- Queue-level access policies

---

# Monitoring & Observability

Operational visibility includes:

- CloudWatch Logs
- Lambda Metrics
- DLQ Monitoring
- Queue Depth Monitoring
- RDS Performance Insights
- CloudWatch Alarms

---

# ArtCorner ERP

Enterprise-grade cloud-native ERP infrastructure powered by AWS CDK and modern serverless architecture.
