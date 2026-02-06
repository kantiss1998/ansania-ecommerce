import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import checkoutRoutes from './routes/checkout.routes';
import paymentRoutes from './routes/payment.routes';
import addressRoutes from './routes/address.routes';
import profileRoutes from './routes/profile.routes';
import voucherRoutes from './routes/voucher.routes';
import reviewRoutes from './routes/review.routes';
import cmsRoutes from './routes/cms.routes';
import attributeRoutes from './routes/attribute.routes';
import flashSaleRoutes from './routes/flashSale.routes';
import notificationRoutes from './routes/notification.routes';
import statsRoutes from './routes/stats.routes';
import odooRoutes from './routes/odoo.routes';
import orderRoutes from './routes/order.routes';
import shippingRoutes from './routes/shipping.routes';

// Note: Environment variables are loaded in server.ts before this module is imported

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/payment', paymentRoutes);
app.use('/addresses', addressRoutes);
app.use('/profile', profileRoutes);
app.use('/vouchers', voucherRoutes);
app.use('/reviews', reviewRoutes);
app.use('/cms', cmsRoutes);
app.use('/attributes', attributeRoutes);
app.use('/flash-sales', flashSaleRoutes);
app.use('/notifications', notificationRoutes);
app.use('/stats', statsRoutes);
app.use('/odoo', odooRoutes);
app.use('/orders', orderRoutes);
app.use('/shipping-info', shippingRoutes);

app.get('/api', (_req, res) => {
    res.json({
        success: true,
        message: 'Ansania E-Commerce API',
        version: '1.0.0',
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        code: 'NOT_FOUND',
    });
});

// Global Error Handler
app.use(errorHandler);

export default app;
