# Coding Standards & Engineering Guidelines
**Ansania E-Commerce Platform with Odoo Integration**

This document defines the strict engineering standards, architectural patterns, and code quality requirements for the **ansania-ecommerce** monorepo. All AI-generated code and human contributions must adhere to these guidelines.

---

## 1. Core Principles

* **Clean Code:** Code must be self-documenting, intent-revealing, and formatted consistently.
* **DRY (Don't Repeat Yourself):** Logic duplicated more than twice must be abstracted into a shared utility or component.
* **SOLID:**
    * *SRP:* Modules/Classes/Functions have one reason to change.
    * *OCP:* Open for extension, closed for modification.
    * *LSP:* Subtypes must be substitutable for their base types.
    * *ISP:* Clients shouldn't depend on interfaces they don't use.
    * *DIP:* Depend on abstractions, not concretions.
* **KISS (Keep It Simple, Stupid):** Prefer simple, understandable solutions over complex, clever ones.
* **YAGNI (You Ain't Gonna Need It):** Implement only what is currently required. No speculative engineering.
* **Separation of Concerns:** Strict boundaries between UI, Business Logic, and Data Access.
* **Single Source of Truth:** Data configurations and types exist in exactly one place (typically `packages/shared` or `packages/database`).
* **Convention over Configuration:** Follow existing directory structures and naming patterns before creating new ones.
* **API-First Design:** Backend exposes well-documented RESTful APIs that frontend consumes.

---

## 2. Monorepo Architecture

### Tech Stack
```
Frontend:  Next.js 15+ (TypeScript, App Router)
Backend:   Express.js (TypeScript)
Database:  MariaDB
Monorepo:  Turborepo
Payment:   Doku
Shipping:  JNT Express API
ERP:       Odoo.com (REST API / XML-RPC)
```

### Structure
```
ansania-ecommerce/
├── apps/
│   ├── web/              # Next.js Frontend (Port 3000)
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/  # Feature-specific components
│   │   │   ├── lib/      # Frontend utilities
│   │   │   └── types/    # Frontend-specific types
│   │   └── public/       # Static assets
│   │
│   └── api/              # Express.js Backend (Port 5000)
│       ├── src/
│       │   ├── routes/   # API route definitions
│       │   ├── controllers/  # Request handlers
│       │   ├── services/     # Business logic
│       │   ├── middleware/   # Auth, validation, etc.
│       │   └── integrations/ # Odoo, Doku, JNT
│       └── server.ts
│
├── packages/
│   ├── database/         # MariaDB ORM & Migrations
│   │   ├── models/       # Sequelize models
│   │   ├── migrations/   # Database migrations
│   │   └── seeders/      # Test data
│   │
│   ├── shared/           # Shared code for both apps
│   │   ├── src/
│   │   │   ├── types/    # TypeScript interfaces
│   │   │   ├── schemas/  # Zod validation schemas
│   │   │   ├── constants/  # App-wide constants
│   │   │   └── utils/    # Pure utility functions
│   │   └── index.ts
│   │
│   ├── ui/               # Shared React components
│   │   ├── src/
│   │   │   ├── components/  # Atomic UI components
│   │   │   └── styles/      # Global CSS/themes
│   │   └── index.ts
│   │
│   └── config/           # Shared configurations
│       ├── eslint-config/
│       ├── typescript-config/
│       └── prettier-config/
│
├── PRD.md
├── DatabaseSchema.md
└── CODING_STANDARDS.md (this file)
```

### Boundaries & Rules
* **No Circular Dependencies:** A package must never import from a package that depends on it.
* **No Direct Cross-App Imports:** `apps/web` cannot import code from `apps/api`. Communication happens via HTTP/REST API only.
* **Dependency Inversion:** High-level policy (Use Cases) should not depend on low-level detail (Database Drivers).
* **Framework Agnostic:** Shared logic in `packages/shared` must not depend on React or Express internals.
* **Integration Layer Isolation:** All external API integrations (Odoo, Doku, JNT) must be isolated in `apps/api/src/integrations/`.

---

## 3. Code Quality Requirements

### Type Safety
* **Strict Mode:** `strict: true` is enforced in all `tsconfig.json` files.
* **No `any`:** Explicitly define types. Use `unknown` if types are truly dynamic, with proper type narrowing.
* **DTOs (Data Transfer Objects):** Use strict interfaces/types for data transfer between layers.
  ```typescript
  // ✅ Good - Explicit types
  interface CreateOrderDTO {
    userId: number;
    items: OrderItemDTO[];
    shippingAddressId: number;
  }

  // ❌ Bad - Using any
  function createOrder(data: any) { ... }
  ```

### Maintainability
* **No Magic Values:** Strings and numbers with special meaning must be defined as constants.
  ```typescript
  // ✅ Good
  const ORDER_STATUS = {
    PENDING_PAYMENT: 'pending_payment',
    PAID: 'paid',
    PROCESSING: 'processing',
  } as const;

  // ❌ Bad
  if (order.status === 'pending_payment') { ... }
  ```
* **Tree-shakeable:** Export individual functions/components rather than default exports for libraries.
* **Explicit Exports:** Use named exports (`export { Foo }`) over default exports for better IDE support.

### Readability
* **Naming Conventions:**
    * *Variables/Functions:* `camelCase` (e.g., `calculateShippingCost`, `isUserActive`)
    * *React Components:* `PascalCase` (e.g., `ProductCard`, `CheckoutForm`)
    * *Files:* `camelCase.ts` for logic, `PascalCase.tsx` for React components.
    * *Constants:* `SCREAMING_SNAKE_CASE` (e.g., `MAX_CART_ITEMS`, `API_BASE_URL`)
    * *Interfaces/Types:* `PascalCase` (e.g., `User`, `OrderItem`, `ApiResponse`)
* **Predictable Folder Structure:** Group by feature/domain where possible.
* **Function Length:** Keep functions under 50 lines. Extract complex logic into smaller functions.

---

## 4. Backend Architecture (`apps/api`)

### Layered Architecture

#### Layer 1: Routes (`src/routes`)
```typescript
// src/routes/products.ts
import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { productSchemas } from '@repo/shared/schemas';
import * as productController from '@/controllers/productController';

const router = Router();

router.get(
  '/products',
  validateRequest(productSchemas.listProducts),
  productController.listProducts
);

export default router;
```

**Responsibilities:**
- Define endpoint paths
- Apply middleware (auth, validation)
- Route to appropriate controller
- **NO business logic**

#### Layer 2: Controllers (`src/controllers`)
```typescript
// src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import * as productService from '@/services/productService';
import { ApiResponse } from '@repo/shared/types';

export async function listProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page, limit, category } = req.query;
    
    const result = await productService.getProducts({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      category: category as string,
    });

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
```

**Responsibilities:**
- Parse HTTP requests
- Call appropriate service methods
- Format HTTP responses
- Error handling (delegate to error middleware)
- **NO business logic**

#### Layer 3: Services (`src/services`)
```typescript
// src/services/productService.ts
import { Product } from '@repo/database/models';
import { ProductListQuery } from '@repo/shared/types';
import { syncProductsFromOdoo } from '@/integrations/odoo/productSync';

export async function getProducts(query: ProductListQuery) {
  const { page, limit, category } = query;
  
  // Business logic here
  const offset = (page - 1) * limit;
  
  const products = await Product.findAll({
    where: {
      is_visible: true,
      ...(category && { category }),
    },
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });

  const total = await Product.count({
    where: { is_visible: true, ...(category && { category }) },
  });

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function syncProductsWithOdoo() {
  // Orchestrate Odoo sync
  return await syncProductsFromOdoo();
}
```

**Responsibilities:**
- Contain ALL business logic
- Call data access layer (models/repositories)
- Orchestrate external API calls (Odoo, Doku, JNT)
- Throw domain-specific errors
- **NO HTTP concerns (req/res)**

#### Layer 4: Integrations (`src/integrations`)
```typescript
// src/integrations/odoo/client.ts
import axios from 'axios';
import { OdooConfig } from '@repo/shared/types';

export class OdooClient {
  private baseUrl: string;
  private db: string;
  private username: string;
  private apiKey: string;

  constructor(config: OdooConfig) {
    this.baseUrl = config.baseUrl;
    this.db = config.database;
    this.username = config.username;
    this.apiKey = config.apiKey;
  }

  async authenticate() {
    // Odoo XML-RPC authentication
  }

  async callMethod(model: string, method: string, params: any[]) {
    // Generic Odoo API call
  }
}

// src/integrations/odoo/productSync.ts
export async function syncProductsFromOdoo() {
  const odoo = new OdooClient(odooConfig);
  // Sync logic
}
```

**Responsibilities:**
- Isolated external API integrations
- Handle API-specific authentication
- Transform external data to internal models
- Retry logic, rate limiting

#### Layer 5: Data Access (`packages/database`)
```typescript
// packages/database/models/Product.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

export class Product extends Model {
  declare id: number;
  declare odoo_product_id: number;
  declare sku: string;
  declare name: string;
  declare slug: string;
  declare selling_price: number;
  declare is_visible: boolean;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  odoo_product_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  // ... other fields
}, {
  sequelize,
  tableName: 'products',
  timestamps: true,
});
```

**Responsibilities:**
- Define database models
- Database queries
- Data validation at DB level
- **NO business logic**

---

## 5. Frontend Architecture (`apps/web`)

### Next.js App Router Patterns

#### Server Components (Default)
```typescript
// app/products/page.tsx
import { ProductGrid } from '@/components/ProductGrid';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  // Fetch data on server
  const response = await fetch(
    `${process.env.API_URL}/products?page=${searchParams.page || 1}`,
    { cache: 'no-store' }
  );
  const data = await response.json();

  return (
    <div>
      <h1>Products</h1>
      <ProductGrid products={data.products} />
    </div>
  );
}
```

**Use Server Components for:**
- Data fetching
- SEO-critical content
- Heavy computations
- Direct database access (if needed)

#### Client Components
```typescript
// components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export function AddToCartButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  async function handleClick() {
    setLoading(true);
    await addItem(productId);
    setLoading(false);
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

**Use Client Components strictly for:**
- Event handlers (`onClick`, `onChange`)
- Hooks (`useState`, `useEffect`)
- Browser APIs
- Third-party libraries requiring browser context

### State Management Strategy
* **URL State:** For filters, pagination, search (use `searchParams`)
* **Server State:** Use React Query or SWR for API data caching
* **Global UI State:** Use Context or Zustand (auth, cart, theme)
* **Form State:** React Hook Form + Zod validation

### Component Organization
```
apps/web/src/components/
├── ui/              # Atomic, reusable components (Button, Input)
├── features/        # Feature-specific components
│   ├── auth/
│   ├── cart/
│   └── products/
└── layout/          # Layout components (Header, Footer)
```

---

## 6. Data Validation Strategy

### Shared Schemas (Zod)
```typescript
// packages/shared/src/schemas/product.ts
import { z } from 'zod';

export const productSchemas = {
  listProducts: z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    category: z.string().optional(),
  }),

  createProduct: z.object({
    name: z.string().min(1).max(255),
    sku: z.string().min(1),
    price: z.number().positive(),
    categoryId: z.number().int().positive(),
  }),
};

