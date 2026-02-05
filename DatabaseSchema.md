-- =====================================================
-- E-COMMERCE DATABASE SCHEMA WITH ODOO INTEGRATION
-- =====================================================

-- =====================================================
-- 1. USER & AUTHENTICATION (Sync with Odoo)
-- =====================================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    odoo_user_id INT UNIQUE NOT NULL COMMENT 'ID dari Odoo',
    odoo_partner_id INT UNIQUE COMMENT 'Partner ID dari Odoo',
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL COMMENT 'Last sync with Odoo',
    INDEX idx_email (email),
    INDEX idx_odoo_user_id (odoo_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    device_info TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token(255)),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. MULTI ADDRESS SHIPPING (Sync with Odoo)
-- =====================================================

CREATE TABLE user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    odoo_address_id INT UNIQUE COMMENT 'Partner address ID dari Odoo',
    label VARCHAR(100) COMMENT 'Rumah, Kantor, dll',
    recipient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    subdistrict VARCHAR(100),
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'Indonesia',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PRODUCTS (Cache from Odoo + CMS Control)
-- =====================================================

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    odoo_product_id INT UNIQUE NOT NULL COMMENT 'Product ID dari Odoo',
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Price dari Odoo (bisa di-override CMS)
    base_price DECIMAL(15, 2) NOT NULL COMMENT 'Harga dari Odoo',
    selling_price DECIMAL(15, 2) NOT NULL COMMENT 'Harga jual (bisa diatur CMS)',
    compare_price DECIMAL(15, 2) COMMENT 'Harga coret',
    
    -- CMS Control
    is_visible BOOLEAN DEFAULT TRUE COMMENT 'Tampilkan di FE (CMS)',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Featured product (CMS)',
    display_order INT DEFAULT 0 COMMENT 'Urutan tampil (CMS)',
    
    -- Meta
    weight DECIMAL(10, 2) COMMENT 'Berat (gram)',
    length DECIMAL(10, 2),
    width DECIMAL(10, 2),
    height DECIMAL(10, 2),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL COMMENT 'Last sync from Odoo',
    
    INDEX idx_slug (slug),
    INDEX idx_sku (sku),
    INDEX idx_is_visible (is_visible),
    INDEX idx_is_featured (is_featured),
    FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. PRODUCT VARIANTS (Cache from Odoo + CMS Control)
-- =====================================================

CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    odoo_variant_id INT UNIQUE NOT NULL COMMENT 'Product Variant ID dari Odoo',
    sku VARCHAR(100) UNIQUE NOT NULL,
    variant_name VARCHAR(255),
    
    -- Attributes (color, finishing, size)
    color VARCHAR(100),
    finishing VARCHAR(100),
    size VARCHAR(50),
    
    -- Price (bisa di-override CMS)
    base_price DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    compare_price DECIMAL(15, 2),
    
    -- Weight (jika beda dengan parent)
    weight DECIMAL(10, 2),
    
    -- CMS Control
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_sku (sku),
    INDEX idx_color (color),
    INDEX idx_finishing (finishing),
    INDEX idx_size (size)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. STOCK/INVENTORY (Sync from Odoo Gudang Online every 30 min)
-- =====================================================

