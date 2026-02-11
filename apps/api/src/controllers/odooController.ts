
import { Order, User } from '@repo/database';
import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { BadRequestError } from '@repo/shared/errors';

import { OdooCustomerService } from '../services/odoo/customer.service';
import { odooClient } from '../services/odoo/odoo.client';
import { OdooOrderService } from '../services/odoo/order.service';
import { OdooProductService } from '../services/odoo/product.service';


const productService = new OdooProductService();
const orderService = new OdooOrderService();
const customerService = new OdooCustomerService();

/**
 * Sync products from Odoo
 */
export const syncProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.syncProducts();
        res.json({
            success: true,
            message: 'Product sync completed successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Sync stock from Odoo
 */
export const syncStock = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.syncStock();
        res.json({
            success: true,
            message: 'Stock sync completed successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Sync categories from Odoo
 */
export const syncCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.syncCategories();
        res.json({
            success: true,
            message: 'Category sync completed successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Sync customer to Odoo
 */
export const syncCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            throw new BadRequestError('Invalid User ID');
        }

        const odooPartnerId = await customerService.syncCustomer(userId);

        res.json({
            success: true,
            message: 'Customer synced successfully',
            data: {
                user_id: userId,
                odoo_partner_id: odooPartnerId
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Sync order to Odoo (manual re-sync)
 */
export const syncOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            throw new BadRequestError('Invalid Order ID');
        }

        const odooOrderId = await orderService.syncOrder(orderId);

        res.json({
            success: true,
            message: 'Order synced successfully',
            data: {
                order_id: orderId,
                odoo_order_id: odooOrderId
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Poll Odoo for order status updates
 */
export const syncOrderStatus = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orderService.syncOrderStatusFromOdoo();
        res.json({
            success: true,
            message: 'Order status sync completed',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get sync status
 */
export const getSyncStatus = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const totalOrders = await Order.count();
        const syncedOrders = await Order.count({ where: { odoo_order_id: { [Op.ne]: null } } });
        const syncedCustomers = await User.count({ where: { odoo_partner_id: { [Op.ne]: null } } });

        const config = odooClient.getConfig();

        res.json({
            success: true,
            data: {
                total_orders: totalOrders,
                synced_orders: syncedOrders,
                synced_customers: syncedCustomers,
                last_sync: new Date().toISOString(),
                mode: config.baseUrl !== 'NOT_SET' ? 'production' : 'mock',
                connection: config
            }
        });
    } catch (error) {
        next(error);
    }
};
