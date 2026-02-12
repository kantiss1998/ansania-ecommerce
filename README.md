# Ansania E-Commerce Platform

> Modern e-commerce platform with seamless Odoo ERP integration, built with Next.js 15, Express.js, and MariaDB in a Turborepo monorepo.

[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-Latest-green)](https://expressjs.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-Latest-blue)](https://mariadb.org/)

---

## 🚀 Features

- **Odoo Integration**: Full sync with Odoo ERP for products, inventory, customers, and orders
- **Multi-Address Management**: Users can save multiple shipping addresses
- **Product Variants**: Support for multi-dimensional variants (Color × Finishing × Size)
- **Smart Cart**: Session-based cart for guests, persistent cart for logged-in users
- **Payment Gateway**: Doku integration (Virtual Account, Credit Card, E-Wallet, QRIS)
- **Shipping**: JNT Express API integration with real-time shipping cost calculation
- **Voucher System**: Percentage discount, fixed amount, and free shipping vouchers
- **Product Reviews**: User reviews with image uploads and moderation
- **CMS**: Flexible content management for banners, pages, and settings
- **Stock Management**: Real-time stock sync from Odoo with reservation system

---

## 📂 Project Structure

```
ansania-ecommerce/
├── apps/
│   ├── web/              # Next.js Frontend (Port 3000)
│   └── api/              # Express.js Backend (Port 5000)
├── packages/
│   ├── database/         # Sequelize Models & Migrations
│   ├── shared/           # Shared Types, Schemas, Utils
│   ├── ui/               # Shared UI Components
│   └── config/           # ESLint, TypeScript Configs
├── PRD.md                # Product Requirements Document
├── DatabaseSchema.md     # Database Schema Documentation
├── CODING_STANDARDS.md   # Coding Standards & Best Practices
├── API_SPECIFICATION.md  # API Endpoints Documentation
└── DEVELOPMENT_GUIDE.md  # Development Setup Guide
```

---

## 🛠️ Tech Stack

| Layer          | Technology                       | Version            |
| -------------- | -------------------------------- | ------------------ |
| **Frontend**   | Next.js (TypeScript, App Router) | 15+                |
| **Backend**    | Express.js (TypeScript)          | Latest             |
| **Database**   | MariaDB                          | Latest             |
| **Monorepo**   | Turborepo                        | Latest             |
| **ORM**        | Sequelize                        | Latest             |
| **Validation** | Zod                              | Latest             |
| **Payment**    | Doku                             | Latest             |
| **Shipping**   | JNT Express API                  | Latest             |
| **ERP**        | Odoo.com                         | REST API / XML-RPC |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** 8+
- **MariaDB** 10.6+
- **Git**

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd ansania-ecommerce
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup environment variables

```bash
# Copy example files
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 4. Setup database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE ansania_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
npm run db:migrate

# (Optional) Seed data
npm run db:seed
```

### 5. Start development servers

```bash
# Start both apps (web + api)
npm run dev

# Or start individually:
npm run dev:web   # Frontend only (http://localhost:3000)
npm run dev:api   # Backend only (http://localhost:5000)
```

---

## 📦 Available Scripts

### Development

```bash
npm run dev          # Start all apps in development mode
npm run dev:web      # Start Next.js frontend only
npm run dev:api      # Start Express.js backend only
npm run build        # Build all apps for production
npm run start        # Start production servers
```

### Database

```bash
npm run db:migrate        # Run pending migrations
npm run db:migrate:undo   # Rollback last migration
npm run db:seed           # Run seeders
npm run db:reset          # Reset database (drop + migrate + seed)
```

### Code Quality

```bash
npm run lint         # Run ESLint on all packages
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
```

### Testing

```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

---

## 🔧 Configuration

### Environment Variables

Key environment variables you need to configure:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=ansania_ecommerce
DATABASE_USER=root
DATABASE_PASSWORD=your_password

# API
API_PORT=5000
JWT_SECRET=your_jwt_secret

# Odoo Integration
ODOO_URL=https://yourcompany.odoo.com
ODOO_DATABASE=yourdb
ODOO_USERNAME=api@yourcompany.com
ODOO_API_KEY=your_odoo_api_key

# Doku Payment Gateway
DOKU_CLIENT_ID=your_client_id
DOKU_SECRET_KEY=your_secret_key
DOKU_MERCHANT_ID=your_merchant_id

# JNT Express
JNT_API_KEY=your_jnt_api_key
JNT_CUSTOMER_CODE=your_customer_code

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for detailed environment setup.

---

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Complete product requirements and feature specifications
- **[DatabaseSchema.md](./DatabaseSchema.md)** - Database schema documentation with SQL
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Coding standards and architectural guidelines
- **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - REST API endpoints documentation
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Step-by-step development setup

---

## 🏗️ Architecture Overview

### Frontend (Next.js 15+)

- **App Router** with Server Components by default
- **Client Components** only for interactivity
- **React Query** for server state management
- **Zustand** for global UI state (cart, auth)
- **Zod** + React Hook Form for form validation

### Backend (Express.js)

- **Layered Architecture**: Routes → Controllers → Services → Data Access
- **Middleware**: Authentication, Validation, Error Handling
- **Integrations**: Isolated modules for Odoo, Doku, JNT APIs
- **Type-safe**: Full TypeScript with strict mode

### Database (MariaDB)

- **Sequelize ORM** for model definitions
- **Migrations** for version control
- **Cached Data** from Odoo (products, stock, categories)
- **Local Data** (cart, wishlist, CMS, vouchers)

---

## 🔄 Data Flow

### Product Display Flow

```
Odoo → Sync Job (every 30 min) → MariaDB → API → Next.js SSR → User
```

### Order Creation Flow

```
User → Cart → Checkout → API → Doku Payment → Webhook → API → Odoo Sales Order
```

### Stock Management

```
Odoo Warehouse → Sync Job → MariaDB → Reserved in Cart → Deducted on Payment Success
```

---

## 🧪 Testing

We use Jest for unit and integration testing:

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test -- packages/shared

# Run with coverage
npm run test:coverage
```

---

## 🚢 Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) (coming soon).

Quick production build:

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

1. Follow [CODING_STANDARDS.md](./CODING_STANDARDS.md) strictly
2. Create feature branch from `develop`
3. Write tests for new features
4. Ensure `npm run lint` and `npm run typecheck` pass
5. Submit Pull Request with clear description

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Team

- **Product Owner**: [Name]
- **Tech Lead**: [Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]

---

## 🆘 Support

For issues and questions:

- Create an issue in the repository
- Contact: [support email]
- Documentation: See `/docs` folder

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Built with ❤️ for Ansania**