// Infer TypeScript types from schemas
export type ListProductsQuery = z.infer<typeof productSchemas.listProducts>;
export type CreateProductDTO = z.infer<typeof productSchemas.createProduct>;
```

### Backend Validation Middleware
```typescript
// apps/api/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      
      req.body = validated;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
}
```

### Frontend Validation
```typescript
// apps/web/src/components/CheckoutForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchemas } from '@repo/shared/schemas';

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchemas.createOrder),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

---

## 7. Error Handling

### Custom Error Classes
```typescript
// packages/shared/src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
```

### Backend Error Handler
```typescript
// apps/api/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared/errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
```

---

## 8. Environment Variables

### Structure
```
# .env.example
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=ansania_ecommerce
DATABASE_USER=root
DATABASE_PASSWORD=secret

# API
API_PORT=5000
API_URL=http://localhost:5000
JWT_SECRET=your-secret-key

# Odoo
ODOO_URL=https://yourcompany.odoo.com
ODOO_DATABASE=yourdb
ODOO_USERNAME=api@yourcompany.com
ODOO_API_KEY=your-api-key

# Doku
DOKU_CLIENT_ID=your-client-id
DOKU_SECRET_KEY=your-secret
DOKU_MERCHANT_ID=your-merchant

# JNT Express
JNT_API_KEY=your-api-key
JNT_CUSTOMER_CODE=your-code

# Frontend (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Type-safe Config
```typescript
// packages/shared/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  API_PORT: z.coerce.number(),
  ODOO_URL: z.string().url(),
  DOKU_CLIENT_ID: z.string(),
  JNT_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

