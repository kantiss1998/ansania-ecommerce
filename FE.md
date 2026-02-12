# Struktur Halaman Frontend E-commerce

Berdasarkan analisis API routes, berikut adalah daftar lengkap halaman yang dapat dibuat beserta rincian kontennya.

## 📱 Halaman Utama & Publik

### 1. Homepage (/)

**Konten:**

- Hero Banner (dari CMS)
- Flash Sale Section (dari flashSale_routes)
- Featured Products
- Category Grid
- Trending Products (dari stats_routes)
- Banner Promosi (dari CMS)
- Newsletter Subscription

**Data yang dibutuhkan:**

- `GET /api/cms/banners` - Banner utama
- `GET /api/flash-sales/active` - Flash sale aktif
- `GET /api/products` - Produk featured
- `GET /api/stats/trending-products` - Produk trending

---

### 2. Product Listing Page (/products)

**Konten:**

- Product Grid/List View
- Filter Sidebar:
  - Category
  - Price Range
  - Colors (dari attribute_routes)
  - Sizes (dari attribute_routes)
  - Finishings (dari attribute_routes)
  - Rating
- Sort Options (price, popularity, newest)
- Pagination
- Active Filters Display
- Search Results Count

**Data yang dibutuhkan:**

- `GET /api/products?category=&minPrice=&maxPrice=&color=&size=&sort=`
- `GET /api/attributes/colors`
- `GET /api/attributes/sizes`
- `GET /api/attributes/finishings`

---

### 3. Product Detail Page (/products/:slug)

**Konten:**

- Product Image Gallery
- Product Title & SKU
- Price & Discount Info
- Flash Sale Badge (jika ada)
- Stock Status
- Product Attributes:
  - Color Selector
  - Size Selector
  - Finishing Selector
- Quantity Selector
- Add to Cart Button
- Add to Wishlist Button
- Product Description
- Specifications Table
- Reviews Section:
  - Overall Rating
  - Review List
  - Write Review Button (untuk user login)
- Related Products
- Recently Viewed Products

**Data yang dibutuhkan:**

- `GET /api/products/:slug`
- `GET /api/reviews/:productId`
- `POST /api/stats/view/:productId` - Track view

**Actions:**

- `POST /api/cart/items` - Add to cart
- `POST /api/wishlist` - Add to wishlist
- `POST /api/reviews` - Submit review (authenticated)

---

### 4. Search Results Page (/search?q=)

**Konten:**

- Search Query Display
- Search Results Grid
- Filter Options (sama seperti Product Listing)
- Sort Options
- "Did you mean?" suggestions
- No Results State
- Popular Searches

**Data yang dibutuhkan:**

- `GET /api/products?search=query`
- `GET /api/stats/top-searches`
- `POST /api/stats/search` - Record search

---

### 5. Flash Sale Page (/flash-sale/:id)

**Konten:**

- Flash Sale Header dengan Countdown Timer
- Flash Sale Products Grid
- Discount Percentage
- Original Price vs Sale Price
- Stock Progress Bar
- Terms & Conditions

**Data yang dibutuhkan:**

- `GET /api/flash-sales/:id`
- `GET /api/flash-sales/active`

---

## 🔐 Authentication Pages

### 6. Login Page (/login)

**Konten:**

- Email Input
- Password Input
- Remember Me Checkbox
- Login Button
- Forgot Password Link
- Register Link
- Social Login Options (opsional)

**Actions:**

- `POST /api/auth/login`

---

### 7. Register Page (/register)

**Konten:**

- Full Name Input
- Email Input
- Phone Input
- Password Input
- Confirm Password Input
- Terms & Conditions Checkbox
- Register Button
- Login Link

**Actions:**

- `POST /api/auth/register`

---

### 8. Forgot Password Page (/forgot-password)

**Konten:**

- Email Input
- Instructions Text
- Submit Button
- Back to Login Link

**Actions:**

- `POST /api/auth/forgot-password`

---

### 9. Reset Password Page (/reset-password?token=)

**Konten:**

- New Password Input
- Confirm Password Input
- Submit Button
- Password Requirements Info

**Actions:**

- `POST /api/auth/reset-password`

---

## 🛒 Shopping Flow Pages

### 10. Shopping Cart Page (/cart)

**Konten:**

- Cart Items List:
  - Product Image
  - Product Name
  - Selected Attributes
  - Price
  - Quantity Selector
  - Remove Button
  - Subtotal
- Voucher Code Input
- Applied Voucher Display
- Cart Summary:
  - Subtotal
  - Discount (dari voucher)
  - Estimated Shipping
  - Total
- Continue Shopping Button
- Proceed to Checkout Button
- Empty Cart State

**Data yang dibutuhkan:**

- `GET /api/cart`

**Actions:**

- `POST /api/cart/items` - Add item
- `PUT /api/cart/items/:id` - Update quantity
- `DELETE /api/cart/items/:id` - Remove item
- `POST /api/voucher/apply` - Apply voucher
- `DELETE /api/voucher/remove` - Remove voucher

