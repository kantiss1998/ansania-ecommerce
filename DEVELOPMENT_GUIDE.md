# Development Guide

**Ansania E-Commerce Platform - Complete Setup Guide**

This guide will walk you through setting up your local development environment step-by-step.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)
8. [External API Setup](#external-api-setup)

---

## Prerequisites

### Required Software

Install the following before proceeding:

#### 1. Node.js (v18 or higher)

```bash
# Check if installed
node --version  # Should be 18.x or higher

# Download from: https://nodejs.org/
# Or use nvm:
nvm install 18
nvm use 18
```

#### 2. npm or pnpm

```bash
# npm comes with Node.js, check version
npm --version  # Should be 8.x or higher

# Or install pnpm (faster alternative)
npm install -g pnpm
pnpm --version
```

#### 3. MariaDB (v10.6 or higher)

```bash
# Check if installed
mysql --version

# Download from: https://mariadb.org/download/
# Or use package manager:

# Windows (using Chocolatey)
choco install mariadb

# macOS (using Homebrew)
brew install mariadb

# Ubuntu/Debian
sudo apt-get install mariadb-server
```

#### 4. Git

```bash
# Check if installed
git --version

# Download from: https://git-scm.com/
```

### Optional Tools

- **DB GUI:** DBeaver, MySQL Workbench, or HeidiSQL
- **API Client:** Postman or Insomnia
- **Code Editor:** VS Code (recommended)

---

## Initial Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd ansania-ecommerce

# Check out develop branch
git checkout develop
```

### 2. Install Dependencies

```bash
# Install all dependencies for monorepo
npm install
# or
pnpm install

# This will install dependencies for:
# - Root workspace
# - apps/web
# - apps/api
# - All packages/*
```

**Expected output:**

```
✓ Installed packages
✓ Built workspace dependencies
```

### 3. Verify Installation

```bash
# Check Turborepo
npx turbo --version

# List all available scripts
npm run
```

---

## Database Setup

### 1. Start MariaDB Service

```bash
# Windows
net start MariaDB

# macOS
brew services start mariadb

# Linux
sudo systemctl start mariadb
```

### 2. Create Database

```bash
# Login to MariaDB (default root password is empty)
mysql -u root -p

# Create database
CREATE DATABASE ansania_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional but recommended)
CREATE USER 'ansania_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ansania_ecommerce.* TO 'ansania_user'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### 3. Run Migrations

```bash
# Run all migrations
npm run db:migrate

# Expected output:
# == 20260101000000-create-users: migrating =======
# == 20260101000000-create-users: migrated (0.123s)
# ...
```

### 4. Seed Data (Optional)

```bash
# Seed test data for development
npm run db:seed

# This will create:
# - Sample users
# - Sample products
# - Sample categories
# - Sample vouchers
```

### 5. Verify Database

```bash
# Check tables
mysql -u ansania_user -p ansania_ecommerce -e "SHOW TABLES;"

# Output should include:
# users, products, categories, orders, etc.
```

---

## Environment Configuration

### 1. Copy Example File

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your settings:

```env
# =================================
# DATABASE CONFIGURATION
# =================================
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=ansania_ecommerce
DATABASE_USER=ansania_user
DATABASE_PASSWORD=your_secure_password

# =================================
# API CONFIGURATION
# =================================
API_PORT=5000
API_URL=http://localhost:5000
NODE_ENV=development

# JWT Secret (generate using: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# =================================
# FRONTEND CONFIGURATION
# =================================
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# =================================
# ODOO INTEGRATION
# =================================
ODOO_URL=https://yourcompany.odoo.com
ODOO_DATABASE=yourdb
ODOO_USERNAME=api@yourcompany.com
ODOO_API_KEY=your_odoo_api_key

# Sync intervals (in minutes)
ODOO_PRODUCT_SYNC_INTERVAL=30
ODOO_STOCK_SYNC_INTERVAL=30
ODOO_CATEGORY_SYNC_INTERVAL=60

# =================================
# DOKU PAYMENT GATEWAY
# =================================
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_MERCHANT_ID=your_merchant_id
DOKU_ENVIRONMENT=sandbox  # or 'production'
DOKU_API_URL=https://api-sandbox.doku.com

# Webhook URL (update in production)
DOKU_WEBHOOK_URL=http://localhost:5000/api/checkout/payment-webhook

# =================================
# JNT EXPRESS SHIPPING
# =================================
JNT_API_KEY=your_jnt_api_key
JNT_CUSTOMER_CODE=your_customer_code
JNT_API_URL=https://api-test.jet.co.id  # or production URL
JNT_BRANCH_CODE=CGK10000  # Your origin branch code

# =================================
# EMAIL CONFIGURATION (Optional)
# =================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_NAME=Ansania E-Commerce
SMTP_FROM_EMAIL=noreply@ansania.com

# =================================
# FILE UPLOAD (Optional)
# =================================
UPLOAD_MAX_SIZE=5242880  # 5MB in bytes
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp
STORAGE_TYPE=local  # or 's3', 'cloudinary'

# =================================
# REDIS (Optional - for caching)
# =================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# =================================
# LOGGING
# =================================
LOG_LEVEL=debug  # debug, info, warn, error
LOG_FILE_ENABLED=true
LOG_FILE_PATH=./logs
```

