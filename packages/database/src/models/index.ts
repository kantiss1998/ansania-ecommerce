/**
 * Database Models Index
 * Defines all Sequelize models and their associations
 */

import { sequelize } from '../config/database';

// Import all models
import { User } from './User';
import { Address } from './Address';
import { Category } from './Category';
import { Product } from './Product';
import { ProductVariant } from './ProductVariant';
import { ProductImage } from './ProductImage';
import { Cart } from './Cart';
import { CartItem } from './CartItem';
import { Order } from './Order';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';
import { Shipping } from './Shipping';
import { Voucher } from './Voucher';
import { VoucherUsage } from './VoucherUsage';
import { Review } from './Review';
import { ReviewImage } from './ReviewImage';
import { Wishlist } from './Wishlist';

// New models - Authentication
import { UserSession } from './UserSession';
import { PasswordResetToken } from './PasswordResetToken';

// New models - Stock & Inventory
import { ProductStock } from './ProductStock';

// New models - Junction tables
import { ProductCategories } from './ProductCategories';
import { VoucherProducts } from './VoucherProducts';
import { VoucherCategories } from './VoucherCategories';

// New models - Filters
import { FilterColor } from './FilterColor';
import { FilterFinishing } from './FilterFinishing';
import { FilterSize } from './FilterSize';

// New models - CMS
import { CmsPage } from './CmsPage';
import { CmsBanner } from './CmsBanner';
import { CmsSetting } from './CmsSetting';

// New models - Utility & Logging (split into individual files for better maintainability)
import { ShippingCostsCache } from './ShippingCostsCache';
import { ProductRatingsSummary } from './ProductRatingsSummary';
import { SyncLog } from './SyncLog';
import { Notification } from './Notification';
import { ActivityLog } from './ActivityLog';
import { EmailQueue } from './EmailQueue';

// New models - Flash Sales & Analytics (all individual files)
import { FlashSale } from './FlashSale';
import { FlashSaleProduct } from './FlashSaleProduct';
import { SearchHistory } from './SearchHistory';
import { ProductView } from './ProductView';

// ==========================================
// DEFINE ALL MODEL ASSOCIATIONS
// ==========================================

// User Associations
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlist' });
User.hasMany(VoucherUsage, { foreignKey: 'user_id', as: 'voucherUsages' });

// Address Associations
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category Associations (Self-referencing)
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

// Product Associations
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlist' });

// ProductVariant Associations
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductVariant.hasMany(CartItem, { foreignKey: 'product_variant_id', as: 'cartItems' });
ProductVariant.hasMany(Wishlist, { foreignKey: 'product_variant_id', as: 'wishlist' });

// ProductImage Associations
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Cart Associations
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
Cart.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });

// CartItem Associations
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'productVariant' });

// Order Associations
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Order.hasOne(Shipping, { foreignKey: 'order_id', as: 'shipping' });
Order.hasMany(Review, { foreignKey: 'order_id', as: 'reviews' });
Order.hasMany(VoucherUsage, { foreignKey: 'order_id', as: 'voucherUsages' });

// OrderItem Associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Payment Associations
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Shipping Associations
Shipping.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Voucher Associations
Voucher.hasMany(Cart, { foreignKey: 'voucher_id', as: 'carts' });
Voucher.hasMany(VoucherUsage, { foreignKey: 'voucher_id', as: 'usages' });

// VoucherUsage Associations
VoucherUsage.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
VoucherUsage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
VoucherUsage.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Review Associations
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Review.hasMany(ReviewImage, { foreignKey: 'review_id', as: 'images' });

// ReviewImage Associations
ReviewImage.belongsTo(Review, { foreignKey: 'review_id', as: 'review' });

// Wishlist Associations
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Wishlist.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'productVariant' });

// ==========================================
// NEW MODEL ASSOCIATIONS
// ==========================================

// UserSession Associations
UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });

// PasswordResetToken Associations
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'passwordResetTokens' });

// ProductStock Associations
ProductStock.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'productVariant' });
ProductVariant.hasOne(ProductStock, { foreignKey: 'product_variant_id', as: 'inventory' });