---

### 11. Checkout Page (/checkout)

**Konten:**

- Step Indicator (Shipping → Payment → Review)
- Shipping Address Section:
  - Saved Addresses List
  - Add New Address Button
  - Address Form
- Shipping Method Selection:
  - Courier Options
  - Delivery Time
  - Shipping Cost
- Order Summary Sidebar:
  - Items List
  - Subtotal
  - Shipping Cost
  - Voucher Discount
  - Total
- Payment Method Selection
- Order Notes (optional)
- Place Order Button

**Data yang dibutuhkan:**

- `GET /api/addresses` - User addresses
- `POST /api/checkout/shipping` - Calculate shipping rates
- `GET /api/cart` - Cart items

**Actions:**

- `POST /api/checkout/order` - Create order
- `POST /api/addresses` - Add new address

---

### 12. Payment Page (/payment/:orderNumber)

**Konten:**

- Order Information
- Payment Instructions
- Payment Methods (Doku integration)
- Total Amount
- Payment Countdown Timer
- Cancel Order Button

**Data yang dibutuhkan:**

- `GET /api/payment/status/:orderNumber`

---

### 13. Payment Success Page (/payment/success)

**Konten:**

- Success Icon/Animation
- Order Number
- Total Paid
- Estimated Delivery
- Track Order Button
- Continue Shopping Button
- Order Summary

---

### 14. Payment Failed Page (/payment/failed)

**Konten:**

- Failed Icon
- Error Message
- Order Number
- Retry Payment Button
- Contact Support Link
- Back to Cart Button

---

## 👤 User Account Pages

### 15. Profile Page (/account/profile)

**Konten:**

- Profile Header with Avatar
- Personal Information Form:
  - Full Name
  - Email (read-only)
  - Phone Number
  - Date of Birth
  - Gender
- Save Changes Button
- Account Statistics:
  - Total Orders
  - Total Spent
  - Member Since

**Data yang dibutuhkan:**

- `GET /api/profile`

**Actions:**

- `PUT /api/profile` - Update profile

---

### 16. Change Password Page (/account/security)

**Konten:**

- Current Password Input
- New Password Input
- Confirm New Password Input
- Password Requirements
- Change Password Button

**Actions:**

- `PUT /api/profile/password`

---

### 17. Address Book Page (/account/addresses)

**Konten:**

- Address Cards List:
  - Full Name
  - Phone
  - Full Address
  - Default Badge
  - Edit Button
  - Delete Button
- Add New Address Button
- Empty State

**Data yang dibutuhkan:**

- `GET /api/addresses`

**Actions:**

- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

---

### 18. Order History Page (/account/orders)

**Konten:**

- Order Filter:
  - All Orders
  - Pending Payment
  - Processing
  - Shipped
  - Completed
  - Cancelled
- Order Cards List:
  - Order Number
  - Order Date
  - Status Badge
  - Products Preview
  - Total Amount
  - Action Buttons (View Detail, Track, Review)
- Pagination
- Empty State per Status

**Data yang dibutuhkan:**

- Endpoint belum ada di routes (perlu ditambahkan)
- Suggested: `GET /api/orders?status=&page=`

---

### 19. Order Detail Page (/account/orders/:orderNumber)

**Konten:**

- Order Header:
  - Order Number
  - Order Date
  - Status Timeline
- Shipping Address
- Payment Method
- Items Ordered:
  - Product Details
  - Quantity
  - Price
  - Review Button (jika completed)
- Order Summary:
  - Subtotal
  - Shipping
  - Discount
  - Total
- Tracking Information (jika shipped)
- Invoice Download Button
- Contact Support Button

**Data yang dibutuhkan:**

- Suggested: `GET /api/orders/:orderNumber`

---

### 20. Wishlist Page (/account/wishlist)

**Konten:**

- Wishlist Items Grid:
  - Product Image
  - Product Name
  - Price
  - Stock Status
  - Add to Cart Button
  - Remove from Wishlist Button
- Empty Wishlist State
- Share Wishlist Button

**Data yang dibutuhkan:**

- `GET /api/wishlist`

**Actions:**

- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist
- `POST /api/cart/items` - Move to cart

---

### 21. Notifications Page (/account/notifications)

**Konten:**

- Notification List:
  - Icon/Type
  - Title
  - Message
  - Timestamp
  - Read/Unread Status
- Mark All as Read Button
- Filter Tabs (All, Unread, Orders, Promotions)
- Empty State

**Data yang dibutuhkan:**

- `GET /api/notifications`

**Actions:**

- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

---

### 22. Reviews & Ratings Page (/account/reviews)

**Konten:**

- My Reviews List:
  - Product Info
  - Rating Given
  - Review Text
  - Review Date
  - Edit Button (jika masih bisa)