## 9. Testing Standards

### Unit Tests
```typescript
// apps/api/src/services/__tests__/productService.test.ts
import { getProducts } from '../productService';
import { Product } from '@repo/database/models';

jest.mock('@repo/database/models');

describe('productService', () => {
  describe('getProducts', () => {
    it('should return products with pagination', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];

      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);
      (Product.count as jest.Mock).mockResolvedValue(10);

      const result = await getProducts({ page: 1, limit: 20 });

      expect(result.products).toEqual(mockProducts);
      expect(result.pagination.total).toBe(10);
    });
  });
});
```

### Integration Tests
```typescript
// apps/api/src/routes/__tests__/products.integration.test.ts
import request from 'supertest';
import app from '../../app';

describe('GET /api/products', () => {
  it('should return 200 and products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.products).toBeInstanceOf(Array);
  });
});
```

---

## 10. Output Rules for AI Code Generation

### Pre-Generation Checklist
1. ✅ **Check existing code:** Look for similar functionality in `packages/shared`, `packages/database`
2. ✅ **Use existing types:** Reuse TypeScript interfaces and Zod schemas if they exist
3. ✅ **Follow layer boundaries:** Don't put business logic in controllers or UI logic in services
4. ✅ **Use path aliases:** Import from `@/` or `@repo/` instead of relative paths

