# Database Package

Sequelize ORM models dan database management untuk Ansania E-Commerce.

## ✅ Features

- **39 Database Tables** dengan complete schema
- **39 Sequelize Models** dengan full TypeScript types
- **39 Migrations** untuk database versioning
- **6 Seeders** untuk demo/development data
- Complete associations & relationships
- Odoo integration ready
- Full TypeScript support

## 📋 Prerequisites

Before running migrations, kamu perlu:

1. **MariaDB atau MySQL** installed (ver 10.5+ or MySQL 8.0+)
2. **Database created** dengan nama `ansania_ecommerce`

### Quick Database Setup

**MariaDB/MySQL:**
```sql
CREATE DATABASE ansania_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Atau via command line:**
```bash
mysql -u root -p -e "CREATE DATABASE ansania_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 🚀 Getting Started

### 1. Configure Database

Copy `.env.example` ke `.env` di root project dan sesuaikan:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=ansania_ecommerce
DATABASE_USER=root
DATABASE_PASSWORD=your_password_here
```

### 2. Build TypeScript

```bash
npm run build --workspace=@repo/database
```

### 3. Run Migrations

Create all 39 tables:
```bash
npm run db:migrate --workspace=@repo/database
```

### 4. Run Seeders (Optional)

Populate database dengan demo data:
```bash
npm run db:seed --workspace=@repo/database
```

## 📚 Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Watch mode untuk development |
| `npm run db:migrate` | Run all pending migrations |
| `npm run db:migrate:undo` | Undo last migration |
| `npm run db:migrate:undo:all` | Undo all migrations |
| `npm run db:seed` | Run all seeders |
| `npm run db:seed:undo` | Undo all seeders |
| `npm run db:reset` | Reset database (undo all, migrate, seed) |

## 🗂️ Database Tables (39)

### Core Tables (17)
- `users` - User accounts
- `addresses` - User shipping addresses
- `categories` - Product categories (hierarchical)
- `products` - Product catalog
- `product_variants` - Product variations (color, size, etc.)
- `product_images` - Product photos
- `carts` - Shopping carts
- `cart_items` - Cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment transactions (Doku)
- `shipping` - Shipping info (JNT Express)
- `vouchers` - Discount vouchers
- `voucher_usage` - Voucher redemption tracking
- `reviews` - Product reviews
- `review_images` - Review photos
- `wishlist` - User wishlists

### Authentication (2)
- `user_sessions` - JWT/session tokens
- `password_reset_tokens` - Password reset tokens

### Stock & Inventory (1)
- `product_stock` - Stock levels (Odoo sync)

### Junction Tables (3)
- `product_categories` - Product ↔ Category
- `voucher_products` - Voucher ↔ Product
- `voucher_categories` - Voucher ↔ Category

### Filters (3)
- `filter_colors` - Color filter options
- `filter_finishings` - Finishing filter options
- `filter_sizes` - Size filter options

### CMS (3)
- `cms_pages` - Static pages (About, Terms, etc.)
- `cms_banners` - Homepage carousels
- `cms_settings` - Site configuration

### Utility & Logging (6)
- `shipping_costs_cache` - Cached shipping rates
- `product_ratings_summary` - Aggregated reviews
- `sync_logs` - Odoo sync monitoring
- `notifications` - User notifications
- `activity_logs` - Audit trail
- `email_queue` - Async email processing

### Flash Sales & Analytics (4)
- `flash_sales` - Flash sale campaigns
- `flash_sale_products` - Flash sale items
- `search_history` - Search analytics
- `product_views` - Product view tracking

## 🔧 Demo Seeders

The seeders create realistic demo data:

1. **Users** (4 users)
   - Admin user
   - 3 Customer users

2. **Categories** (9 categories)
   - Furniture (parent)
     - Sofa, Meja, Kursi, Lemari
   - Decor (parent)
     - Lighting, Rug, Wall Art, Accessories

3. **Products** (8 products)
   - Various furniture items with complete details

4. **Product Variants** (17 variants)
   - Different colors, finishes, stock levels

5. **Vouchers** (5 vouchers)
   - Welcome discount, fixed amount, free shipping, mega sale, expired (for testing)

6. **CMS Settings** (20 settings)
   - Site configuration, contact info, social media, shipping, payment

## 📖 Usage Example

```typescript
import { sequelize, User, Product, Order } from '@repo/database';

// Test connection
await sequelize.authenticate();

// Find user
const user = await User.findByPk(1);

// Find products with variants
const products = await Product.findAll({
  include: ['variants', 'images']
});

// Create order
const order = await Order.create({
  user_id: 1,
  total_amount: 5000000,
  // ... other fields
});
```

## 🔄 Odoo Integration

Tables ready for Odoo sync:
- `users` → `odoo_customer_id`
- `products` → `odoo_product_id`
- `orders` → `odoo_order_id`
- `product_stock` → `odoo_warehouse_id`
- `addresses` → `odoo_address_id`

## ⚠️ Important Notes

1. **Always backup** before running migrations in production
2. **Never use `db:reset`** in production
3. **Use migrations** for schema changes, bukan `sequelize.sync()`
4. **Seeders hanya untuk development** - jangan run di production

## 🐛 Troubleshooting

### "Unknown file extension .ts"
→ Run `npm run build` dulu sebelum migrations

### "ER_BAD_DB_ERROR: Unknown database"
→ Create database dulu: `CREATE DATABASE ansania_ecommerce;`

### "Access denied for user"
→ Check credentials di `.env` file

### "Connection refused"
→ Make sure MariaDB/MySQL service is running

## 📝 License

Private - Ansania E-Commerce Project
