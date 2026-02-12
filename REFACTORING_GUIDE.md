# Refactoring Guide: Applying CODING_STANDARDS.md

**Date:** 11 February 2026  
**Purpose:** Step-by-step guide to refactor existing codebase to follow CODING_STANDARDS.md  
**Target:** All files in `apps/web`, `apps/api`, and `packages/*`

---

## 🎯 Overview

This guide provides a systematic approach to refactor the existing codebase to comply with CODING_STANDARDS.md. Follow the phases in order for best results.

---

## 📋 Pre-Refactoring Checklist

Before starting, ensure:

- [ ] All changes are committed to git
- [ ] Create a new branch: `git checkout -b refactor/coding-standards`
- [ ] Run existing tests to establish baseline
- [ ] Backup database if needed
- [ ] Review CODING_STANDARDS.md thoroughly

---

## 🔄 Refactoring Phases

### Phase 1: Replace Magic Values with Constants (Priority: 🔴 Critical)

**Estimated Time:** 2-3 hours  
**Impact:** High - Improves maintainability

#### 1.1 Order Status Values

**Files to Update:**

- `apps/api/src/controllers/*`
- `apps/api/src/services/*`
- `apps/web/src/components/**/*`
- `packages/database/models/*`

**Before:**

```typescript
// ❌ Bad - Magic strings
if (order.status === "pending_payment") {
  // ...
}

order.status = "paid";
```

**After:**

```typescript
// ✅ Good - Use constants
import { ORDER_STATUS } from "@repo/shared/constants";

if (order.status === ORDER_STATUS.PENDING_PAYMENT) {
  // ...
}

order.status = ORDER_STATUS.PAID;
```

**Search & Replace Commands:**

```bash
# Find all magic strings for order status
grep -r "'pending_payment'" apps/
grep -r "'paid'" apps/
grep -r "'processing'" apps/
grep -r "'shipped'" apps/
grep -r "'delivered'" apps/
grep -r "'cancelled'" apps/
```

**Action Items:**

- [x] Find all occurrences of order status strings (Backend)
- [x] Replace with `ORDER_STATUS` constants (Backend)
- [x] Add import: `import { ORDER_STATUS } from '@repo/shared/constants';`
- [x] Test affected functionality (Frontend pending)

---

#### 1.2 Payment Status Values

**Files to Update:**

- Payment controllers
- Payment services
- Doku integration files

**Before:**

```typescript
// ❌ Bad
if (payment.status === "pending") {
}
```

**After:**

```typescript
// ✅ Good
import { PAYMENT_STATUS } from "@repo/shared/constants";

if (payment.status === PAYMENT_STATUS.PENDING) {
}
```

**Action Items:**

- [x] Replace payment status strings (Backend)
- [x] Update Doku integration
- [x] Update payment webhooks

---

#### 1.3 Pagination Values

**Files to Update:**

- All API controllers with pagination
- Frontend list components

**Before:**

```typescript
// ❌ Bad - Magic numbers
const page = req.query.page || 1;
const limit = req.query.limit || 20;
if (limit > 100) limit = 100;
```

**After:**

```typescript
// ✅ Good - Use constants
import { PAGINATION } from "@repo/shared/constants";

const page = req.query.page || PAGINATION.DEFAULT_PAGE;
const limit = Math.min(
  req.query.limit || PAGINATION.DEFAULT_LIMIT,
  PAGINATION.MAX_LIMIT,
);
```

**Action Items:**

- [x] Replace pagination magic numbers (Backend)
- [x] Update all list endpoints
- [x] Update frontend pagination components

---

#### 1.4 HTTP Status Codes

**Files to Update:**

- All API controllers
- Error handlers
- Middleware

**Before:**

```typescript
// ❌ Bad - Magic numbers
res.status(200).json({ success: true });
res.status(404).json({ error: "Not found" });
res.status(500).json({ error: "Server error" });
```

**After:**

```typescript
// ✅ Good - Use constants
import { HTTP_STATUS } from "@repo/shared/constants";

res.status(HTTP_STATUS.OK).json({ success: true });
res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Not found" });
res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Server error" });
```

**Action Items:**

- [x] Replace all HTTP status code numbers
- [x] Update error handler middleware
- [x] Update all controllers

---