### Code Quality Checklist
1. ✅ **Type Safety:** No `any`, explicit return types for functions
2. ✅ **Error Handling:** Use custom error classes, proper try-catch
3. ✅ **Validation:** Use Zod schemas for all external inputs
4. ✅ **Constants:** No magic strings/numbers
5. ✅ **Comments:** Only for complex business logic, not obvious code
6. ✅ **Naming:** Follow conventions (camelCase, PascalCase, SCREAMING_SNAKE_CASE)

### Anti-Patterns to Avoid
❌ **Don't:**
- Put business logic in controllers or React components
- Use default exports in shared packages
- Access `req.body` directly without validation
- Hardcode URLs, API keys, or configuration values
- Create circular dependencies between packages
- Use `any` type instead of proper typing

✅ **Do:**
- Keep functions small and focused (SRP)
- Extract reusable logic to `packages/shared`
- Use dependency injection for testability
- Write self-documenting code with clear names
- Follow established patterns in the codebase

---

## 11. Git Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples
```
feat(api): add Doku payment integration

- Implement payment webhook handler
- Add transaction status checking
- Update order status on payment success

Closes #123
```

```
fix(web): correct shipping cost calculation

The JNT Express API was returning incorrect rates due to 
missing weight parameter. Added proper weight calculation 
based on cart items.

Fixes #456
```

---

## 12. Code Review Checklist

Before submitting code for review:

- [ ] Code follows layer architecture (routes → controllers → services → data)
- [ ] All external inputs are validated with Zod schemas
- [ ] No business logic in controllers or React components
- [ ] TypeScript strict mode passes with no `any` types
- [ ] Error handling uses custom error classes
- [ ] Constants are defined in `packages/shared/constants`
- [ ] Path aliases are used instead of relative imports
- [ ] Tests are written for new functionality
- [ ] Environment variables are documented in `.env.example`
- [ ] ESLint and Prettier checks pass
- [ ] Commit messages follow conventions

---

## Summary

This document serves as the **source of truth** for all code written in the ansania-ecommerce project. When in doubt:

1. **Prioritize simplicity** over cleverness
2. **Follow established patterns** before creating new ones
3. **Maintain strict layer boundaries** between UI, logic, and data
4. **Type everything** with TypeScript strict mode
5. **Validate all inputs** with Zod schemas
6. **Keep packages pure** and framework-agnostic

**Remember:** Good code is code that the next developer (including your future self) can understand and modify with confidence.