CREATE TABLE product_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_variant_id INT NOT NULL,
    odoo_warehouse_id INT COMMENT 'Gudang Online ID dari Odoo',
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0 COMMENT 'Stock yang di-cart belum checkout',
    available_quantity INT GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    
    last_synced_at TIMESTAMP NULL COMMENT 'Last sync from Odoo (every 30 min)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    INDEX idx_product_variant_id (product_variant_id),
    INDEX idx_available_quantity (available_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. PRODUCT GALLERY (Pure Local - CMS)
-- =====================================================

CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    product_variant_id INT NULL COMMENT 'Null jika untuk product utama',
    image_url VARCHAR(500) NOT NULL,
    image_alt VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_product_variant_id (product_variant_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. PRODUCT CATEGORIES (Cache from Odoo + CMS)
-- =====================================================

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    odoo_category_id INT UNIQUE COMMENT 'Category ID dari Odoo',
    parent_id INT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    
    -- CMS Control
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. VOUCHERS/DISCOUNTS (Pure Local - CMS)
-- =====================================================

CREATE TABLE vouchers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Discount Type
    discount_type ENUM('percentage', 'fixed_amount', 'free_shipping') NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    max_discount_amount DECIMAL(15, 2) COMMENT 'Max discount untuk percentage',
    
    -- Conditions
    min_purchase_amount DECIMAL(15, 2) DEFAULT 0,
    max_usage_total INT COMMENT 'Total usage limit',
    max_usage_per_user INT DEFAULT 1,
    usage_count INT DEFAULT 0,
    
    -- Date range
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    
    -- Applicable to
    applicable_to ENUM('all', 'specific_products', 'specific_categories') DEFAULT 'all',
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_date_range (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE voucher_products (
    voucher_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (voucher_id, product_id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE voucher_categories (
    voucher_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (voucher_id, category_id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE voucher_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NULL COMMENT 'Link to order setelah checkout',
    discount_amount DECIMAL(15, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_voucher_user (voucher_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. SHOPPING CART (Pure Local)
-- =====================================================

CREATE TABLE shopping_carts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL COMMENT 'Null untuk guest cart',
    session_id VARCHAR(255) COMMENT 'Untuk guest user',
    
    -- Cart metadata
    subtotal DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    voucher_id INT NULL,
    
    expires_at TIMESTAMP NULL COMMENT 'Auto clear old carts',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(15, 2) NOT NULL COMMENT 'Price snapshot saat add to cart',
    subtotal DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * price) STORED,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    INDEX idx_cart_id (cart_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. WISHLIST (Pure Local)
-- =====================================================

CREATE TABLE wishlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    product_variant_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id, product_variant_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. ORDERS (Sync to Odoo as Sales Order)
-- =====================================================

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    odoo_sale_order_id INT UNIQUE COMMENT 'Sales Order ID di Odoo setelah sync',
    
    user_id INT NOT NULL,
    
    -- Address snapshot
    shipping_address_id INT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100),
    shipping_province VARCHAR(100),
    shipping_postal_code VARCHAR(10),
    
    -- Order amounts
    subtotal DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    voucher_code VARCHAR(50),
    shipping_cost DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    
    -- Shipping info
    shipping_courier VARCHAR(100) COMMENT 'JNE, SiCepat, dll',
    shipping_service VARCHAR(100) COMMENT 'REG, YES, dll',
    shipping_weight INT COMMENT 'gram',
    shipping_tracking_number VARCHAR(255),
    
    -- Order status
    status ENUM('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending_payment',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    
    -- Notes
    customer_note TEXT,
    admin_note TEXT,
    
    -- Timestamps
    paid_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL COMMENT 'Last sync to Odoo',
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    odoo_order_line_id INT COMMENT 'Sale Order Line ID di Odoo',
    
    product_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    
    -- Snapshot data
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),
    sku VARCHAR(100) NOT NULL,
    
    quantity INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. PAYMENTS (Doku Integration)
-- =====================================================

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    
    -- Payment Gateway
    payment_method VARCHAR(100) NOT NULL COMMENT 'virtual_account, credit_card, ewallet, qris, dll',
    payment_provider VARCHAR(50) DEFAULT 'doku',
    
    -- Doku data
    transaction_id VARCHAR(255) UNIQUE COMMENT 'Invoice number / Transaction ID dari Doku',
    transaction_token VARCHAR(500) COMMENT 'Payment token dari Doku',
    transaction_url VARCHAR(500) COMMENT 'Payment redirect URL dari Doku',
    
    -- Amount
    amount DECIMAL(15, 2) NOT NULL,
    
    -- Status
    status ENUM('pending', 'success', 'failed', 'expired', 'cancelled') DEFAULT 'pending',
    
    -- Response from payment gateway
    payment_response JSON COMMENT 'Full response dari Doku',
    
    -- Timestamps
    expired_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. PRODUCT FILTERS (Pure Local - CMS)
-- =====================================================

CREATE TABLE filter_colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(7),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE filter_finishings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE filter_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. CMS - STATIC CONTENT (Pure Local)
-- =====================================================

CREATE TABLE cms_pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cms_banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    image_mobile_url VARCHAR(500),
    link_url VARCHAR(500),
    target_blank BOOLEAN DEFAULT FALSE,
    
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CMS SETTINGS - Static Content yang Bisa Diubah
-- =====================================================

-- Main settings table (key-value pairs)
CREATE TABLE cms_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'textarea', 'longtext', 'image', 'boolean', 'json', 'number', 'color') DEFAULT 'text',
    setting_group VARCHAR(50) COMMENT 'general, contact, social, shipping, payment',
    description TEXT,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT COMMENT 'Admin user ID',
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_setting_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample CMS settings dengan grup yang jelas
INSERT INTO cms_settings (setting_key, setting_value, setting_type, setting_group, description) VALUES
-- General Settings
('site_name', 'My E-Commerce', 'text', 'general', 'Nama website'),
('site_tagline', 'Your Trusted Online Store', 'text', 'general', 'Tagline website'),
('site_logo', '/images/logo.png', 'image', 'general', 'Logo website utama'),
('site_logo_dark', '/images/logo-dark.png', 'image', 'general', 'Logo untuk dark mode'),
('site_favicon', '/images/favicon.ico', 'image', 'general', 'Favicon website'),
('site_footer_text', '© 2026 My E-Commerce. All rights reserved.', 'textarea', 'general', 'Footer copyright text'),
('site_description', 'Best online store in Indonesia', 'textarea', 'general', 'Site description untuk SEO'),
('site_keywords', 'ecommerce, online shop, indonesia', 'text', 'general', 'SEO keywords'),

-- Contact Information
('contact_email', 'contact@example.com', 'text', 'contact', 'Email kontak utama'),
('contact_email_support', 'support@example.com', 'text', 'contact', 'Email customer support'),
('contact_phone', '+62123456789', 'text', 'contact', 'Nomor telepon'),
('contact_whatsapp', '+62123456789', 'text', 'contact', 'Nomor WhatsApp'),
('contact_address', 'Jl. Contoh No. 123, Jakarta', 'textarea', 'contact', 'Alamat lengkap'),
('contact_maps_embed', NULL, 'textarea', 'contact', 'Google Maps embed code'),
('contact_working_hours', 'Senin - Jumat: 09:00 - 17:00', 'textarea', 'contact', 'Jam operasional'),

-- Social Media
('social_facebook', NULL, 'text', 'social', 'Facebook page URL'),
('social_instagram', NULL, 'text', 'social', 'Instagram profile URL'),
('social_twitter', NULL, 'text', 'social', 'Twitter/X profile URL'),
('social_youtube', NULL, 'text', 'social', 'YouTube channel URL'),
('social_tiktok', NULL, 'text', 'social', 'TikTok profile URL'),
('social_linkedin', NULL, 'text', 'social', 'LinkedIn page URL'),

-- Shipping Settings
('free_shipping_threshold', '100000', 'number', 'shipping', 'Minimum order untuk gratis ongkir (IDR)'),
('default_shipping_origin_city', 'CGK10000', 'text', 'shipping', 'Branch/area code asal pengiriman (JNT Express)'),
('available_couriers', '["jnt","jne","tiki","pos","sicepat"]', 'json', 'shipping', 'Kurir yang tersedia'),

-- Payment Settings
('payment_methods_enabled', '["virtual_account","credit_card","ewallet","qris"]', 'json', 'payment', 'Metode pembayaran aktif'),
('payment_instruction', 'Silakan selesaikan pembayaran dalam 24 jam', 'textarea', 'payment', 'Instruksi pembayaran'),

-- Promo & Discount
('show_promo_banner', '1', 'boolean', 'general', 'Tampilkan banner promo'),
('promo_banner_text', 'Gratis Ongkir Min. 100k!', 'text', 'general', 'Text banner promo'),
('promo_banner_color', '#FF0000', 'color', 'general', 'Warna background banner'),

-- Feature Toggles
('enable_wishlist', '1', 'boolean', 'general', 'Enable fitur wishlist'),
('enable_reviews', '1', 'boolean', 'general', 'Enable fitur review'),
('enable_newsletter', '1', 'boolean', 'general', 'Enable newsletter subscription'),
('enable_chat', '1', 'boolean', 'general', 'Enable live chat'),

-- Maintenance
('maintenance_mode', '0', 'boolean', 'general', 'Mode maintenance'),
('maintenance_message', 'Sedang dalam perbaikan', 'textarea', 'general', 'Pesan saat maintenance');

-- =====================================================
-- 15. SHIPPING COST (JNT Express & Courier Cache)
-- =====================================================

CREATE TABLE shipping_costs_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    origin_city_id INT NOT NULL COMMENT 'Origin branch/area code (JNT Express) atau city ID',
    destination_city_id INT NOT NULL COMMENT 'Destination branch/area code (JNT) atau city ID',
    courier VARCHAR(50) NOT NULL COMMENT 'jnt, jne, tiki, pos, sicepat',
    service VARCHAR(100) NOT NULL COMMENT 'REG, YES, dll',
    weight INT NOT NULL COMMENT 'gram',
    cost DECIMAL(15, 2) NOT NULL,
    etd VARCHAR(50) COMMENT 'Estimasi hari',
    
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP COMMENT 'Cache 24 jam',
    
    UNIQUE KEY unique_shipping (origin_city_id, destination_city_id, courier, service, weight),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 16. REVIEWS & RATINGS (Pure Local)
-- =====================================================

CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL COMMENT 'Review hanya bisa dari pembeli',
    
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Admin moderation
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_note TEXT,
    
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE review_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES product_reviews(id) ON DELETE CASCADE,
    INDEX idx_review_id (review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Aggregate ratings table untuk performa
CREATE TABLE product_ratings_summary (
    product_id INT PRIMARY KEY,
    total_reviews INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    rating_5_count INT DEFAULT 0,
    rating_4_count INT DEFAULT 0,
    rating_3_count INT DEFAULT 0,
    rating_2_count INT DEFAULT 0,
    rating_1_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 17. SYNC LOGS (Monitoring Odoo Integration)
-- =====================================================

CREATE TABLE sync_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sync_type ENUM('products', 'stock', 'orders', 'customers', 'addresses') NOT NULL,
    sync_direction ENUM('from_odoo', 'to_odoo') NOT NULL,
    
    status ENUM('success', 'failed', 'partial') NOT NULL,
    records_processed INT DEFAULT 0,
    records_failed INT DEFAULT 0,
    
    error_message TEXT,
    execution_time_ms INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_sync_type (sync_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 18. NOTIFICATIONS (Optional)
-- =====================================================

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'order_status, payment, promo, etc',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entity
    related_type VARCHAR(50) COMMENT 'order, product, voucher',
    related_id INT COMMENT 'ID dari related entity',
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 19. ACTIVITY LOGS (Audit Trail)
-- =====================================================

CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL COMMENT 'login, view_product, add_to_cart, checkout, etc',
    entity_type VARCHAR(50) COMMENT 'product, order, user',
    entity_id INT,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    metadata JSON COMMENT 'Additional data',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 20. PROMO/FLASH SALE (CMS Control)
-- =====================================================

CREATE TABLE flash_sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date_range (start_date, end_date),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE flash_sale_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    flash_sale_id INT NOT NULL,
    product_id INT NOT NULL,
    product_variant_id INT NULL,
    
    original_price DECIMAL(15, 2) NOT NULL,
    flash_sale_price DECIMAL(15, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        ((original_price - flash_sale_price) / original_price) * 100
    ) STORED,
    
    stock_limit INT COMMENT 'Stock terbatas untuk flash sale',
    sold_count INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (flash_sale_id) REFERENCES flash_sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    INDEX idx_flash_sale_id (flash_sale_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 21. EMAIL QUEUE (Email notifications)
-- =====================================================

CREATE TABLE email_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    template_name VARCHAR(100) COMMENT 'order_confirmation, password_reset, etc',
    
    priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    error_message TEXT,
    
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_scheduled_at (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 22. SEARCH HISTORY (Analytics)
-- =====================================================

CREATE TABLE search_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    session_id VARCHAR(255),
    
    search_query VARCHAR(255) NOT NULL,
    results_count INT DEFAULT 0,
    
    filters_applied JSON COMMENT 'Filter yang digunakan',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_search_query (search_query),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 23. PRODUCT VIEWS (Analytics)
-- =====================================================

CREATE TABLE product_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NULL,
    session_id VARCHAR(255),
    
    referrer_url VARCHAR(500),
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 24. FAQ (CMS)
-- =====================================================

CREATE TABLE faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 25. NEWSLETTER SUBSCRIBERS
-- =====================================================

CREATE TABLE newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    
    is_subscribed BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    
    verification_token VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_is_subscribed (is_subscribed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 26. ADMIN USERS (CMS Admin)
-- =====================================================

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    full_name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor', 'viewer') DEFAULT 'admin',
    
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id INT NOT NULL,
    session_token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TRIGGERS & STORED PROCEDURES
-- =====================================================

-- Trigger: Update product ratings summary saat ada review baru
DELIMITER //
CREATE TRIGGER after_review_insert 
AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' THEN
        INSERT INTO product_ratings_summary (
            product_id, 
            total_reviews, 
            average_rating,
            rating_5_count,
            rating_4_count,
            rating_3_count,
            rating_2_count,
            rating_1_count
        )
        VALUES (
            NEW.product_id,
            1,
            NEW.rating,
            IF(NEW.rating = 5, 1, 0),
            IF(NEW.rating = 4, 1, 0),
            IF(NEW.rating = 3, 1, 0),
            IF(NEW.rating = 2, 1, 0),
            IF(NEW.rating = 1, 1, 0)
        )
        ON DUPLICATE KEY UPDATE
            total_reviews = total_reviews + 1,
            average_rating = (average_rating * total_reviews + NEW.rating) / (total_reviews + 1),
            rating_5_count = rating_5_count + IF(NEW.rating = 5, 1, 0),
            rating_4_count = rating_4_count + IF(NEW.rating = 4, 1, 0),
            rating_3_count = rating_3_count + IF(NEW.rating = 3, 1, 0),
            rating_2_count = rating_2_count + IF(NEW.rating = 2, 1, 0),
            rating_1_count = rating_1_count + IF(NEW.rating = 1, 1, 0);
    END IF;
END//
DELIMITER ;

-- Trigger: Reserve stock saat item ditambahkan ke cart
DELIMITER //
CREATE TRIGGER after_cart_item_insert
AFTER INSERT ON cart_items
FOR EACH ROW
BEGIN
    UPDATE product_stock
    SET reserved_quantity = reserved_quantity + NEW.quantity
    WHERE product_variant_id = NEW.product_variant_id;
END//
DELIMITER ;

-- Trigger: Release stock saat item dihapus dari cart
DELIMITER //
CREATE TRIGGER after_cart_item_delete
AFTER DELETE ON cart_items
FOR EACH ROW
BEGIN
    UPDATE product_stock
    SET reserved_quantity = reserved_quantity - OLD.quantity
    WHERE product_variant_id = OLD.product_variant_id;
END//
DELIMITER ;

-- Trigger: Update cart subtotal
DELIMITER //
CREATE TRIGGER after_cart_item_change
AFTER INSERT ON cart_items
FOR EACH ROW
BEGIN
    UPDATE shopping_carts
    SET subtotal = (
        SELECT SUM(subtotal)
        FROM cart_items
        WHERE cart_id = NEW.cart_id
    )
    WHERE id = NEW.cart_id;
END//
DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite indexes untuk query yang sering dipakai
CREATE INDEX idx_products_visible_featured ON products(is_visible, is_featured, display_order);
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);
CREATE INDEX idx_voucher_active_dates ON vouchers(is_active, start_date, end_date);
CREATE INDEX idx_product_stock_available ON product_stock(product_variant_id, available_quantity);

-- =====================================================
-- SAMPLE ADMIN USER (Password: Admin123!)
-- =====================================================

-- Note: Dalam production, gunakan bcrypt hash yang proper
INSERT INTO admin_users (username, email, password_hash, full_name, role) 
VALUES (
    'admin', 
    'admin@example.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- hash untuk 'Admin123!'
    'Super Administrator', 
    'super_admin'
);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Products with stock info
CREATE VIEW v_products_with_stock AS
SELECT 
    p.*,
    COUNT(DISTINCT pv.id) as variant_count,
    MIN(pv.selling_price) as min_price,
    MAX(pv.selling_price) as max_price,
    SUM(ps.available_quantity) as total_stock,
    COALESCE(prs.average_rating, 0) as rating,
    COALESCE(prs.total_reviews, 0) as review_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_stock ps ON pv.id = ps.product_variant_id
LEFT JOIN product_ratings_summary prs ON p.id = prs.product_id
GROUP BY p.id;

-- View: Order summary
CREATE VIEW v_order_summary AS
SELECT 
    o.*,
    u.email as user_email,
    u.full_name as user_name,
    COUNT(oi.id) as total_items,
    SUM(oi.quantity) as total_quantity,
    p.status as payment_status,
    p.payment_method
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN payments p ON o.id = p.order_id
GROUP BY o.id;

-- =====================================================
-- CLEANUP JOBS (To be run by cron)
-- =====================================================

-- Delete expired carts (older than 7 days)
-- DELETE FROM shopping_carts WHERE expires_at < NOW();

-- Delete expired password reset tokens
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW();

-- Delete expired shipping cost cache
-- DELETE FROM shipping_costs_cache WHERE expires_at < NOW();

-- Delete old activity logs (older than 90 days)
-- DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- =====================================================
-- END OF SCHEMA
-- =====================================================