### Phase 2: Implement Custom Error Classes (Priority: 🔴 Critical)

**Estimated Time:** 3-4 hours  
**Impact:** High - Better error handling

#### 2.1 Update Error Throwing

**Files to Update:**

- All services in `apps/api/src/services/*`
- All controllers in `apps/api/src/controllers/*`

**Before:**

```typescript
// ❌ Bad - Generic errors
throw new Error("Product not found");
throw new Error("Invalid email");
throw new Error("Unauthorized");
```

**After:**

```typescript
// ✅ Good - Custom error classes
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} from "@repo/shared/errors";

throw new NotFoundError("Product");
throw new ValidationError("Invalid email");
throw new UnauthorizedError();
```

**Action Items:**

- [x] Identify all `throw new Error()` statements (in refactored files)
- [x] Replace with appropriate custom error classes
- [x] Add imports for error classes

---

#### 2.2 Create Error Handler Middleware

**File to Create:** `apps/api/src/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "@repo/shared/errors";
import { HTTP_STATUS } from "@repo/shared/constants";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Log error
  console.error("Error:", err);

  // Handle custom errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
  }

  // Handle unknown errors
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Internal server error",
  });
}
```

**Action Items:**

- [x] Create errorHandler middleware
- [x] Add to Express app: `app.use(errorHandler);`
- [x] Test error responses

---

### Phase 3: Use Utility Functions (Priority: 🟡 High)

**Estimated Time:** 2-3 hours  
**Impact:** Medium - Code reusability

#### 3.1 Currency Formatting

**Files to Update:**

- Frontend components displaying prices
- API responses with prices

**Before:**

```typescript
// ❌ Bad - Duplicate logic
const price = `Rp ${amount.toLocaleString("id-ID")}`;
const formatted = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
}).format(amount);
```

**After:**

```typescript
// ✅ Good - Use utility
import { formatCurrency } from "@repo/shared/utils";

const price = formatCurrency(amount); // 'Rp 150.000'
```

**Action Items:**

- [x] Find all currency formatting code
- [x] Replace with `formatCurrency()` (Done in Checkout, PaymentSelector, Admin ProductForm)
- [x] Test display in UI

---

#### 3.2 Slug Generation

**Files to Update:**

- Product creation/update services
- Category creation/update services

**Before:**

```typescript
// ❌ Bad - Duplicate logic
const slug = name
  .toLowerCase()
  .replace(/\s+/g, "-")
  .replace(/[^\w-]+/g, "");
```

**After:**

```typescript
// ✅ Good - Use utility
import { slugify } from "@repo/shared/utils";

const slug = slugify(name);
```

**Action Items:**

- [x] Find all slug generation code
- [x] Replace with `slugify()`
- [x] Test slug generation

---

#### 3.3 Date Formatting

**Files to Update:**

- Frontend components displaying dates
- API responses with dates

**Before:**

```typescript
// ❌ Bad - Inconsistent formatting
const date = new Date().toLocaleDateString("id-ID");
const formatted = `${day}/${month}/${year}`;
```

**After:**

```typescript
// ✅ Good - Use utility
import {
  formatDate,
  formatDateShort,
  getRelativeTime,
} from "@repo/shared/utils";

const date = formatDate(new Date()); // '10 Februari 2026'
const short = formatDateShort(new Date()); // '10/02/2026'
const relative = getRelativeTime(orderDate); // '2 jam yang lalu'
```

**Action Items:**

- [x] Find all date formatting code
- [x] Replace with date utilities (Done in ProductService for `is_new`)
- [ ] Test date display in UI

---

#### 3.4 Phone Number Formatting

**Files to Update:**

- User registration/update
- Address forms
- JNT Express integration

**Before:**

```typescript
// ❌ Bad - Inconsistent formatting
let phone = phoneInput.replace(/\D/g, "");
if (phone.startsWith("0")) {
  phone = "62" + phone.slice(1);
}
```

**After:**

```typescript
// ✅ Good - Use utility
import { formatPhone, isValidPhone } from "@repo/shared/utils";

if (!isValidPhone(phoneInput)) {
  throw new ValidationError("Invalid phone number");
}

const phone = formatPhone(phoneInput); // '+628123456789'
```

**Action Items:**

- [ ] Find all phone formatting code
- [ ] Replace with `formatPhone()`
- [ ] Add validation with `isValidPhone()`