// Many-to-Many: Product <-> Category via ProductCategories
Product.belongsToMany(Category, {
    through: ProductCategories,
    foreignKey: 'product_id',
    otherKey: 'category_id',
    as: 'categories'
});
Category.belongsToMany(Product, {
    through: ProductCategories,
    foreignKey: 'category_id',
    otherKey: 'product_id',
    as: 'categorizedProducts'
});

// Many-to-Many: Voucher <-> Product via VoucherProducts
Voucher.belongsToMany(Product, {
    through: VoucherProducts,
    foreignKey: 'voucher_id',
    otherKey: 'product_id',
    as: 'applicableProducts'
});
Product.belongsToMany(Voucher, {
    through: VoucherProducts,
    foreignKey: 'product_id',
    otherKey: 'voucher_id',
    as: 'vouchers'
});

// Many-to-Many: Voucher <-> Category via VoucherCategories
Voucher.belongsToMany(Category, {
    through: VoucherCategories,
    foreignKey: 'voucher_id',
    otherKey: 'category_id',
    as: 'applicableCategories'
});
Category.belongsToMany(Voucher, {
    through: VoucherCategories,
    foreignKey: 'category_id',
    otherKey: 'voucher_id',
    as: 'categoryVouchers'
});

// ProductRatingsSummary Associations
ProductRatingsSummary.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasOne(ProductRatingsSummary, { foreignKey: 'product_id', as: 'ratingsSummary' });

// Notification Associations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

// ActivityLog Associations
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activityLogs' });

// FlashSale Associations
FlashSale.hasMany(FlashSaleProduct, { foreignKey: 'flash_sale_id', as: 'products' });

// FlashSaleProduct Associations
FlashSaleProduct.belongsTo(FlashSale, { foreignKey: 'flash_sale_id', as: 'flashSale' });
FlashSaleProduct.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
FlashSaleProduct.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'productVariant' });

// SearchHistory Associations
SearchHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(SearchHistory, { foreignKey: 'user_id', as: 'searchHistory' });

// ProductView Associations
ProductView.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductView.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Product.hasMany(ProductView, { foreignKey: 'product_id', as: 'views' });

// ==========================================
// EXPORT ALL MODELS
// ==========================================

export {
    // Database connection
    sequelize,

    // Core models
    User,
    Address,
    Category,
    Product,
    ProductVariant,
    ProductImage,

    // Cart models
    Cart,
    CartItem,

    // Order models
    Order,
    OrderItem,
    Payment,
    Shipping,

    // Supporting models
    Voucher,
    VoucherUsage,
    Review,
    ReviewImage,
    Wishlist,

    // Authentication models
    UserSession,
    PasswordResetToken,

    // Stock & Inventory
    ProductStock,

    // Junction tables
    ProductCategories,
    VoucherProducts,
    VoucherCategories,

    // Filter models
    FilterColor,
    FilterFinishing,
    FilterSize,

    // CMS models
    CmsPage,
    CmsBanner,
    CmsSetting,

    // Utility models
    ShippingCostsCache,
    ProductRatingsSummary,
    SyncLog,
    Notification,
    ActivityLog,
    EmailQueue,

    // Flash Sales & Analytics
    FlashSale,
    FlashSaleProduct,
    SearchHistory,
    ProductView,
};

// Export model instances for database initialization
export const models = {
    User,
    Address,
    Category,
    Product,
    ProductVariant,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    Shipping,
    Voucher,
    VoucherUsage,
    Review,
    ReviewImage,
    Wishlist,

    // New models
    UserSession,
    PasswordResetToken,
    ProductStock,
    ProductCategories,
    VoucherProducts,
    VoucherCategories,
    FilterColor,
    FilterFinishing,
    FilterSize,
    CmsPage,
    CmsBanner,
    CmsSetting,
    ShippingCostsCache,
    ProductRatingsSummary,
    SyncLog,
    Notification,
    ActivityLog,
    EmailQueue,
    FlashSale,
    FlashSaleProduct,
    SearchHistory,
    ProductView,
};

export default models;
