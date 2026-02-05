/**
 * @repo/database
 * Main package entry point - exports all database models, types, and utilities
 */

// Export database connection and utilities
export {
    sequelize,
    testConnection,
    syncDatabase,
    closeConnection,
} from './config/database';

// Export all models
export {
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

    // Models collection
    models,

    // New models - Authentication
    UserSession,
    PasswordResetToken,

    // New models - Stock & Inventory
    ProductStock,

    // New models - Junction tables
    ProductCategories,
    VoucherProducts,
    VoucherCategories,

    // New models - Filters
    FilterColor,
    FilterFinishing,
    FilterSize,

    // New models - CMS
    CmsPage,
    CmsBanner,
    CmsSetting,

    // New models - Utility & Logging
    ShippingCostsCache,
    ProductRatingsSummary,
    SyncLog,
    Notification,
    ActivityLog,
    EmailQueue,

    // New models - Flash Sales & Analytics
    FlashSale,
    FlashSaleProduct,
    SearchHistory,
    ProductView,
} from './models';

// Export model attribute types
export type { UserAttributes } from './models/User';
export type { AddressAttributes } from './models/Address';
export type { CategoryAttributes } from './models/Category';
export type { ProductAttributes } from './models/Product';
export type { ProductVariantAttributes } from './models/ProductVariant';
export type { ProductImageAttributes } from './models/ProductImage';
export type { CartAttributes } from './models/Cart';
export type { CartItemAttributes } from './models/CartItem';
export type { OrderAttributes, OrderStatus, PaymentStatus as OrderPaymentStatus } from './models/Order';
export type { OrderItemAttributes } from './models/OrderItem';
export type { PaymentAttributes, PaymentMethod, PaymentStatus } from './models/Payment';
export type { ShippingAttributes } from './models/Shipping';
export type { VoucherAttributes, VoucherType } from './models/Voucher';
export type { VoucherUsageAttributes } from './models/VoucherUsage';
export type { ReviewAttributes } from './models/Review';
export type { ReviewImageAttributes } from './models/ReviewImage';
export type { WishlistAttributes } from './models/Wishlist';

// Export new model types
export type { UserSessionAttributes } from './models/UserSession';
export type { PasswordResetTokenAttributes } from './models/PasswordResetToken';
export type { ProductStockAttributes } from './models/ProductStock';
// export type { ProductCategoriesAttributes } from './models/ProductCategories'; // Junction table
// export type { VoucherProductsAttributes } from './models/VoucherProducts'; // Junction table
// export type { VoucherCategoriesAttributes } from './models/VoucherCategories'; // Junction table
export type { FilterColorAttributes } from './models/FilterColor';
export type { FilterFinishingAttributes } from './models/FilterFinishing';
export type { FilterSizeAttributes } from './models/FilterSize';
export type { CmsPageAttributes } from './models/CmsPage';
export type { CmsBannerAttributes } from './models/CmsBanner';
export type { CmsSettingAttributes } from './models/CmsSetting';
export type { ShippingCostsCacheAttributes } from './models/ShippingCostsCache';
export type { ProductRatingsSummaryAttributes } from './models/ProductRatingsSummary';
export type { SyncLogAttributes } from './models/SyncLog';
export type { NotificationAttributes } from './models/Notification';
export type { ActivityLogAttributes } from './models/ActivityLog';
export type { EmailQueueAttributes } from './models/EmailQueue';
export type { FlashSaleAttributes } from './models/FlashSale';
export type { FlashSaleProductAttributes } from './models/FlashSaleProduct';
export type { SearchHistoryAttributes } from './models/SearchHistory';
export type { ProductViewAttributes } from './models/ProductView';