---

### Phase 4: Implement Layered Architecture (Priority: 🔴 Critical)

**Estimated Time:** 4-6 hours  
**Impact:** Very High - Architecture improvement

#### 4.1 Separate Business Logic from Controllers

**Current Problem:**

```typescript
// ❌ Bad - Business logic in controller
export async function createOrder(req: Request, res: Response) {
  const { userId, items } = req.body;

  // Business logic here (BAD!)
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    userId,
    total,
    status: "pending_payment",
  });

  res.json({ success: true, data: order });
}
```

**Solution:**

**Step 1:** Create Service

```typescript
// apps/api/src/services/orderService.ts
import { Order } from "@repo/database/models";
import { ORDER_STATUS } from "@repo/shared/constants";
import { NotFoundError } from "@repo/shared/errors";

export async function createOrder(data: CreateOrderDTO) {
  // Business logic here (GOOD!)
  const total = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    userId: data.userId,
    total,
    status: ORDER_STATUS.PENDING_PAYMENT,
  });

  return order;
}

export async function getOrderById(orderId: number) {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new NotFoundError("Order");
  }

  return order;
}
```

**Step 2:** Update Controller

```typescript
// apps/api/src/controllers/orderController.ts
import { Request, Response, NextFunction } from "express";
import * as orderService from "@/services/orderService";
import { HTTP_STATUS } from "@repo/shared/constants";

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
```

**Action Items:**

- [x] Identify controllers with business logic
- [x] Extract business logic to services (Completed for Order, Payment, Shipping)
- [x] Update controllers to call services
- [x] Add proper error handling with try-catch

---

#### 4.2 Create Service Layer for Each Domain

**Domains to Create:**
**Domains to Create:**

- [x] `productService.ts` - Product operations (Refactored with utils)
- [x] `orderService.ts` - Order operations (Refactored with constants/pagination)
- [x] `userService.ts` - User operations
- [x] `cartService.ts` - Cart operations
- [x] `voucherService.ts` - Voucher operations
- [x] `addressService.ts` - Address operations
- [x] `paymentService.ts` - Payment operations (Refactored with webhook logic)
- [x] `shippingService.ts` - Shipping operations (Refactored)
- [x] `searchService.ts` - Search operations (Refactored with pagination/logging)

**Template:**

```typescript
// apps/api/src/services/[domain]Service.ts
import { Model } from "@repo/database/models";
import { NotFoundError, ValidationError } from "@repo/shared/errors";
import { PAGINATION } from "@repo/shared/constants";

export async function getAll(query: ListQuery) {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
    query;

  const offset = (page - 1) * limit;

  const items = await Model.findAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  const total = await Model.count();

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getById(id: number) {
  const item = await Model.findByPk(id);

  if (!item) {
    throw new NotFoundError("Resource");
  }

  return item;
}

export async function create(data: CreateDTO) {
  // Validation
  // Business logic

  const item = await Model.create(data);
  return item;
}

export async function update(id: number, data: UpdateDTO) {
  const item = await getById(id);

  await item.update(data);
  return item;
}

export async function remove(id: number) {
  const item = await getById(id);

  await item.destroy();
  return { success: true };
}
```

---

### Phase 5: Add Type Safety (Priority: 🟡 High)

**Estimated Time:** 3-4 hours  
**Impact:** High - Type safety

#### 5.1 Remove `any` Types

**Search for `any`:**

```bash
grep -r ": any" apps/
grep -r "as any" apps/
```

**Before:**

```typescript
// ❌ Bad - Using any
function processData(data: any) {
  return data.map((item: any) => item.value);
}
```

**After:**

```typescript
// ✅ Good - Explicit types
interface DataItem {
  value: number;
  label: string;
}

function processData(data: DataItem[]): number[] {
  return data.map((item) => item.value);
}
```

**Action Items:**

- [ ] Find all `any` types
- [ ] Create proper interfaces/types
- [ ] Replace `any` with explicit types

---

#### 5.2 Add Return Types to Functions

**Before:**

```typescript
// ❌ Bad - No return type
async function getProducts(page: number) {
  const products = await Product.findAll();
  return products;
}
```

**After:**

