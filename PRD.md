# Product Requirements Document (PRD)

## E-Commerce Platform with Odoo Integration

**Document Version:** 1.0  
**Last Updated:** January 21, 2026  
**Status:** Draft

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Architecture](#2-system-architecture)
3. [Feature Specifications](#3-feature-specifications)
4. [Technical Requirements](#4-technical-requirements)
5. [Integration Specifications](#5-integration-specifications)
6. [Testing Strategy](#6-testing-strategy)
7. [Deployment Strategy](#7-deployment-strategy)
8. [Project Timeline](#8-project-timeline)
9. [Success Metrics](#9-success-metrics)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Overview

### 1.1 Project Summary

Membangun platform e-commerce modern dengan integrasi penuh ke Odoo ERP, menggunakan Next.js untuk frontend, Express.js untuk backend API gateway, dan MariaDB sebagai database cache/custom features, semuanya dikelola dalam Turborepo monorepo.

### 1.2 Tech Stack

| Layer               | Technology                       | Version            |
| ------------------- | -------------------------------- | ------------------ |
| **Frontend**        | Next.js (TypeScript, App Router) | 15+                |
| **Backend**         | Express.js (TypeScript)          | Latest             |
| **Database**        | MariaDB                          | Latest             |
| **Monorepo**        | Turborepo                        | Latest             |
| **ERP Integration** | Odoo.com                         | REST API / XML-RPC |
| **Payment Gateway** | Doku                             | Latest             |
| **Shipping**        | JNT Express API                  | Latest             |

### 1.3 Key Objectives

1. Seamless integration with Odoo for products, inventory, customers, and orders
2. Powerful CMS for content control without code changes
3. Optimal performance with proper caching strategy
4. Smooth and modern user experience
5. Scalable architecture for business growth

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
┌─────────────┐
│  Next.js    │ Frontend (SSR/CSR)
│  (Port 3000)│
└──────┬──────┘
       │
       │ HTTP/REST API
       │
┌──────▼──────────┐
│   Express.js    │ API Gateway / Business Logic
│   (Port 5000)   │
└────┬────────┬───┘
     │        │
     │        └─────────────┐
     │                      │
┌────▼────────────┐   ┌─────▼─────────┐
│  MariaDB        │   │   Odoo.com    │
│  (cPanel)       │   │   ERP System  │
│                 │   │               │
│ • Cache         │   │ • Products    │
│ • Custom Data   │   │ • Inventory   │
│ • CMS Content   │   │ • Customers   │
│ • Sessions      │   │ • Orders      │
└─────────────────┘   └───────────────┘
```

### 2.2 Data Synchronization Strategy

#### From Odoo → MariaDB (Cache)

| Data Type       | Frequency  | Method    | Priority |
| --------------- | ---------- | --------- | -------- |
| Products        | 30 minutes | Cron Job  | Medium   |
| Stock/Inventory | 30 minutes | Cron Job  | High     |
| Categories      | 1 hour     | Cron Job  | Low      |
| Customer Data   | On login   | Real-time | High     |

#### From E-Commerce → Odoo (Create/Update)

| Data Type               | Timing              | Method    | Priority |
| ----------------------- | ------------------- | --------- | -------- |
| Sales Orders            | On checkout success | Real-time | Critical |
| Customer Registration   | On register         | Real-time | High     |
| Customer Profile Update | On update           | Real-time | Medium   |
| Order Status Update     | Payment webhook     | Real-time | Critical |

---

## 3. Feature Specifications

### 3.1 Authentication & User Management

#### 3.1.1 Login

**Flow:** Frontend → Express → Odoo Authentication API → JWT Token → Session

**Requirements:**

- Email/phone + password authentication
- "Remember me" option
- Rate limiting (5 attempts per 15 minutes)
- JWT-based session management
- Store Odoo `user_id` & `partner_id` in MariaDB

**API Endpoint:** `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "odoo_user_id": 123,
      "odoo_partner_id": 456
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 3.1.2 Registration

**Flow:** Frontend → Express → Create in Odoo → Save to MariaDB

**Requirements:**

- Required fields: email, phone, full name, password
- Optional email verification
- Password strength validation
- Auto-create customer in Odoo
- Duplicate check (email/phone)

**API Endpoint:** `POST /api/auth/register`

#### 3.1.3 Password Reset

**Flow:** Frontend → Express → Odoo Password Reset → Email Token

**Requirements:**

- Email verification
- Token expiry (1 hour)
- Password reset via Odoo API
- Email notification

**API Endpoints:**

- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

#### 3.1.4 Profile Management

**Flow:** Frontend → Express → Update Odoo → Update MariaDB

**Requirements:**

- Edit name, phone, email
- Upload avatar (optional)
- Change password
- Two-way sync with Odoo

**API Endpoint:** `PUT /api/user/profile`

---

### 3.2 Multi-Address Management

**Requirements:**

- Multiple shipping addresses per user
- Set default address
- Address labels (Home, Office, etc.)
- Full address fields:
  - Recipient name
  - Phone number
  - Full address
  - City, district, province
  - Postal code
- Integration with JNT Express API for area/district validation
- Sync with Odoo partner addresses

**API Endpoints:**

| Method | Endpoint                              | Description        |
| ------ | ------------------------------------- | ------------------ |
| GET    | `/api/user/addresses`                 | List all addresses |
| POST   | `/api/user/addresses`                 | Add new address    |
| PUT    | `/api/user/addresses/:id`             | Update address     |
| DELETE | `/api/user/addresses/:id`             | Delete address     |
| PUT    | `/api/user/addresses/:id/set-default` | Set as default     |

---

### 3.3 Product Management

#### 3.3.1 Product Listing

**Data Source:** MariaDB (cached from Odoo) + CMS control

**Requirements:**

**Display Rules:**

- Show only products with `is_visible = true`
- Pagination (20 items per page)

**Sorting Options:**

- Newest
- Price: Low to High
- Price: High to Low
- Most Popular (by views/sales)
- Best Rating

**Filters:**

- Category
- Color
- Finishing
- Size
- Price range
- Rating (1-5 stars)
- Stock availability

**Search:**

- Product name
- Description
- SKU

**Display Information:**

- Product image
- Product name
- Price & compare price (strikethrough)
- Rating
- Badge (New/Sale)

**API Endpoint:** `GET /api/products`

**Query Parameters:**

```
?page=1
&limit=20
&sort=newest
&category=furniture
&color=blue
&price_min=100000
&price_max=500000
&rating_min=4
&search=meja
&in_stock=true
```

#### 3.3.2 Product Detail

**Requirements:**

**Display Components:**

- Image gallery (carousel)
- Variant selection (color, finishing, size)
- Real-time stock check
- Price display (original, discount, final)
- Rich text description from Odoo
- Related products
- Product reviews
- Breadcrumb navigation
- Share buttons (WhatsApp, Facebook, Twitter, Copy Link)
- Add to cart/wishlist buttons
- Shipping calculator

**API Endpoint:** `GET /api/products/:slug`

#### 3.3.3 Stock Management

**Requirements:**

**Stock Source:**

- Cache stock from Odoo online warehouse (not main warehouse)
- Update every 30 minutes via cron job

**Stock Reservation:**

- Reserve stock when item in cart
- Release after 30 minutes or checkout
- Real-time stock check at checkout

**Stock Status Display:**

- **In Stock:** > 10 units
- **Limited Stock:** 1-10 units
- **Out of Stock:** 0 units
- **Pre-order:** Negative stock allowed

**Stock Reserve Logic:**

```sql
-- When adding to cart
UPDATE product_stock
SET reserved_quantity = reserved_quantity + :quantity
WHERE product_variant_id = :variant_id;

-- Available quantity (computed column)
-- available_quantity = quantity - reserved_quantity
```

---

### 3.4 Product Variants

**Requirements:**

**Variant Dimensions:**

- Multi-dimensional: Color × Finishing × Size
- Each variant has:
  - Unique SKU
  - Individual price (can override parent product)
  - Individual stock
  - Optional images (fallback to parent)
  - Visibility control (CMS)

**Variant Selection UI:**

- Visual color swatches (hex code)
- Dropdown/buttons for finishing
- Size buttons
- Dynamic price & stock update
- Disable out-of-stock variants
- Show "Not available" for missing combinations

**Variant Data Structure:**

```json
{
  "product_id": 1,
  "variants": [
    {
      "id": 101,
      "sku": "TABLE-01-RED-GLOSSY-L",
      "color": "Red",
      "color_hex": "#FF0000",
      "finishing": "Glossy",
      "size": "Large",
      "price": 1500000,
      "stock": 10,
      "images": ["url1.jpg", "url2.jpg"],
      "is_visible": true
    }
  ]
}
```

---

### 3.5 Shopping Cart

**Requirements:**

**Cart Types:**

- Guest cart (session-based)
- Logged-in user cart (persistent)

**Features:**

- Add/update/remove items
- Quantity control (1 to max stock)
- Price snapshot at add-to-cart
- Auto-calculate subtotal
- Apply voucher code
- Stock availability warning
- Cart expiry:
  - 7 days for logged-in users
  - Session duration for guests
- Cart sync on login (merge guest cart)

**Display Components:**

- Mini cart in header (dropdown)
- Full cart page

**Cart Item Display:**

- Product image
- Product name + variant info
- Price per item
- Quantity selector
- Subtotal
- Remove button
- Stock warning (if limited/out of stock)

**API Endpoints:**

| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| GET    | `/api/cart`                | Get cart        |
| POST   | `/api/cart/items`          | Add item        |
| PUT    | `/api/cart/items/:id`      | Update quantity |
| DELETE | `/api/cart/items/:id`      | Remove item     |
| POST   | `/api/cart/apply-voucher`  | Apply voucher   |
| DELETE | `/api/cart/remove-voucher` | Remove voucher  |

---

### 3.6 Wishlist

**Requirements:**

- Available only for logged-in users
- Add/remove products or specific variants
- View all wishlist items
- Move to cart functionality
- Price drop notifications
- Share wishlist (optional)

**API Endpoints:**

| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/wishlist`                  | Get all wishlist items |
| POST   | `/api/wishlist`                  | Add to wishlist        |
| DELETE | `/api/wishlist/:id`              | Remove from wishlist   |
| POST   | `/api/wishlist/:id/move-to-cart` | Move to cart           |

---

### 3.7 Checkout Process

#### Checkout Flow

```
1. Cart Review
   ↓
2. Shipping Address
   ↓
3. Shipping Method (Calculate shipping cost)
   ↓
4. Payment Method
   ↓
5. Order Summary
   ↓
6. Payment (Redirect to Midtrans)
   ↓
7. Order Confirmation
```

#### Step-by-Step Requirements

**Step 1: Cart Validation**

- Validate all items still available
- Check stock availability
- Recalculate prices (if changed from Odoo)
- Validate voucher (if applied)

**Step 2: Shipping Address**

- Show all saved addresses
- Quick add new address form
- Set as default option
- Address validation

**Step 3: Shipping Cost Calculation**

- Integration with JNT Express API
- Display available services:
  - JNT (primary): REG (Regular), YES (One Day Service), CARGO
  - Optional other couriers: JNE, SiCepat, POS, TIKI
- Show services with:
  - Estimated delivery time
  - Shipping cost
- Cache shipping costs (24 hours)
- Free shipping logic (if order > threshold from CMS)

**Step 4: Payment Method Selection**

- Doku integration
- Available payment methods:
  - **Virtual Account:** BCA, Mandiri, BNI, BRI, Permata, CIMB Niaga
  - **Credit Card:** Visa, Mastercard, JCB, Amex
  - **E-Wallet:** LinkAja, OVO (if available)
  - **QRIS:** Quick Response Code Indonesian Standard
  - **Convenience Store:** Alfamart, Indomaret
- Display payment instructions per method

**Step 5: Order Creation**

- Create order in MariaDB (status: `pending_payment`)
- Generate unique order number
- Snapshot all data (address, items, prices)
- Create payment transaction
- Get Doku payment token/URL
- **CRITICAL:** Do NOT create in Odoo yet (wait for payment success)

**Step 6: Payment Processing**

- Redirect to Doku payment page
- Handle return URL
- Handle webhook for payment status

**Step 7: Post-Payment Processing**

**If Payment Success:**

- Update order status in MariaDB
- Create Sales Order in Odoo
- Send confirmation email
- Release cart items
- Deduct stock
- Create notification

**If Payment Failed:**

- Keep order as failed
- Release reserved stock
- Show retry option

**API Endpoints:**

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| POST   | `/api/checkout/validate`           | Validate cart before checkout |
| POST   | `/api/checkout/calculate-shipping` | Calculate shipping cost       |
| POST   | `/api/checkout/create-order`       | Create order & payment        |
| POST   | `/api/checkout/payment-webhook`    | Doku webhook handler          |
| GET    | `/api/orders/:order_number`        | Get order status              |

---

### 3.8 Voucher System

**Requirements:**

**Voucher Types:**

1. **Percentage Discount** (e.g., 10% off, max 50k)
2. **Fixed Amount Discount** (e.g., 50k off)
3. **Free Shipping**

**Conditions:**

- Minimum purchase amount
- Applicable to:
  - Specific products
  - Specific categories
  - All products
- Usage limits:
  - Total usage limit per voucher
  - Usage limit per user
- Valid date range
- Active/inactive status

**Features:**

- Voucher code validation
- Auto-apply best voucher (optional)
- Show available vouchers in cart page
- Voucher input field in cart
- Error messages:
  - Expired voucher
  - Minimum purchase not met
  - Usage limit exceeded
  - Invalid code

**Cart Page Voucher Display:**

- List of available vouchers for user
- Voucher details (discount, min purchase, expiry)
- "Apply" button
- Currently applied voucher indicator

**API Endpoints:**

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/api/vouchers/available` | Get available vouchers for user |
| POST   | `/api/vouchers/validate`  | Validate voucher code           |
| POST   | `/api/cart/apply-voucher` | Apply voucher to cart           |

---

### 3.9 Order Management

#### 3.9.1 Order History

**Requirements:**

- List all user orders
- Filter by status:
  - All
  - Pending Payment
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- Sort by date (newest/oldest)
- Pagination
- Display information:
  - Order number
  - Order date
  - Total amount
  - Order status
  - Items preview

**API Endpoint:** `GET /api/orders`

#### 3.9.2 Order Detail

**Requirements:**

**Display Information:**

- Full order information
- Order timeline:
  - Ordered → Paid → Processing → Shipped → Delivered
- Items list with snapshot data
- Shipping information:
  - Courier name
  - Tracking number
  - Shipping address
- Payment information:
  - Payment method
  - Payment status
  - Transaction ID
- Total breakdown:
  - Subtotal
  - Discount
  - Shipping cost
  - Total amount

**Actions:**

- Download invoice (PDF)
- Cancel order (if status = pending_payment or paid)
- Contact seller (WhatsApp)
- Reorder button

**Order Status Flow:**

```
pending_payment → paid → processing → shipped → delivered
                   ↓
               cancelled
```

**API Endpoints:**

| Method | Endpoint                            | Description          |
| ------ | ----------------------------------- | -------------------- |
| GET    | `/api/orders/:order_number`         | Get order detail     |
| PUT    | `/api/orders/:order_number/cancel`  | Cancel order         |
| GET    | `/api/orders/:order_number/invoice` | Download invoice PDF |
| POST   | `/api/orders/:order_number/reorder` | Reorder same items   |

#### 3.9.3 Order Tracking

**Requirements:**

- Integration with courier tracking API (if available)
- Display tracking history
- Estimated delivery date
- Current location
- Manual tracking number input from admin

---

### 3.10 Product Reviews & Ratings

**Requirements:**

**Review Submission:**

- Only verified buyers can review (must have completed order)
- One review per product per user
- Rating: 1-5 stars
- Title + comment (optional)
- Upload images (max 5 images)

**Review Moderation:**

- Review status: Pending → Approved/Rejected
- Show only approved reviews on frontend
- Admin moderation interface

**Review Display:**

- Sort options:
  - Most Recent
  - Highest Rating
  - Lowest Rating
  - Most Helpful
- Helpful button (optional)
- Report inappropriate review button

**Product Page Review Section:**

- Average rating (aggregate)
- Total reviews count
- Rating distribution:
  - 5 star: X%
  - 4 star: Y%
  - (etc.)
- Review list with pagination
- Verified purchase badge
- Review images lightbox

**API Endpoints:**

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| POST   | `/api/products/:id/reviews` | Create review       |
| GET    | `/api/products/:id/reviews` | Get product reviews |
| PUT    | `/api/reviews/:id/helpful`  | Mark as helpful     |
| POST   | `/api/reviews/:id/report`   | Report review       |

---

### 3.11 Product Filters

**Requirements:**

**Filter Types:**

- **Color:** Visual color swatches from `filter_colors` table
- **Finishing:** Checkbox list from `filter_finishings` table
- **Size:** Button group from `filter_sizes` table
- **Price Range:** Slider with min/max input
- **Category:** Tree view (parent-child hierarchy)
- **Rating:** Star rating selector (4+ stars, 3+ stars, etc.)
- **Stock:** Checkbox "In Stock Only"

**Filter Features:**

- Multi-select filters (except price & rating)
- Active filters display with "X" remove button
- "Clear all filters" button
- URL parameter updates (for sharing/bookmarking)
- Result count display
- Smooth filtering (no full page reload)

**Filter Master Data (CMS Management):**

Admins can manage:

- **Colors:** Name, hex code, display order
- **Finishings:** Name, display order
- **Sizes:** Name, display order

**API Endpoints:**

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| GET    | `/api/filters/colors`     | Get all colors     |
| GET    | `/api/filters/finishings` | Get all finishings |
| GET    | `/api/filters/sizes`      | Get all sizes      |

---

### 3.12 Content Management System (CMS)

#### 3.12.1 CMS Settings (Key-Value Store)

**Manageable Settings:**

**General:**

- Site name, tagline
- Logos:
  - Desktop logo
  - Mobile logo
  - Dark mode logo
  - Favicon
- Footer text
- SEO metadata:
  - Site description
  - Keywords
- Promo banner:
  - Text
  - Background color
  - Show/hide toggle

**Contact:**

- Email addresses (contact, support)
- Phone number
- WhatsApp number
- Physical address
- Google Maps embed URL
- Working hours

**Social Media:**

- Facebook URL
- Instagram URL
- Twitter URL
- YouTube URL
- TikTok URL
- LinkedIn URL

**Shipping:**

- Free shipping threshold
- Default origin branch/area (JNT Express)
- Available couriers

**Payment:**

- Enabled payment methods
- Payment instructions

**Features:**

- Enable/disable:
  - Wishlist
  - Reviews
  - Newsletter
  - Live chat
- Maintenance mode

**Admin UI:**

- Form with fields based on `setting_type`
- Save button
- Reset to default option
- Preview changes (optional)

**API Endpoint:** `GET /api/cms/settings`

#### 3.12.2 Static Pages

**Manageable Pages:**

- Terms & Conditions
- Privacy Policy
- About Us
- Shipping Information
- Return & Refund Policy
- FAQ
- How to Order
- Payment Methods

**Admin Features:**

- WYSIWYG rich text editor (TinyMCE/Quill)
- SEO fields:
  - Meta title
  - Meta description
  - Meta keywords
- Slug editor
- Publish/draft toggle
- Show in footer/header toggle
- Display order
- Preview mode

**Frontend Display:**

- Rendered HTML content (sanitized)
- Breadcrumb navigation
- SEO meta tags
- Social share buttons
- Last updated date

**API Endpoints:**

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/cms/pages`       | List all pages   |
| GET    | `/api/cms/pages/:slug` | Get page by slug |

#### 3.12.3 Homepage Banners & Carousels

**Requirements:**

**Banner Types:**

- Main carousel (hero banners with auto-slide)
- Secondary banners (grid/list layout)

**Banner Features:**

- Desktop & mobile images (responsive)
- CTA button with link
- Text positioning (left, center, right)
- Text color control
- Overlay opacity control
- Schedule (start/end date)
- Active/inactive toggle
- Display order (drag & drop)
- Click tracking (analytics)

**Admin UI:**

- Image upload (drag & drop)
- Form fields:
  - Title, subtitle
  - Link URL
  - CTA text
- Color picker for text color
- Slider for overlay opacity
- Date range picker
- Preview carousel

**Frontend Display:**

- Auto-play with pause on hover
- Swipe support (mobile)
- Navigation dots & arrows
- Lazy loading images
- Click event tracking

**API Endpoints:**

| Method | Endpoint                           | Description        |
| ------ | ---------------------------------- | ------------------ |
| GET    | `/api/cms/banners`                 | Get active banners |
| POST   | `/api/cms/banners/:id/track-click` | Track banner click |

#### 3.12.4 Popups

**Popup Types:**

- Modal (center screen)
- Bottom banner (sticky bottom)
- Corner banner (bottom right/left)

**Trigger Options:**

- On page load (with delay)
- On exit intent
- On scroll (% of page)

**Frequency Control:**

- Show once per session
- Show once per user (cookie/localStorage)
- Show every X days

**Admin Features:**

- Popup builder interface
- Image upload
- Content editor
- CTA button configuration
- Trigger settings
- Frequency settings
- Schedule (date range)

**API Endpoint:** `GET /api/cms/popups/active`

#### 3.12.5 Footer Widgets

**Widget Types:**

- **Links:** List of links
- **Text:** Plain text content
- **HTML:** Custom HTML
- **Newsletter:** Subscription form

**Requirements:**

- Multiple columns (1-4 columns)
- Per-column widgets
- Display order
- Active/inactive toggle

**Admin UI:**

- Drag & drop columns
- Add/edit/delete widgets
- JSON editor for links
- Rich text editor for text/HTML

**Frontend Display:**

- Responsive columns (mobile: stacked)
- Newsletter form with validation

**API Endpoint:** `GET /api/cms/footer-widgets`

#### 3.12.6 Trust Badges

**Requirements:**

- Icon upload
- Name & description
- Display order
- Active/inactive toggle
- Display location options:
  - Homepage
  - Product pages
  - Checkout page

**Admin UI:**

- List view with icon thumbnails
- Drag to reorder
- Toggle active/inactive

**Frontend Display:**

- Icon grid or carousel
- Tooltip with description on hover

**API Endpoint:** `GET /api/cms/trust-badges`

---

### 3.13 Flash Sale / Promotions

**Requirements:**

**Flash Sale Configuration:**

- Name, description
- Start & end date/time
- Product selection
- Discounted price per product
- Stock limit for flash sale (separate from regular stock)

**Features:**

- Show countdown timer on frontend
- Track sold count
- Auto activate/deactivate based on schedule
- Highlight flash sale products:
  - Special badge
  - Featured section

**Admin UI:**

- Flash sale builder
- Product selector
- Price setter:
  - Original price → Flash sale price
  - Auto-calculate discount percentage
- Stock limit input
- Schedule picker with timezone

**Frontend Display:**

- Flash sale section on homepage
- Countdown timer (days:hours:minutes:seconds)
- Progress bar (sold / stock limit)
- Urgency messaging:
  - "Only X items left!"
  - "Ends in X hours!"

**API Endpoints:**

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| GET    | `/api/flash-sales/active`       | Get active flash sales  |
| GET    | `/api/flash-sales/:id/products` | Get flash sale products |

---

### 3.14 Search Functionality

**Requirements:**

**Search Capabilities:**

- Search bar in header (always visible)
- Search by:
  - Product name
  - Description
  - SKU
  - Category name

**Search Features:**

- Auto-suggest/autocomplete dropdown
- Search history (logged-in users)
- Popular searches display
- Search result page with filters
- Highlight search terms in results
- "No results" state with suggestions

**Search Logic:**

- Full-text search in MariaDB (FULLTEXT index)
- Result prioritization:
  1. Exact match in product name
  2. Partial match in product name
  3. Match in description
  4. Match in SKU
- Filter out invisible products (`is_visible = false`)

**API Endpoints:**

| Method | Endpoint                            | Description              |
| ------ | ----------------------------------- | ------------------------ |
| GET    | `/api/search?q=keyword`             | Search products          |
| GET    | `/api/search/suggestions?q=keyword` | Autocomplete suggestions |
| GET    | `/api/search/history`               | User search history      |
| GET    | `/api/search/popular`               | Popular searches         |

---

### 3.15 Notifications

**Notification Types:**

- Order status updates
- Payment confirmation
- Shipping updates
- Promo/voucher announcements
- Wishlist price drop alerts
- Stock back-in-stock alerts

**Notification Channels:**

- In-app notifications (bell icon in header)
- Email notifications
- Push notifications (optional, future enhancement)

**Requirements:**

- Unread count badge
- Mark as read functionality
- Notification list with pagination
- Click to view related entity (order, product)
- Clear all notifications option

**API Endpoints:**

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| GET    | `/api/notifications`           | Get user notifications  |
| PUT    | `/api/notifications/:id/read`  | Mark as read            |
| PUT    | `/api/notifications/read-all`  | Mark all as read        |
| DELETE | `/api/notifications/clear-all` | Clear all notifications |

---

### 3.16 Email System

**Email Templates:**

1. **Welcome Email** - On registration
2. **Email Verification** - Verify email address
3. **Order Confirmation** - Order placed
4. **Payment Confirmation** - Payment success
5. **Order Shipped** - With tracking number
6. **Order Delivered** - Delivery confirmation
7. **Password Reset** - Forgot password
8. **Voucher Code** - Special voucher for user
9. **Newsletter** - Promotions & updates

**Requirements:**

- Email queue system (background job processing)
- Retry logic (max 3 attempts)
- Responsive HTML email templates
- Personalization:
  - User name
  - Order details
  - Dynamic content
- Unsubscribe link for newsletters
- Email tracking (optional):
  - Open rate
  - Click rate

**Email Queue Flow:**

```
Event triggered
  ↓
Add to email_queue table
  ↓
Background worker picks up job
  ↓
Send via SMTP
  ↓
Update status (sent/failed)
```

---

### 3.17 Newsletter

**Requirements:**

- Newsletter subscription form (footer/popup)
- Email validation
- Double opt-in (verification email)
- Unsubscribe functionality
- Admin newsletter blast capability
- Subscriber management (admin panel)

**API Endpoints:**

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/api/newsletter/subscribe`   | Subscribe to newsletter     |
| POST   | `/api/newsletter/verify`      | Verify email                |
| POST   | `/api/newsletter/unsubscribe` | Unsubscribe from newsletter |

---

### 3.18 FAQ

**Requirements:**

- FAQ categories
- Question & answer (rich text support)
- Display order
- Active/inactive toggle
- Search within FAQ
- Accordion UI (expand/collapse)

**Admin UI:**

- CRUD FAQ items
- Category management
- Drag to reorder

**Frontend Display:**

- Categorized accordion
- Search bar
- Breadcrumb navigation

**API Endpoint:** `GET /api/faqs`

---

### 3.19 Analytics & Tracking

**Tracked Data:**

- Product views (per product, per user/session)
- Search queries (keywords, result count)
- Cart abandonment
- Conversion rate
- Popular products
- Click events (banners, CTAs)

**Requirements:**

- Activity logs table
- Product views table
- Search history table
- Analytics dashboard for admin (future enhancement)

**API Endpoints:**

| Method | Endpoint                      | Description        |
| ------ | ----------------------------- | ------------------ |
| POST   | `/api/analytics/track-view`   | Track product view |
| POST   | `/api/analytics/track-search` | Track search query |
| POST   | `/api/analytics/track-click`  | Track click event  |

---

### 3.20 Admin Panel

#### Admin Roles & Permissions

| Role            | Permissions                                       |
| --------------- | ------------------------------------------------- |
| **Super Admin** | Full access to all features                       |
| **Admin**       | Most access, cannot manage admin users            |
| **Editor**      | Content management only (CMS, product visibility) |
| **Viewer**      | Read-only access                                  |

#### Admin Sections

**Dashboard:**

- Sales overview:
  - Today
  - This week
  - This month
- Recent orders list
- Low stock alerts
- Pending reviews count
- Quick statistics:
  - Total products
  - Total orders
  - Total customers
  - Total revenue

**Order Management:**

- Order list with advanced filters:
  - By status
  - By date range
  - By customer
  - By payment method
- Order detail view
- Update order status
- Print invoice
- Export orders (CSV/Excel)

**Product Management (CMS Control):**

- Product visibility toggle
- Featured product toggle
- Display order management
- Price override (`selling_price`)
- Discount settings
- Image gallery management

**CMS Management:**

- Settings configuration
- Static pages editor
- Banners & carousel management
- Popup management
- Footer widgets
- Trust badges

**Voucher Management:**

- CRUD vouchers
- View usage statistics
- Generate voucher codes

**Flash Sale Management:**

- CRUD flash sales
- View sales performance
- Monitor stock limits

**Customer Management:**

- Customer list with search & filter
- Customer detail view:
  - Order history
  - Saved addresses
  - Account information
- Customer notes

**Review Moderation:**

- Pending reviews queue
- Approve/reject reviews
- Reply to reviews (optional)
- Delete inappropriate reviews

**Reports:**

- Sales report (by period, product, category)
- Product performance report
- Customer report (lifetime value, repeat rate)
- Export reports

**System Settings:**

- Admin user management
- Role & permission management
- System configuration

---

## 4. Technical Requirements

### 4.1 Performance

| Metric                | Target      | Maximum     |
| --------------------- | ----------- | ----------- |
| **Page Load Time**    | < 2 seconds | < 3 seconds |
| **API Response Time** | < 300ms     | < 500ms     |
| **Database Query**    | < 50ms      | < 100ms     |

**Optimization Strategies:**

- Image optimization:
  - WebP format
  - Lazy loading
  - Responsive images
  - CDN (optional)
- Caching:
  - Redis for sessions & frequent queries (optional)
  - MariaDB for data cache
  - Browser caching for static assets
- Code splitting (Next.js automatic)
- Database query optimization:
  - Proper indexing
  - Query optimization
  - Connection pooling

### 4.2 Security

**Authentication & Authorization:**

- JWT with refresh token mechanism
- bcrypt password hashing (salt rounds: 10)
- Role-based access control (RBAC)
- Session management

**API Security:**

- Rate limiting (per IP, per user)
- Input validation & sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- CSRF protection
- CORS configuration

**Data Security:**

- HTTPS/SSL required for production
- Encrypt sensitive data (payment info, PII)
- Secure password reset flow
- Secure session storage

**Headers:**

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 4.3 SEO Optimization

**Next.js SSR:**

- Server-side rendering for product pages
- Static generation for content pages
- Dynamic sitemap generation

**Meta Tags:**

- Dynamic meta title & description
- Open Graph tags (Facebook)
- Twitter Card tags
- Canonical URLs

**Structured Data:**

- JSON-LD schema for:
  - Products
  - Breadcrumbs
  - Reviews
  - Organization

**SEO Best Practices:**

- Clean, SEO-friendly URLs (slugs)
- Descriptive alt tags for all images
- Proper heading hierarchy (H1, H2, H3)
- Mobile-friendly design
- Fast page load times
- XML sitemap
- Robots.txt configuration

### 4.4 Responsive Design

**Mobile-First Approach:**
Design for mobile devices first, then enhance for larger screens.

**Breakpoints:**

| Device      | Breakpoint     |
| ----------- | -------------- |
| **Mobile**  | < 768px        |
| **Tablet**  | 768px - 1024px |
| **Desktop** | > 1024px       |

**Touch-Friendly:**

- Minimum button size: 44x44px
- Touch gestures support (swipe, pinch-to-zoom)
- Adequate spacing between interactive elements

**Responsive Images:**

- Different image sizes for different devices
- Art direction for hero images
- WebP with fallback

### 4.5 Browser Support

**Desktop Browsers:**

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile Browsers:**

- Chrome Mobile (Android)
- Safari iOS

**Graceful Degradation:**

- Basic functionality on older browsers
- Progressive enhancement approach

### 4.6 Accessibility

**WCAG 2.1 Level AA Compliance:**

**Keyboard Navigation:**

- All interactive elements accessible via keyboard
- Logical tab order
- Skip to main content link

**Screen Reader Support:**

- Proper ARIA labels and roles
- Semantic HTML structure
- Descriptive link text

**Visual Accessibility:**

- Color contrast ratio: minimum 4.5:1
- Visible focus indicators
- Text resizing support (up to 200%)
- No information conveyed by color alone

**Forms:**

- Associated labels for all inputs
- Error messages clearly announced
- Required field indicators

### 4.7 Error Handling

**API Error Responses:**

Consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

**Error Categories:**

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

**User-Friendly Messages:**

- Clear, actionable error messages
- Avoid technical jargon
- Suggest solutions when possible

**Logging:**

- Server-side error logging (Winston/Pino)
- Log levels: error, warn, info, debug
- Structured logging (JSON format)

**Monitoring:**

- Error tracking (Sentry - optional)
- Uptime monitoring
- Performance monitoring

**Retry Logic:**

- Automatic retry for transient errors
- Exponential backoff
- Max retry attempts (3)

**Fallback UI:**

- Graceful degradation on errors
- Skeleton screens for loading states
- Error boundaries (React)
- Offline support (PWA - future)

---

## 5. Integration Specifications

### 5.1 Odoo Integration

#### Authentication

**Method:** API Key or XML-RPC  
**Endpoint:** Odoo.com REST API v2  
**Credentials:** Database name, username, API key

#### Data Models Mapping

**User/Partner Mapping:**

```javascript
// Odoo res.partner
{
  id: 123,
  name: "John Doe",
  email: "john@example.com",
  phone: "+62812345678",
  street: "Jl. Example No. 123",
  city: "Jakarta"
}

// Maps to MariaDB users table
{
  id: 1,
  odoo_partner_id: 123,
  full_name: "John Doe",
  email: "john@example.com",
  phone: "+62812345678"
}
```

**Product Mapping:**

```javascript
// Odoo product.product
{
  id: 456,
  name: "Meja Kayu",
  default_code: "MK-001", // SKU
  list_price: 1500000,
  description_sale: "Deskripsi produk...",
  categ_id: [10, "Furniture"]
}

// Maps to MariaDB products table
{
  id: 1,
  odoo_product_id: 456,
  sku: "MK-001",
  name: "Meja Kayu",
  base_price: 1500000,
  description: "Deskripsi produk...",
  category_id: 5
}
```

**Product Variant Mapping:**

```javascript
// Odoo product.product (with attributes)
{
  id: 789,
  product_tmpl_id: [456, "Meja Kayu"],
  default_code: "MK-001-RED-L",
  attribute_value_ids: [
    [1, "Color: Red"],
    [2, "Size: Large"]
  ],
  list_price: 1500000,
  qty_available: 50
}

// Maps to MariaDB product_variants table
{
  id: 10,
  product_id: 1,
  odoo_variant_id: 789,
  sku: "MK-001-RED-L",
  color_id: 1,
  size_id: 3,
  price: 1500000
}
```

**Stock/Inventory Mapping:**

```javascript
// Odoo stock.quant
{
  product_id: [789, "MK-001-RED-L"],
  location_id: [12, "Gudang Online"],
  quantity: 50,
  reserved_quantity: 5
}

// Maps to MariaDB product_stock table
{
  product_variant_id: 10,
  quantity: 50,
  reserved_quantity: 5,
  available_quantity: 45, // computed
  last_synced_at: "2026-01-21 10:00:00"
}
```

**Sales Order Mapping:**

```javascript
// Create in Odoo sale.order
{
  partner_id: 123,
  date_order: "2026-01-21",
  order_line: [
    {
      product_id: 789,
      product_uom_qty: 2,
      price_unit: 1500000
    }
  ],
  amount_total: 3150000
}

// From MariaDB orders table
{
  id: 100,
  order_number: "ORD-20260121-001",
  user_id: 1,
  total_amount: 3150000,
  status: "paid",
  odoo_sale_order_id: 5001 // After sync
}
```

#### Synchronization Jobs (Cron)

**Product Sync (Every 30 minutes):**

```javascript
async function syncProducts() {
  try {
    const odooProducts = await odoo.searchRead("product.product", {
      filters: [["sale_ok", "=", true]],
      fields: [
        "id",
        "name",
        "default_code",
        "list_price",
        "description_sale",
        "categ_id",
        "image_1920",
      ],
    });

    for (const product of odooProducts) {
      await db.products.upsert({
        odoo_product_id: product.id,
        sku: product.default_code,
        name: product.name,
        base_price: product.list_price,
        description: product.description_sale,
        synced_at: new Date(),
      });
    }

    console.log(`Synced ${odooProducts.length} products`);
  } catch (error) {
    console.error("Product sync error:", error);
  }
}
```

**Stock Sync (Every 30 minutes):**

```javascript
async function syncStock() {
  try {
    const warehouseId = 12; // Gudang Online ID

    const stockData = await odoo.searchRead("stock.quant", {
      filters: [
        ["location_id", "=", warehouseId],
        ["quantity", ">", 0],
      ],
      fields: ["product_id", "quantity", "reserved_quantity"],
    });

    for (const stock of stockData) {
      const variantId = await getVariantIdFromOdooProduct(stock.product_id[0]);

      await db.product_stock.upsert({
        product_variant_id: variantId,
        quantity: stock.quantity,
        reserved_quantity: stock.reserved_quantity || 0,
        last_synced_at: new Date(),
      });
    }

    console.log(`Synced stock for ${stockData.length} variants`);
  } catch (error) {
    console.error("Stock sync error:", error);
  }
}
```

**Order Creation (Real-time on payment success):**

```javascript
async function createOdooSalesOrder(orderId) {
  try {
    const order = await db.orders.findById(orderId, {
      include: ["user", "items", "shipping_address"],
    });

    const orderLines = order.items.map((item) => ({
      product_id: item.product_variant.odoo_variant_id,
      product_uom_qty: item.quantity,
      price_unit: item.price,
      name: item.product_name,
    }));

    // Add shipping as order line
    orderLines.push({
      product_id: SHIPPING_PRODUCT_ID, // Configured in Odoo
      product_uom_qty: 1,
      price_unit: order.shipping_cost,
      name: `Shipping - ${order.shipping_courier} ${order.shipping_service}`,
    });

    const odooOrder = await odoo.create("sale.order", {
      partner_id: order.user.odoo_partner_id,
      date_order: order.created_at,
      client_order_ref: order.order_number,
      order_line: orderLines.map((line) => [0, 0, line]),
      note: order.notes,
      // Shipping address
      partner_shipping_id: await getOrCreateOdooAddress(order.shipping_address),
    });

    await db.orders.update(orderId, {
      odoo_sale_order_id: odooOrder.id,
      synced_to_odoo_at: new Date(),
    });

    console.log(
      `Created Odoo SO ${odooOrder.id} for order ${order.order_number}`,
    );
  } catch (error) {
    console.error("Failed to create Odoo sales order:", error);
    // Queue for retry
    await db.sync_queue.create({
      type: "create_sales_order",
      reference_id: orderId,
      status: "failed",
      error_message: error.message,
      retry_count: 0,
    });
  }
}
```

### 5.2 Midtrans Integration

#### Payment Flow

```
1. User completes checkout
   ↓
2. Create order (status: pending_payment)
   ↓
3. Call Midtrans Snap API → Get snap_token
   ↓
4. Redirect user to Midtrans Snap page
   ↓
5. User completes payment
   ↓
6. Midtrans sends webhook → Update order status
   ↓
7. If success → Create Odoo sales order
```

#### Snap API Implementation

```javascript
const midtrans = require("midtrans-client");

const snap = new midtrans.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function createPayment(order) {
  const parameter = {
    transaction_details: {
      order_id: order.order_number,
      gross_amount: order.total_amount,
    },
    customer_details: {
      first_name: order.user.full_name,
      email: order.user.email,
      phone: order.user.phone,
      billing_address: {
        address: order.billing_address.full_address,
        city: order.billing_address.city,
        postal_code: order.billing_address.postal_code,
      },
      shipping_address: {
        address: order.shipping_address.full_address,
        city: order.shipping_address.city,
        postal_code: order.shipping_address.postal_code,
      },
    },
    item_details: order.items
      .map((item) => ({
        id: item.sku,
        price: item.price,
        quantity: item.quantity,
        name: item.product_name,
      }))
      .concat([
        {
          id: "SHIPPING",
          price: order.shipping_cost,
          quantity: 1,
          name: `Shipping - ${order.shipping_courier}`,
        },
      ]),
    callbacks: {
      finish: `${process.env.APP_URL}/checkout/finish`,
      error: `${process.env.APP_URL}/checkout/error`,
      pending: `${process.env.APP_URL}/checkout/pending`,
    },
  };

  const transaction = await snap.createTransaction(parameter);

  // Save payment record
  await db.payments.create({
    order_id: order.id,
    transaction_id: order.order_number,
    transaction_token: transaction.token,
    transaction_url: transaction.redirect_url,
    amount: order.total_amount,
    status: "pending",
    payment_type: null, // Will be updated by webhook
  });

  return transaction;
}
```

#### Webhook Handler

```javascript
const crypto = require("crypto");

app.post("/api/payment/midtrans-webhook", async (req, res) => {
  try {
    const notification = req.body;

    // Verify signature
    const signature = crypto
      .createHash("sha512")
      .update(
        `${notification.order_id}${notification.status_code}` +
          `${notification.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
      )
      .digest("hex");

    if (signature !== notification.signature_key) {
      console.error("Invalid Midtrans signature");
      return res.status(403).json({ error: "Invalid signature" });
    }

    const payment = await db.payments.findOne({
      where: { transaction_id: notification.order_id },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update payment status
    const paymentStatus = mapMidtransStatus(
      notification.transaction_status,
      notification.fraud_status,
    );

    await db.payments.update(payment.id, {
      status: paymentStatus,
      payment_type: notification.payment_type,
      transaction_time: notification.transaction_time,
      settlement_time: notification.settlement_time,
      payment_response: JSON.stringify(notification),
    });

    // Handle different payment statuses
    if (paymentStatus === "success") {
      await handlePaymentSuccess(payment.order_id);
    } else if (paymentStatus === "failed") {
      await handlePaymentFailed(payment.order_id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

function mapMidtransStatus(transactionStatus, fraudStatus) {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "success" : "pending";
  } else if (transactionStatus === "settlement") {
    return "success";
  } else if (transactionStatus === "pending") {
    return "pending";
  } else if (
    transactionStatus === "deny" ||
    transactionStatus === "expire" ||
    transactionStatus === "cancel"
  ) {
    return "failed";
  }
  return "pending";
}

async function handlePaymentSuccess(orderId) {
  const order = await db.orders.findById(orderId);

  // Update order status
  await db.orders.update(orderId, {
    status: "paid",
    payment_status: "paid",
    paid_at: new Date(),
  });

  // Create Odoo sales order
  await createOdooSalesOrder(orderId);

  // Deduct stock
  for (const item of order.items) {
    await db.product_stock.decrement({
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
    });
  }

  // Send confirmation email
  await emailQueue.add({
    template: "payment_confirmation",
    to: order.user.email,
    data: { order },
  });

  // Create notification
  await db.notifications.create({
    user_id: order.user_id,
    type: "payment_success",
    title: "Pembayaran Berhasil",
    message: `Pembayaran untuk order ${order.order_number} telah berhasil`,
    reference_type: "order",
    reference_id: order.id,
  });
}

async function handlePaymentFailed(orderId) {
  const order = await db.orders.findById(orderId);

  // Update order status
  await db.orders.update(orderId, {
    status: "cancelled",
    payment_status: "failed",
    cancelled_at: new Date(),
  });

  // Release reserved stock
  for (const item of order.items) {
    await db.product_stock.decrement({
      product_variant_id: item.product_variant_id,
      reserved_quantity: item.quantity,
    });
  }

  // Send notification
  await db.notifications.create({
    user_id: order.user_id,
    type: "payment_failed",
    title: "Pembayaran Gagal",
    message: `Pembayaran untuk order ${order.order_number} gagal. Silakan coba lagi.`,
    reference_type: "order",
    reference_id: order.id,
  });
}
```

### 5.3 RajaOngkir Integration

#### Shipping Cost Calculation

```javascript
const axios = require("axios");

async function calculateShippingCost(params) {
  const { origin, destination, weight, courier } = params;

  // Generate cache key
  const cacheKey = `shipping:${origin}:${destination}:${weight}:${courier}`;

  // Check cache first
  const cached = await db.shipping_costs_cache.findOne({
    where: {
      origin_city_id: origin,
      destination_city_id: destination,
      weight: weight,
      courier: courier,
      expires_at: { $gt: new Date() },
    },
  });

  if (cached) {
    return JSON.parse(cached.cost_data);
  }

  // Call RajaOngkir API
  try {
    const response = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin: origin,
        destination: destination,
        weight: weight,
        courier: courier,
      },
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (response.data.rajaongkir.status.code !== 200) {
      throw new Error(response.data.rajaongkir.status.description);
    }

    const costs = response.data.rajaongkir.results[0].costs;

    // Cache results for 24 hours
    await db.shipping_costs_cache.create({
      origin_city_id: origin,
      destination_city_id: destination,
      courier: courier,
      weight: weight,
      cost_data: JSON.stringify(costs),
      cached_at: new Date(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return costs;
  } catch (error) {
    console.error("RajaOngkir API error:", error);
    throw new Error("Failed to calculate shipping cost");
  }
}
```

#### City/Province Data

```javascript
async function getProvinces() {
  // Check cache
  const cached = await redis.get("rajaongkir:provinces");
  if (cached) return JSON.parse(cached);

  const response = await axios.get(
    "https://api.rajaongkir.com/starter/province",
    {
      headers: { key: process.env.RAJAONGKIR_API_KEY },
    },
  );

  const provinces = response.data.rajaongkir.results;

  // Cache for 7 days (province data rarely changes)
  await redis.setex(
    "rajaongkir:provinces",
    7 * 24 * 60 * 60,
    JSON.stringify(provinces),
  );

  return provinces;
}

async function getCities(provinceId) {
  const cacheKey = `rajaongkir:cities:${provinceId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const response = await axios.get("https://api.rajaongkir.com/starter/city", {
    params: { province: provinceId },
    headers: { key: process.env.RAJAONGKIR_API_KEY },
  });

  const cities = response.data.rajaongkir.results;

  // Cache for 7 days
  await redis.setex(cacheKey, 7 * 24 * 60 * 60, JSON.stringify(cities));

  return cities;
}
```

---

## 6. Testing Strategy

### 6.1 Unit Testing

**Framework:** Jest + Testing Library  
**Coverage Target:** Minimum 70%

**Focus Areas:**

- Utility functions
- API service modules
- Business logic functions
- React components
- Custom hooks

**Example:**

```javascript
describe("Cart Utils", () => {
  test("should calculate cart subtotal correctly", () => {
    const cartItems = [
      { price: 100000, quantity: 2 },
      { price: 50000, quantity: 1 },
    ];
    expect(calculateSubtotal(cartItems)).toBe(250000);
  });
});
```

### 6.2 Integration Testing

**Framework:** Jest + Supertest

**Focus Areas:**

- API endpoints
- Database operations
- External API integrations (mocked)
- Authentication flows

**Example:**

```javascript
describe("POST /api/auth/login", () => {
  test("should return token on valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### 6.3 End-to-End Testing

**Framework:** Playwright or Cypress

**Critical User Flows:**

1. User registration & login
2. Product browsing & search
3. Add to cart & update quantity
4. Complete checkout process
5. Payment process (Midtrans sandbox)
6. Order tracking
7. Review submission

**Example:**

```javascript
test("Complete checkout flow", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // Add product to cart
  await page.goto("/products/meja-kayu");
  await page.click('button:has-text("Add to Cart")');

  // Checkout
  await page.goto("/cart");
  await page.click('button:has-text("Checkout")');

  // Select address
  await page.click('[data-testid="address-1"]');
  await page.click('button:has-text("Continue")');

  // Select shipping
  await page.click('[data-testid="shipping-jne-reg"]');
  await page.click('button:has-text("Continue")');

  // Select payment
  await page.click('[data-testid="payment-bca"]');
  await page.click('button:has-text("Pay Now")');

  // Verify redirect to Midtrans
  await expect(page).toHaveURL(/.*midtrans.*/);
});
```

### 6.4 Manual Testing

**Cross-Browser Testing:**

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Responsive Testing:**

- Mobile (375px, 414px)
- Tablet (768px, 1024px)
- Desktop (1280px, 1920px)

**Accessibility Testing:**

- Keyboard navigation
- Screen reader compatibility (NVDA, JAWS)
- Color contrast
- ARIA labels

**Payment Testing:**

- Test all payment methods in Midtrans sandbox
- Test payment success/failure scenarios
- Verify webhook handling

---

## 7. Deployment Strategy

### 7.1 Environment Setup

#### Development

- **Environment:** Local machine
- **Database:** Docker Compose for MariaDB
- **ERP:** Odoo sandbox account
- **Payment:** Midtrans sandbox
- **Shipping:** RajaOngkir API (test mode)

#### Staging

- **Environment:** VPS or staging server
- **Database:** MariaDB (staging instance)
- **ERP:** Odoo sandbox
- **Payment:** Midtrans sandbox
- **Purpose:** Client review & final testing

#### Production

**Option 1: cPanel Hosting**

- Frontend (Next.js) + Backend (Express.js) + Database (MariaDB)
- All hosted on cPanel

**Option 2: Hybrid (Recommended)**

- Frontend: Vercel (Next.js optimized)
- Backend: VPS (Express.js)
- Database: cPanel or managed MariaDB

- **ERP:** Odoo.com production account
- **Payment:** Midtrans production
- **Shipping:** RajaOngkir API (production)

### 7.2 CI/CD Pipeline

**Git Workflow:**

```
feature/* → develop → staging → main → production
```

- **feature branches:** Development work
- **develop:** Integration branch
- **staging:** Staging environment
- **main:** Production-ready code

**Pipeline Steps:**

1. **Code Push** to branch
2. **Linting** - ESLint checks
3. **Testing** - Run Jest tests
4. **Build** - Build Next.js & Express.js
5. **Deploy** to target environment:
   - `feature/*` → Dev environment (optional)
   - `develop` → Staging
   - `main` → Production

**Tools:**

- GitHub Actions or GitLab CI/CD
- Automated deployment scripts

**Example GitHub Action:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy
        run: npm run deploy:production
```

### 7.3 Monitoring & Logging

**Uptime Monitoring:**

- UptimeRobot or Pingdom
- Monitor critical endpoints
- Alert on downtime

**Error Tracking:**

- Sentry (optional)
- Track JavaScript errors
- Track API errors
- Performance monitoring

**Application Logs:**

- Winston or Pino for structured logging
- Log rotation
- Centralized logging (optional)

**Performance Monitoring:**

- Lighthouse CI
- Core Web Vitals tracking
- API response time monitoring

**Database Monitoring:**

- Query performance
- Connection pool status
- Slow query logs

---

## 8. Project Timeline

**Total Duration:** ~19 weeks (4.5 months)

### Phase 1: Foundation (4 weeks)

**Week 1-2:**

- Turborepo setup & configuration
- Database schema design & implementation
- Odoo integration setup (authentication, basic CRUD)
- Development environment setup

**Week 3-4:**

- Authentication system (login, register, forgot password)
- User profile & multi-address management
- Admin panel foundation & user management
- JWT & session management

### Phase 2: Product & Catalog (4 weeks)

**Week 5-6:**

- Product listing & detail pages
- Product variants system
- Stock synchronization from Odoo
- Search & filtering functionality

**Week 7-8:**

- Shopping cart implementation
- Wishlist functionality
- Product reviews & ratings
- Product image gallery & zoom

### Phase 3: Checkout & Payment (3 weeks)

**Week 9-10:**

- Checkout flow (multi-step)
- Shipping cost calculation (RajaOngkir)
- Voucher system
- Address selection & management

**Week 11:**

- Midtrans payment integration
- Order creation & Odoo synchronization
- Email notification system
- Payment webhook handling

### Phase 4: CMS & Content (3 weeks)

**Week 12:**

- CMS settings module
- Static pages editor
- Homepage banners & carousel
- SEO optimization

**Week 13:**

- Popup system
- Footer widgets
- Trust badges
- Flash sale functionality

**Week 14:**

- FAQ module
- Newsletter system
- Analytics & tracking
- Content finalization

### Phase 5: Admin Panel (2 weeks)

**Week 15-16:**

- Order management interface
- Product visibility control
- Voucher management
- Review moderation
- CMS admin UI refinement
- Reports & analytics dashboard

### Phase 6: Testing & Polish (2 weeks)

**Week 17:**

- Unit & integration testing
- E2E testing setup & execution
- Bug fixes
- Performance optimization

**Week 18:**

- SEO optimization
- Accessibility improvements
- Security audit
- Final testing
- Documentation

### Phase 7: Deployment (1 week)

**Week 19:**

- Staging deployment
- Client review & feedback
- Production deployment
- Data migration (if needed)
- Go-live & monitoring

---

## 9. Success Metrics (KPIs)

### 9.1 Technical KPIs

| Metric                | Target          |
| --------------------- | --------------- |
| **Page Load Time**    | < 3 seconds     |
| **API Response Time** | < 500ms         |
| **Uptime**            | 99.9%           |
| **Critical Bugs**     | 0 in production |
| **Test Coverage**     | > 70%           |
| **Lighthouse Score**  | > 90            |
| **Core Web Vitals**   | "Good" rating   |

### 9.2 Business KPIs

| Metric                       | Target          |
| ---------------------------- | --------------- |
| **Conversion Rate**          | > 2%            |
| **Cart Abandonment Rate**    | < 70%           |
| **Average Order Value**      | Track & improve |
| **Customer Retention Rate**  | > 30%           |
| **Product View to Purchase** | > 5%            |

### 9.3 User Experience KPIs

| Metric                             | Target  |
| ---------------------------------- | ------- |
| **Mobile Usability Score**         | > 95    |
| **Accessibility Score**            | > 90    |
| **Time to First Byte (TTFB)**      | < 800ms |
| **First Contentful Paint (FCP)**   | < 1.8s  |
| **Largest Contentful Paint (LCP)** | < 2.5s  |

---

## 10. Future Enhancements (Phase 2)

### Immediate Priorities

1. **Mobile App** - React Native mobile application
2. **Live Chat** - Customer support chat (Zendesk, Intercom, or custom)
3. **Loyalty Program** - Points & rewards system
4. **Product Recommendations** - AI-powered product suggestions

### Medium-Term Enhancements

5. **Advanced Analytics** - Google Analytics 4 integration, custom dashboards
6. **Multi-language Support** - i18n implementation (English, Indonesian)
7. **Multi-currency** - Support for USD, SGD, etc.
8. **Social Login** - Login with Google, Facebook, Apple
9. **Progressive Web App (PWA)** - Installable web app with offline support

### Long-Term Enhancements

10. **Subscription Products** - Recurring orders & subscriptions
11. **Gift Cards** - Purchase & redeem gift cards
12. **Product Bundles** - Bundle deals & package offers
13. **Pre-order System** - Allow pre-orders for upcoming products
14. **Affiliate Program** - Referral & commission system
15. **Advanced Search** - Elasticsearch integration for better search
16. **Virtual Try-On** - AR features for product visualization
17. **Marketplace** - Multi-vendor support
18. **B2B Features** - Wholesale pricing, bulk orders

---

## Appendix

### A. Glossary

| Term           | Definition                                     |
| -------------- | ---------------------------------------------- |
| **Odoo**       | Open-source ERP system for business management |
| **Midtrans**   | Indonesian payment gateway service             |
| **RajaOngkir** | Shipping cost calculation API for Indonesia    |
| **Turborepo**  | High-performance monorepo build system         |
| **MariaDB**    | MySQL-compatible relational database           |
| **cPanel**     | Web hosting control panel                      |
| **SSR**        | Server-Side Rendering                          |
| **CSR**        | Client-Side Rendering                          |
| **JWT**        | JSON Web Token for authentication              |
| **RBAC**       | Role-Based Access Control                      |

### B. References

- [Odoo API Documentation](https://www.odoo.com/documentation/)
- [Midtrans Documentation](https://docs.midtrans.com/)
- [RajaOngkir Documentation](https://rajaongkir.com/dokumentasi)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)

---

**Document Version:** 1.0  
**Last Updated:** January 21, 2026  
**Status:** Draft

**Approval:**

- [ ] Project Manager
- [ ] Tech Lead
- [ ] Client/Stakeholder

---

_This PRD is a living document and will be updated as requirements evolve throughout the project lifecycle._
