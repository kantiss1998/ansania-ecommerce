import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";

import { errorHandler } from "./middleware/errorHandler";
import addressRoutes from "./routes/address.routes";
import adminAnalyticsRoutes from "./routes/admin/analytics.routes";
import adminAttributeRoutes from "./routes/admin/attribute.routes";
import adminCategoryRoutes from "./routes/admin/category.routes";
import adminCmsRoutes from "./routes/admin/cms.routes";
import adminCustomerRoutes from "./routes/admin/customer.routes";
import adminDashboardRoutes from "./routes/admin/dashboard.routes";
import adminFlashSaleRoutes from "./routes/admin/flashSale.routes";
import adminMarketingRoutes from "./routes/admin/marketing.routes";
import adminOrderRoutes from "./routes/admin/order.routes";
import adminProductRoutes from "./routes/admin/product.routes";
import adminReportRoutes from "./routes/admin/report.routes";
import adminReviewRoutes from "./routes/admin/review.routes";
import adminStockRoutes from "./routes/admin/stock.routes";
import adminSyncRoutes from "./routes/admin/sync.routes";
import adminSystemRoutes from "./routes/admin/system.routes";
import adminVoucherRoutes from "./routes/admin/voucher.routes";
import attributeRoutes from "./routes/attribute.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import categoryRoutes from "./routes/category.routes";
import checkoutRoutes from "./routes/checkout.routes";
import cmsRoutes from "./routes/cms.routes";
import flashSaleRoutes from "./routes/flashSale.routes";
import notificationRoutes from "./routes/notification.routes";
import odooRoutes from "./routes/odoo.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import productRoutes from "./routes/product.routes";
import profileRoutes from "./routes/profile.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import reviewRoutes from "./routes/review.routes";
import searchRoutes from "./routes/search.routes";
import shippingRoutes from "./routes/shipping.routes";
import statsRoutes from "./routes/stats.routes";
import userDashboardRoutes from "./routes/userDashboard.routes";
import voucherRoutes from "./routes/voucher.routes";
import wishlistRoutes from "./routes/wishlist.routes";

// Note: Environment variables are loaded in server.ts before this module is imported

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/payment", paymentRoutes);
app.use("/addresses", addressRoutes);
app.use("/profile", profileRoutes);
app.use("/vouchers", voucherRoutes);
app.use("/reviews", reviewRoutes);
app.use("/cms", cmsRoutes);
app.use("/attributes", attributeRoutes);
app.use("/flash-sales", flashSaleRoutes);
app.use("/notifications", notificationRoutes);
app.use("/stats", statsRoutes);
app.use("/odoo", odooRoutes);
app.use("/orders", orderRoutes);
app.use("/shipping-info", shippingRoutes);
app.use("/categories", categoryRoutes);
app.use("/search", searchRoutes);
app.use("/user", userDashboardRoutes);
app.use("/recommendations", recommendationRoutes);

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "Ansania E-Commerce API",
    version: "1.0.0",
  });
});

// Admin group routes
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/admin/orders", adminOrderRoutes);
app.use("/admin/customers", adminCustomerRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/admin/reviews", adminReviewRoutes);
app.use("/admin/stock", adminStockRoutes);
app.use("/admin/marketing", adminMarketingRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/admin/vouchers", adminVoucherRoutes);
app.use("/admin/flash-sales", adminFlashSaleRoutes);
app.use("/admin/cms", adminCmsRoutes);
app.use("/admin/reports", adminReportRoutes);
app.use("/admin/analytics", adminAnalyticsRoutes);
app.use("/admin/system", adminSystemRoutes);
app.use("/admin/sync", adminSyncRoutes);
app.use("/admin/attributes", adminAttributeRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    code: "NOT_FOUND",
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