```typescript
// ✅ Good - Explicit return type
interface ProductListResult {
  products: Product[];
  pagination: PaginationMeta;
}

async function getProducts(page: number): Promise<ProductListResult> {
  const products = await Product.findAll();
  const total = await Product.count();

  return {
    products,
    pagination: {
      page,
      total,
      totalPages: Math.ceil(total / 20),
    },
  };
}
```

**Action Items:**

- [ ] Add return types to all functions
- [ ] Create interfaces for complex return types
- [ ] Ensure TypeScript strict mode compliance

---

### Phase 6: Frontend Refactoring (Priority: 🟡 High)

**Estimated Time:** 4-5 hours  
**Impact:** Medium - Code organization

#### 6.1 Separate Client/Server Components

**Before:**

```typescript
// ❌ Bad - Mixed concerns
export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(/* ... */);
  }, []);

  return <div>{/* ... */}</div>;
}
```

**After:**

**Server Component (page.tsx):**

```typescript
// ✅ Good - Server component for data fetching
export default async function ProductPage() {
  const response = await fetch(`${process.env.API_URL}/products`, {
    cache: 'no-store',
  });
  const data = await response.json();

  return <ProductGrid products={data.products} />;
}
```

**Client Component:**

```typescript
// ✅ Good - Client component for interactivity
'use client';

import { useState } from 'react';

export function ProductGrid({ products }) {
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <FilterButtons onFilterChange={setFilter} />
      <ProductList products={products} filter={filter} />
    </div>
  );
}
```

**Action Items:**

- [x] Identify pages that can be server components (Done for Product Detail, Shop Page)
- [x] Move data fetching to server components
- [x] Keep interactivity in client components
- [x] Add 'use client' directive where needed

---

#### 6.2 Use Constants in Frontend

**Before:**

```typescript
// ❌ Bad - Magic strings in frontend
if (order.status === 'pending_payment') {
  return <PendingBadge />;
}
```

**After:**

```typescript
// ✅ Good - Use constants
import { ORDER_STATUS } from '@repo/shared/constants';

if (order.status === ORDER_STATUS.PENDING_PAYMENT) {
  return <PendingBadge />;
}
```

**Action Items:**

- [x] Replace magic strings in components (Done for Status, Roles, etc.)
- [x] Use constants from `@repo/shared`
- [x] Update status badges/displays

---

#### 6.3 Use Utility Functions in Frontend

**Before:**

```typescript
// ❌ Bad - Duplicate formatting logic
<p>Rp {price.toLocaleString('id-ID')}</p>
<p>{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
```

**After:**

```typescript
// ✅ Good - Use utilities
import { formatCurrency, formatDate } from '@repo/shared/utils';

<p>{formatCurrency(price)}</p>
<p>{formatDate(order.createdAt)}</p>
```

**Action Items:**

- [x] Replace formatting logic with utilities (Done in Product, Cart, Checkout, Profile)
- [x] Use `formatCurrency()` for prices
- [x] Use `formatDate()` for dates
- [x] Use `getRelativeTime()` for timestamps

---

### Phase 7: Database Models (Priority: 🟡 High)

**Estimated Time:** 2-3 hours  
**Impact:** Medium - Data consistency

#### 7.1 Use Constants in Models

**Before:**

```typescript
// ❌ Bad - Magic strings in model
status: {
  type: DataTypes.ENUM('pending_payment', 'paid', 'processing'),
  defaultValue: 'pending_payment',
}
```

**After:**

```typescript
// ✅ Good - Use constants
import { ORDER_STATUS } from '@repo/shared/constants';

status: {
  type: DataTypes.ENUM(
    ORDER_STATUS.PENDING_PAYMENT,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED
  ),
  defaultValue: ORDER_STATUS.PENDING_PAYMENT,
}
```

**Action Items:**

- [ ] Update Order model
- [ ] Update Payment model
- [ ] Update all models with status fields
- [ ] Run migrations if needed

---

## 📊 Progress Tracking

### Phase 1: Replace Magic Values

- [x] Order status values
- [x] Payment status values
- [x] Pagination values
- [x] HTTP status codes
- [x] Other magic numbers/strings

### Phase 2: Custom Error Classes

- [x] Update error throwing
- [x] Create error handler middleware
- [x] Test error responses

### Phase 3: Utility Functions