### 3. Generate JWT Secret

```bash
# Linux/macOS
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Copy output and paste to JWT_SECRET in .env
```

---

## Running the Application

### Development Mode (Both Apps)

```bash
# Start both frontend (3000) and backend (5000)
npm run dev

# Output:
# > web:dev: ready started server on 0.0.0.0:3000
# > api:dev: Server listening on port 5000
```

Visit:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/health

### Run Apps Individually

```bash
# Frontend only
npm run dev:web

# Backend only
npm run dev:api
```

### Production Build

```bash
# Build all apps
npm run build

# Start production servers
npm run start
```

---

## Development Workflow

### 1. Create New Feature

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Start development
npm run dev
```

### 2. Code Quality Checks

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

### 3. Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- path/to/test.spec.ts
```

### 4. Database Migrations

#### Create New Migration

```bash
# Generate migration file
npx sequelize-cli migration:generate --name create-new-table

# Edit file in packages/database/migrations/
# Then run:
npm run db:migrate
```

#### Rollback Migration

```bash
# Rollback last migration
npm run db:migrate:undo

# Rollback all migrations
npm run db:migrate:undo:all
```

#### Reset Database

```bash
# Drop all tables, re-migrate, and seed
npm run db:reset
```

### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional commit format
git commit -m "feat(api): add product sync from Odoo"

# Push to remote
git push origin feature/your-feature-name
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or tooling changes

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000 or 5000
# Linux/macOS
lsof -i :3000
lsof -i :5000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process by PID
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

### Database Connection Error

```bash
# Check MariaDB is running
# Linux
sudo systemctl status mariadb

# macOS
brew services list | grep mariadb

# Windows
sc query MariaDB

# Test connection
mysql -u ansania_user -p -h localhost ansania_ecommerce
```

**Common causes:**

- Wrong credentials in `.env`
- MariaDB service not running
- Database doesn't exist
- Firewall blocking port 3306

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install

# Clear Turbo cache
rm -rf .turbo
```

### TypeScript Errors

```bash
# Rebuild TypeScript packages
npm run build

# Check tsconfig.json extends paths are correct
# Ensure all packages have proper exports in package.json
```

### Hot Reload Not Working

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Restart development server
npm run dev:web
```

---

## External API Setup

### Odoo Integration

1. **Get API Credentials:**
   - Login to your Odoo instance
   - Go to Settings → Users → API Keys
   - Generate new API key
   - Copy credentials to `.env`

2. **Test Connection:**

   ```bash
   # From API directory
   cd apps/api
   npm run test:odoo
   ```

3. **Manual Sync:**
   ```bash
   # Sync products from Odoo
   curl -X POST http://localhost:5000/api/admin/sync/products
   ```

### Doku Payment Gateway

1. **Register Account:**
   - Visit https://doku.com
   - Register merchant account
   - Get sandbox credentials

2. **Configure Webhook:**
   - Login to Doku dashboard
   - Add webhook URL: `https://your-domain.com/api/checkout/payment-webhook`
   - Enable signature verification

3. **Test Payment:**
   ```bash
   # Use test VA numbers from Doku documentation
   # Sandbox test mode auto-confirms payments
   ```

### JNT Express Shipping

1. **Get API Access:**
   - Contact JNT Express sales
   - Request API credentials
   - Get branch code for your origin location

2. **Test API:**
   ```bash
   # Test shipping cost calculation
   curl -X POST http://localhost:5000/api/checkout/calculate-shipping \
     -H "Content-Type: application/json" \
     -d '{
       "shipping_address_id": 1,
       "courier": "jnt"
     }'
   ```

---

## IDE Setup (VS Code)

### Recommended Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense"
  ]
}
```

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/.turbo": true,
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  }
}
```

---

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:api"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:web"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Chrome DevTools (API)

```bash
# Start API with inspect flag
node --inspect apps/api/dist/server.js

# Open chrome://inspect in Chrome
# Click "inspect" on your Node process
```

---

## Performance Tips

1. **Use pnpm instead of npm** for faster installs
2. **Enable Turbo cache** (enabled by default)
3. **Use `--filter` for selective builds:**
   ```bash
   npx turbo run build --filter=web
   ```
4. **Parallelize tasks:**
   ```bash
   npx turbo run lint test --parallel
   ```

---

## Next Steps

Now that your environment is set up:

1. Read [CODING_STANDARDS.md](./CODING_STANDARDS.md) for coding guidelines
2. Check [API_SPECIFICATION.md](./API_SPECIFICATION.md) for API reference
3. Review [PRD.md](./PRD.md) for feature requirements
4. Start building! 🚀

---

## Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Create GitHub issue
- **Team Chat:** [Your team communication channel]
- **Code Review:** Tag `@tech-lead` in PRs

---

**Last Updated:** 2026-02-03  
**Maintained by:** DevOps Team