- Pending Reviews (produk yang sudah dibeli tapi belum direview)
- Empty State

**Data yang dibutuhkan:**

- Suggested: `GET /api/reviews/my-reviews`

---

## 📄 Static & Information Pages

### 23. About Us Page (/about)

**Konten:**

- Company Story
- Vision & Mission
- Team Members
- Company Timeline
- Contact Information
- Office Locations

**Data yang dibutuhkan:**

- `GET /api/cms/pages/about`

---

### 24. Contact Us Page (/contact)

**Konten:**

- Contact Form:
  - Name
  - Email
  - Subject
  - Message
- Contact Information:
  - Phone Numbers
  - Email
  - Address
  - Social Media
- Business Hours
- Google Maps Embed

**Data yang dibutuhkan:**

- `GET /api/cms/settings` - Contact info

---

### 25. FAQ Page (/faq)

**Konten:**

- Search Bar
- Category Tabs:
  - General
  - Ordering
  - Payment
  - Shipping
  - Returns & Refunds
  - Account
- Accordion FAQ Items:
  - Question
  - Answer
- Still Have Questions Section

**Data yang dibutuhkan:**

- `GET /api/cms/pages/faq`

---

### 26. Terms & Conditions Page (/terms)

**Konten:**

- Last Updated Date
- Table of Contents
- Terms Sections:
  - Introduction
  - User Agreement
  - Product Information
  - Pricing & Payment
  - Shipping & Delivery
  - Returns & Refunds
  - Intellectual Property
  - Limitation of Liability
  - Governing Law

**Data yang dibutuhkan:**

- `GET /api/cms/pages/terms`

---

### 27. Privacy Policy Page (/privacy)

**Konten:**

- Last Updated Date
- Table of Contents
- Privacy Sections:
  - Information Collection
  - Use of Information
  - Data Protection
  - Cookies Policy
  - Third-Party Services
  - User Rights
  - Contact Information

**Data yang dibutuhkan:**

- `GET /api/cms/pages/privacy`

---

### 28. Shipping & Delivery Page (/shipping)

**Konten:**

- Shipping Methods
- Delivery Times by Region
- Shipping Costs
- International Shipping
- Order Tracking Guide
- Shipping FAQs

**Data yang dibutuhkan:**

- `GET /api/cms/pages/shipping`

---

### 29. Returns & Refunds Page (/returns)

**Konten:**

- Return Policy Overview
- Return Eligibility
- Return Process Steps
- Refund Timeline
- Exchange Policy
- Return Form/Request Button

**Data yang dibutuhkan:**

- `GET /api/cms/pages/returns`

---

### 30. Size Guide Page (/size-guide)

**Konten:**

- Size Chart by Category
- Measurement Guide
- How to Measure Instructions
- Fit Guide
- Size Conversion Table

**Data yang dibutuhkan:**

- `GET /api/cms/pages/size-guide`

---

## 🔧 Utility Pages

### 31. 404 Not Found Page (/404)

**Konten:**

- 404 Illustration
- Error Message
- Search Bar
- Popular Categories Links
- Back to Home Button

---

### 32. 500 Server Error Page (/500)

**Konten:**

- Error Illustration
- Friendly Error Message
- Retry Button
- Contact Support Link
- Back to Home Button

---

### 33. Maintenance Page (/maintenance)

**Konten:**

- Maintenance Illustration
- Maintenance Message
- Expected Return Time
- Social Media Links
- Newsletter Signup

---

## 📊 Summary

### Total Pages: 33+

**Breakdown by Category:**

- **Halaman Utama & Publik:** 5 halaman
- **Authentication:** 4 halaman
- **Shopping Flow:** 4 halaman
- **User Account:** 8 halaman
- **Static & Information:** 8 halaman
- **Utility:** 3 halaman

### Additional Components Needed:

- Header with Navigation
- Footer with Links
- Search Bar Component
- Product Card Component
- Cart Icon with Badge
- User Menu Dropdown
- Mobile Menu
- Breadcrumbs
- Loading States
- Toast Notifications
- Modal Dialogs

### Missing API Endpoints (Perlu ditambahkan):

1. `GET /api/orders` - Get user orders
2. `GET /api/orders/:orderNumber` - Get order detail
3. `GET /api/reviews/my-reviews` - Get user reviews
4. `POST /api/reviews/:id` - Update review
5. `GET /api/cms/pages/:slug` - Sudah ada, perlu dimanfaatkan

### Recommended Additional Pages:

1. **Blog/News Page** - Untuk content marketing
2. **Careers Page** - Untuk recruitment
3. **Store Locator** - Jika ada physical store
4. **Affiliate Program Page** - Untuk program afiliasi
5. **Gift Cards Page** - Untuk fitur gift card
6. **Loyalty Program Page** - Untuk program loyalitas
7. **Compare Products Page** - Untuk membandingkan produk
8. **Sitemap Page** - Untuk SEO

---