- [x] Currency formatting
- [x] Slug generation
- [x] Date formatting
- [x] Phone formatting
- [x] Pagination calculation
- [x] Other utilities

### Phase 4: Layered Architecture

- [x] Extract business logic to services
- [x] Update controllers
- [x] Create service layer for each domain

### Phase 5: Type Safety

- [x] 5.1 Removing `any` types (Major Services Completed: Order, Cart, Product, Auth, Review, Category, Wishlist, Search, Analytics, Attribute, CMS, Dashboard, FlashSale, Stock, System, Voucher)
- [x] 5.2 Adding return types (Major Services Completed)
- [x] 5.3 Creating interfaces/types (Major Services Completed)

### Phase 6: Frontend Refactoring (Almost Complete)

- [x] Separate client/server components in product-related features
- [x] Use constants in `ProductCard`, `ProductFilters`, `Header`, `LoginForm`
- [x] Use utility functions across all major components
- [x] Defined and integrated `adminProductService` and `adminCategoryService`
- [x] Refactored `ProductForm` and `CategoryForm` for better error handling and API usage
- [x] Unified `Cart` and `CartItem` types and refactored Cart/Checkout features

### Phase 7: Database Models

- [ ] Use constants in models
- [ ] Update migrations

---

## 🧪 Testing After Each Phase

After completing each phase:

1. **Run TypeScript Check:**

   ```bash
   npm run type-check
   ```

2. **Run Linter:**

   ```bash
   npm run lint
   ```

3. **Run Tests:**

   ```bash
   npm run test
   ```

4. **Manual Testing:**
   - Test affected features
   - Check UI for regressions
   - Verify API responses

5. **Commit Changes:**
   ```bash
   git add .
   git commit -m "refactor(phase-X): [description]"
   ```

---

## 🎯 Quick Wins (Start Here)

If you want quick improvements, start with these:

1. **Replace HTTP Status Codes** (30 min)
   - High impact, easy to do
   - Search & replace in all controllers

2. **Use formatCurrency()** (30 min)
   - Visible improvement in UI
   - Easy to implement

3. **Replace Order Status Strings** (1 hour)
   - Critical for consistency
   - Moderate effort

4. **Add Error Handler Middleware** (1 hour)
   - Immediate improvement in error handling
   - One-time setup

---

## 📝 Code Review Checklist

Before merging refactored code:

- [ ] No magic strings or numbers
- [ ] All errors use custom error classes
- [ ] Business logic in services, not controllers
- [ ] No `any` types
- [ ] All functions have return types
- [ ] Constants imported from `@repo/shared`
- [ ] Utilities used instead of duplicate code
- [ ] TypeScript strict mode passes
- [ ] All tests pass
- [ ] No console errors
- [ ] UI works as expected

---

## 🚨 Common Pitfalls

### 1. Breaking Changes

- Test thoroughly after each phase
- Don't refactor too much at once
- Keep commits small and focused

### 2. Import Errors

- Use path aliases: `@/` for local, `@repo/` for packages
- Check tsconfig.json paths
- Restart TypeScript server if needed

### 3. Type Errors

- Don't use `as any` to bypass errors
- Create proper interfaces instead
- Use type narrowing when needed

### 4. Over-Engineering

- Follow YAGNI principle
- Don't create abstractions too early
- Keep it simple

---

## 📚 Resources

- **CODING_STANDARDS.md** - Full standards document
- **CODING_STANDARDS_IMPLEMENTATION.md** - Implementation summary
- **TypeScript Handbook** - https://www.typescriptlang.org/docs/
- **Express Best Practices** - https://expressjs.com/en/advanced/best-practice-performance.html

---

## 🎊 Completion

When all phases are complete:

1. **Final Review:**
   - Run all tests
   - Check TypeScript compilation
   - Review code quality

2. **Documentation:**
   - Update README if needed
   - Document any breaking changes
   - Update API documentation

3. **Merge:**

   ```bash
   git checkout main
   git merge refactor/coding-standards
   git push origin main
   ```

4. **Celebrate!** 🎉
   - Your codebase now follows professional standards
   - Easier to maintain and scale
   - Better developer experience

---

**Good luck with the refactoring!** 🚀

If you have questions, refer to CODING_STANDARDS.md or the implementation examples in `packages/shared/src/`.
