# ArtCorner ERP - Frontend Web Applications

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Frontend_Bundler-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Utility_First-06B6D4?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-brown)
![React Router](https://img.shields.io/badge/React_Router-SPA_Routing-CA4245?logo=reactrouter)
![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-orange?logo=amazonaws)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4)

---

# Overview

**ArtCorner ERP Frontend** is a modern, scalable, and high-performance monorepo-style frontend ecosystem that powers the user-facing interfaces of the ArtCorner ERP platform.

The repository contains two independent Single Page Applications (SPAs):

- **Admin Dashboard**
- **Customer Portal**

Both applications are built using:

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand state management
- React Router
- AWS Cognito authentication via AWS Amplify

The architecture emphasizes:

- Modular scalability
- Reusable UI patterns
- Secure authentication flows
- Responsive user experiences
- Optimized frontend performance

---

# Frontend Architecture

```text
Frontend Monorepo
│
├── Admin/
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/
│   │   │   ├── layouts/
│   │   │   ├── router/
│   │   │   └── utils/
│   │   │
│   │   ├── components/
│   │   └── features/
│   │
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
│
├── Customers/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── shared/
│   │       ├── layouts/
│   │       └── stores/
│   │
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

# Applications Overview

# Admin Dashboard

The **Admin Dashboard** is designed for internal business operations and enterprise management workflows.

## Core Capabilities

- Secure administrative authentication
- Business configuration management
- Inventory management
- Order tracking and processing
- Analytics and reporting dashboards
- Role-aware navigation
- Protected administrative routes

## Architecture Characteristics

- Dashboard-oriented layouts
- Sidebar-driven navigation
- Dynamic protected routing
- Centralized UI state management
- Modular feature organization

Example layout wrappers include:

```text
DashboardLayout
Sidebar
ProtectedRoute
```

---

# Customer Portal

The **Customer Portal** delivers a responsive and user-friendly shopping experience for end users.

## Core Features

- Product browsing and discovery
- Responsive shopping cart experiences
- Secure user authentication
- Checkout workflows
- Order history tracking
- Session-aware navigation
- Reactive UI state synchronization

The portal prioritizes:

- Fast rendering
- Clean UX flows
- Lightweight state updates

---

# Shared Technical Patterns

# State Management with Zustand

Both frontend applications use **Zustand** for lightweight and efficient global state management.

Typical responsibilities include:

- Sidebar toggles
- Modal visibility
- Layout responsiveness
- Authentication state
- Shopping cart synchronization
- Reactive UI updates

Example store usage:

```ts
useLayoutStore()
```

Benefits:

- Minimal boilerplate
- High runtime performance
- Easy scalability
- Simple global state orchestration

---

# Authentication & Security

Authentication is centrally managed using:

- AWS Cognito
- AWS Amplify SDK

Amplify configuration is abstracted through:

```text
amplify-config.ts
```

## Security Features

- JWT-based session handling
- Protected route enforcement
- Dynamic authentication guards
- Conditional routing logic
- Persistent session restoration

Example route protection flow:

```text
User Request
      ↓
ProtectedRoute
      ↓
Session Validation
      ↓
Authorized Layout Access
```

---

# Routing Architecture

Routing is implemented using **React Router** with composable layout wrappers.

Typical patterns include:

- Nested routing
- Layout-specific rendering
- Authentication guards
- Role-based access separation

Example architecture:

```text
Router
 ├── Public Routes
 ├── Protected Routes
 ├── Dashboard Layout
 └── Customer Layout
```

---

# Environment Configuration

The frontend ecosystem is configured through Vite environment variables.

## Required Environment Variables

```env
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=
VITE_API_BASE_URL=
```

These variables provide:

- Authentication configuration
- API endpoint resolution
- Environment separation
- Deployment flexibility

---

# UI & Styling System

The frontend styling architecture uses:

- Tailwind CSS
- Utility-first responsive design
- Shared layout primitives
- Reusable component patterns

Benefits include:

- Rapid UI development
- Consistent design system
- Responsive layouts
- Maintainable styling workflows

---

# API Communication

Frontend services communicate with backend APIs using:

- Axios
- Centralized API utilities
- Environment-aware base URLs

Typical capabilities:

- Authenticated requests
- Token forwarding
- Error interception
- API abstraction layers

---

# Performance Considerations

The frontend architecture is optimized for:

- Fast Vite builds
- Lazy-loaded routes
- Efficient state updates
- Responsive rendering
- Minimal bundle overhead

---

# Scalability Design

The project structure supports:

- Feature modularization
- Independent application scaling
- Shared architecture patterns
- Reusable infrastructure
- Future application expansion

---

# 🚀 Future Roadmap

## Employee Application

A third dedicated frontend module is planned as part of the ArtCorner ERP ecosystem.

### Planned Features

- Real-time work order management
- Workshop artisan task tracking
- Real-time status synchronization

This module will be specifically optimized for:

- Workshop employees
- Operational staff workflows

---

# Technology Summary

| Technology | Purpose |
|---|---|
| React | UI Framework |
| TypeScript | Type-safe frontend development |
| Vite | Fast build tooling |
| Tailwind CSS | Styling system |
| Zustand | Global state management |
| React Router | SPA routing |
| AWS Amplify | Cognito integration |
| Axios | API communication |

---

# ArtCorner ERP

Enterprise-grade frontend architecture built with modern React ecosystems, scalable cloud integrations, and high-performance SPA design principles.
