# API Specification

**Ansania E-Commerce Platform - REST API Documentation**

**Version:** 1.0  
**Base URL:** `http://localhost:5000/api` (Development)  
**Base URL:** `https://api.ansania.com/api` (Production)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Codes](#error-codes)
4. [Rate Limiting](#rate-limiting)
5. [Endpoints](#endpoints)
   - [Authentication](#auth-endpoints)
   - [User Management](#user-endpoints)
   - [Products](#product-endpoints)
   - [Cart](#cart-endpoints)
   - [Checkout](#checkout-endpoints)
   - [Orders](#order-endpoints)
   - [Reviews](#review-endpoints)
   - [Wishlist](#wishlist-endpoints)
   - [Vouchers](#voucher-endpoints)

---

## Authentication

### JWT Bearer Token

Most endpoints require authentication using JWT tokens.

**Header Format:**

```
Authorization: Bearer <token>
```

**Token Lifecycle:**

- **Access Token:** 1 hour expiry
- **Refresh Token:** 7 days expiry

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2026-02-03T10:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details (optional)
  },
  "meta": {
    "timestamp": "2026-02-03T10:00:00Z"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

## Error Codes

| Code                  | HTTP Status | Description                                    |
| --------------------- | ----------- | ---------------------------------------------- |
| `VALIDATION_ERROR`    | 400         | Request validation failed                      |
| `UNAUTHORIZED`        | 401         | Authentication required or invalid token       |
| `FORBIDDEN`           | 403         | Insufficient permissions                       |
| `NOT_FOUND`           | 404         | Resource not found                             |
| `CONFLICT`            | 409         | Resource already exists                        |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests                              |
| `INTERNAL_ERROR`      | 500         | Server error                                   |
| `SERVICE_UNAVAILABLE` | 503         | External service unavailable (Odoo, Doku, JNT) |

---

## Rate Limiting

- **Anonymous:** 100 requests per 15 minutes
- **Authenticated:** 1000 requests per 15 minutes

**Headers:**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1675564800
```

---

## Endpoints

## Auth Endpoints

### POST /auth/register

Register a new user account.

**Authentication:** None required

**Request Body:**

```json
{
  "email": "user@example.com",
  "phone": "+628123456789",
  "full_name": "John Doe",
  "password": "SecurePass123!"
}
```

**Response:** `201 Created`

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

---

### POST /auth/login

Login with email/phone and password.

**Authentication:** None required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "remember_me": true
}
```

**Response:** `200 OK`

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

---

### POST /auth/refresh

Refresh access token using refresh token.

**Authentication:** None required

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### POST /auth/forgot-password

Request password reset email.

**Authentication:** None required

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

---

### POST /auth/reset-password

Reset password using token from email.

**Authentication:** None required

**Request Body:**

```json
{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePass123!"
}
```

**Response:** `200 OK`

---

## User Endpoints

### GET /user/profile

Get current user profile.

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "phone": "+628123456789",
    "full_name": "John Doe",
    "email_verified": true,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

### PUT /user/profile

Update user profile.

**Authentication:** Required

**Request Body:**

```json
{
  "full_name": "John Doe Updated",
  "phone": "+628123456789"
}
```

**Response:** `200 OK`

---

### GET /user/addresses

Get all user addresses.

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": 1,
        "label": "Home",
        "recipient_name": "John Doe",
        "phone": "+628123456789",
        "address_line1": "Jl. Example No. 123",
        "city": "Jakarta Selatan",
        "province": "DKI Jakarta",
        "postal_code": "12345",
        "is_default": true
      }
    ]
  }
}
```

---

### POST /user/addresses

Add new address.

**Authentication:** Required

**Request Body:**

```json
{
  "label": "Office",
  "recipient_name": "John Doe",
  "phone": "+628123456789",
  "address_line1": "Jl. Office Tower",
  "address_line2": "Suite 100",
  "city": "Jakarta Pusat",
  "district": "Menteng",
  "province": "DKI Jakarta",
  "postal_code": "10110",
  "is_default": false
}
```

**Response:** `201 Created`

---

### PUT /user/addresses/:id

Update address.

**Authentication:** Required

**URL Parameters:**

- `id` (integer) - Address ID

**Request Body:** Same as POST /user/addresses

**Response:** `200 OK`

---

### DELETE /user/addresses/:id

Delete address.

**Authentication:** Required

**URL Parameters:**

- `id` (integer) - Address ID

**Response:** `204 No Content`

---

### PUT /user/addresses/:id/set-default

Set address as default.

**Authentication:** Required

**URL Parameters:**

- `id` (integer) - Address ID

**Response:** `200 OK`

---

## Product Endpoints

### GET /products

Get product list with filters and pagination.

**Authentication:** Optional

**Query Parameters:**

- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `sort` (string) - Sort by: `newest`, `price_asc`, `price_desc`, `popular`, `rating`
- `category` (string) - Category slug
- `color` (string) - Color filter
- `finishing` (string) - Finishing filter
- `size` (string) - Size filter
- `price_min` (number) - Minimum price
- `price_max` (number) - Maximum price
- `rating_min` (number) - Minimum rating (1-5)
- `search` (string) - Search query
- `in_stock` (boolean) - Only show in-stock items

**Example:**

```
GET /products?page=1&limit=20&category=furniture&price_min=100000&in_stock=true
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "slug": "dining-table-oak",
        "name": "Oak Dining Table",
        "short_description": "Premium oak dining table",
        "selling_price": 3500000,
        "compare_price": 4000000,
        "images": ["https://cdn.example.com/images/table1.jpg"],
        "rating": 4.5,
        "total_reviews": 120,
        "is_featured": true,
        "stock_status": "in_stock"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### GET /products/:slug

Get product detail by slug.

**Authentication:** Optional

**URL Parameters:**

- `slug` (string) - Product slug

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "slug": "dining-table-oak",
      "name": "Oak Dining Table",
      "description": "Full HTML description...",
      "short_description": "Premium oak dining table",
      "selling_price": 3500000,
      "compare_price": 4000000,
      "images": [
        {
          "id": 1,
          "url": "https://cdn.example.com/images/table1.jpg",
          "alt": "Oak table front view",
          "is_primary": true
        }
      ],
      "variants": [
        {
          "id": 101,
          "sku": "TABLE-OAK-NAT-L",
          "color": "Natural",
          "finishing": "Matte",
          "size": "Large",
          "price": 3500000,
          "stock": 10,
          "is_visible": true
        }
      ],
      "categories": [
        {
          "id": 1,
          "name": "Furniture",
          "slug": "furniture"
        }
      ],
      "rating": 4.5,
      "total_reviews": 120,
      "weight": 25000,
      "dimensions": {
        "length": 180,
        "width": 90,
        "height": 75
      }
    }
  }
}
```

---

### GET /products/:id/reviews

Get product reviews.

**Authentication:** Optional

**URL Parameters:**

- `id` (integer) - Product ID

**Query Parameters:**

- `page` (integer, default: 1)
- `limit` (integer, default: 10)
- `sort` (string) - `recent`, `highest`, `lowest`, `helpful`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "user": {
          "name": "John D.",
          "avatar": "https://..."
        },
        "rating": 5,
        "title": "Excellent quality!",
        "comment": "Very satisfied with the product...",
        "images": [
          "https://cdn.example.com/review1.jpg"
        ],
        "is_verified_purchase": true,
        "helpful_count": 15,
        "created_at": "2026-01-15T10:00:00Z"
      }
    ],
    "summary": {
      "average_rating": 4.5,
      "total_reviews": 120,
      "rating_distribution": {
        "5": 80,
        "4": 25,
        "3": 10,
        "2": 3,
        "1": 2
      }
    },
    "pagination": { ... }
  }
}
```

---

## Cart Endpoints

### GET /cart

Get current cart (session for guest, user cart if authenticated).

**Authentication:** Optional

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "cart": {
      "id": 1,
      "items": [
        {
          "id": 1,
          "product": {
            "id": 1,
            "name": "Oak Dining Table",
            "slug": "dining-table-oak",
            "image": "https://..."
          },
          "variant": {
            "id": 101,
            "sku": "TABLE-OAK-NAT-L",
            "color": "Natural",
            "finishing": "Matte",
            "size": "Large"
          },
          "quantity": 2,
          "price": 3500000,
          "subtotal": 7000000,
          "stock_available": 10
        }
      ],
      "subtotal": 7000000,
      "discount_amount": 0,
      "voucher": null,
      "total": 7000000
    }
  }
}
```

---

### POST /cart/items

Add item to cart.

**Authentication:** Optional

**Request Body:**

```json
{
  "product_variant_id": 101,
  "quantity": 2
}
```

**Response:** `201 Created`

---

### PUT /cart/items/:id

Update cart item quantity.

**Authentication:** Optional

**URL Parameters:**

- `id` (integer) - Cart item ID

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

---

### DELETE /cart/items/:id

Remove item from cart.

**Authentication:** Optional

**URL Parameters:**

- `id` (integer) - Cart item ID

**Response:** `204 No Content`

---

### POST /cart/apply-voucher

Apply voucher code to cart.

**Authentication:** Required

**Request Body:**

```json
{
  "code": "WELCOME10"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "voucher": {
      "code": "WELCOME10",
      "discount_type": "percentage",
      "discount_value": 10,
      "discount_amount": 700000
    },
    "cart": { ... }
  }
}
```

---

### DELETE /cart/remove-voucher

Remove applied voucher.

**Authentication:** Required

**Response:** `200 OK`

---

## Checkout Endpoints

### POST /checkout/validate

Validate cart before checkout.

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "valid": true,
    "issues": []
  }
}
```

**Or with issues:**

```json
{
  "success": true,
  "data": {
    "valid": false,
    "issues": [
      {
        "item_id": 1,
        "type": "out_of_stock",
        "message": "Product is out of stock"
      }
    ]
  }
}
```

---

### POST /checkout/calculate-shipping

Calculate shipping cost.

**Authentication:** Required

**Request Body:**

```json
{
  "shipping_address_id": 1,
  "courier": "jnt"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "shipping_options": [
      {
        "service": "REG",
        "description": "Regular Service",
        "cost": 25000,
        "etd": "2-3 days"
      },
      {
        "service": "YES",
        "description": "One Day Service",
        "cost": 50000,
        "etd": "1 day"
      }
    ]
  }
}
```

---

### POST /checkout/create-order

Create order and initiate payment.

**Authentication:** Required

**Request Body:**

```json
{
  "shipping_address_id": 1,
  "shipping_courier": "jnt",
  "shipping_service": "REG",
  "payment_method": "virtual_account",
  "payment_channel": "bca",
  "customer_note": "Please pack carefully"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "order": {
      "order_number": "ORD-20260203-001",
      "total_amount": 7025000,
      "status": "pending_payment"
    },
    "payment": {
      "transaction_id": "TRX-123456",
      "payment_url": "https://pay.doku.com/...",
      "payment_token": "token123",
      "expired_at": "2026-02-04T10:00:00Z"
    }
  }
}
```

---

### POST /checkout/payment-webhook

Doku payment webhook handler (called by Doku).

**Authentication:** Signature verification

**Request Body:**

```json
{
  "transaction_id": "TRX-123456",
  "status": "success",
  "payment_channel": "bca_va",
  "amount": 7025000,
  "signature": "..."
}
```

**Response:** `200 OK`

---

## Order Endpoints

### GET /orders

Get user order history.

**Authentication:** Required

**Query Parameters:**

- `page` (integer, default: 1)
- `limit` (integer, default: 10)
- `status` (string) - Filter by status: `pending_payment`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`
- `sort` (string) - `newest`, `oldest`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_number": "ORD-20260203-001",
        "created_at": "2026-02-03T10:00:00Z",
        "status": "processing",
        "payment_status": "paid",
        "total_amount": 7025000,
        "items_preview": [
          {
            "product_name": "Oak Dining Table",
            "quantity": 2,
            "image": "https://..."
          }
        ]
      }
    ],
    "pagination": { ... }
  }
}
```

---

### GET /orders/:order_number

Get order detail.

**Authentication:** Required

**URL Parameters:**

- `order_number` (string) - Order number

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "order": {
      "order_number": "ORD-20260203-001",
      "status": "processing",
      "payment_status": "paid",
      "created_at": "2026-02-03T10:00:00Z",
      "paid_at": "2026-02-03T10:05:00Z",
      "items": [
        {
          "product_name": "Oak Dining Table",
          "variant_name": "Natural / Matte / Large",
          "sku": "TABLE-OAK-NAT-L",
          "quantity": 2,
          "price": 3500000,
          "subtotal": 7000000,
          "image": "https://..."
        }
      ],
      "shipping": {
        "recipient_name": "John Doe",
        "phone": "+628123456789",
        "address": "Jl. Example No. 123, Jakarta Selatan, DKI Jakarta 12345",
        "courier": "JNT",
        "service": "REG",
        "tracking_number": "JT123456789",
        "cost": 25000
      },
      "payment": {
        "method": "virtual_account",
        "channel": "BCA",
        "transaction_id": "TRX-123456",
        "amount": 7025000
      },
      "summary": {
        "subtotal": 7000000,
        "discount": 0,
        "shipping_cost": 25000,
        "total": 7025000
      }
    }
  }
}
```

---

### PUT /orders/:order_number/cancel

Cancel order.

**Authentication:** Required

**URL Parameters:**

- `order_number` (string) - Order number

**Request Body:**

```json
{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`

---

### GET /orders/:order_number/invoice

Download invoice PDF.

**Authentication:** Required

**URL Parameters:**

- `order_number` (string) - Order number

**Response:** `200 OK` (PDF file)

---

## Review Endpoints

### POST /products/:id/reviews

Create product review (verified purchase only).

**Authentication:** Required

**URL Parameters:**

- `id` (integer) - Product ID

**Request Body:**

```json
{
  "order_id": 1,
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Very satisfied with the quality...",
  "images": ["base64_image_data_1", "base64_image_data_2"]
}
```

**Response:** `201 Created`

---

## Wishlist Endpoints

### GET /wishlist

Get user wishlist.

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Oak Dining Table",
          "slug": "dining-table-oak",
          "price": 3500000,
          "image": "https://...",
          "stock_status": "in_stock"
        },
        "variant": {
          "id": 101,
          "color": "Natural",
          "finishing": "Matte",
          "size": "Large"
        },
        "added_at": "2026-02-01T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /wishlist

Add item to wishlist.

**Authentication:** Required

**Request Body:**

```json
{
  "product_id": 1,
  "product_variant_id": 101
}
```

**Response:** `201 Created`

---

### DELETE /wishlist/:id

Remove item from wishlist.

**Authentication:** Required

**URL Parameters:**

- `id` (integer) - Wishlist item ID

**Response:** `204 No Content`

---

### POST /wishlist/:id/move-to-cart

Move wishlist item to cart.

**Authentication:** Required

**URL Parameters:**

- `id` (integer) - Wishlist item ID

**Request Body:**

```json
{
  "quantity": 1
}
```

**Response:** `200 OK`

---

## Voucher Endpoints

### GET /vouchers/available

Get available vouchers for current user.

**Authentication:** Required

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "vouchers": [
      {
        "code": "WELCOME10",
        "name": "Welcome Discount 10%",
        "description": "Get 10% off for your first order",
        "discount_type": "percentage",
        "discount_value": 10,
        "max_discount_amount": 100000,
        "min_purchase_amount": 500000,
        "start_date": "2026-02-01T00:00:00Z",
        "end_date": "2026-02-28T23:59:59Z",
        "usage_remaining": 1
      }
    ]
  }
}
```

---

### POST /vouchers/validate

Validate voucher code.

**Authentication:** Required

**Request Body:**

```json
{
  "code": "WELCOME10",
  "cart_total": 700000
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "valid": true,
    "voucher": {
      "code": "WELCOME10",
      "discount_type": "percentage",
      "discount_value": 10,
      "discount_amount": 70000
    }
  }
}
```

**Or invalid:**

```json
{
  "success": false,
  "error": "Voucher has expired",
  "code": "VOUCHER_EXPIRED"
}
```

---

## Postman Collection

Import this API spec into Postman for easy testing:
[Download Postman Collection](./postman_collection.json) (generate using openapi-to-postman)

---

## Webhooks

### Doku Payment Webhook

- **URL:** `POST /api/checkout/payment-webhook`
- **Authentication:** HMAC signature verification
- **Events:** `payment.success`, `payment.failed`, `payment.expired`

### Odoo Sync Webhooks (Optional)

Configure Odoo to send webhooks on:

- Product updates
- Stock changes
- Order status updates

---

## Testing

Use these test credentials in development:

**Test User:**

- Email: `test@example.com`
- Password: `TestPass123!`

**Test Voucher Codes:**

- `WELCOME10` - 10% discount
- `FREESHIP` - Free shipping

**Test Payment (Doku Sandbox):**

- Virtual Account will generate test account numbers

---

**Last Updated:** 2026-02-03  
**Maintained by:** Backend Team
