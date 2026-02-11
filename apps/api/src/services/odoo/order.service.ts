
import { Order, OrderItem, User, Address } from '@repo/database';

import { odooClient } from './odoo.client';

export class OdooOrderService {
    /**
     * Sync order to Odoo after successful payment
     */
    async syncOrder(orderId: number): Promise<number> {
        console.log(`[ODOO_SYNC] Starting order sync for order ID: ${orderId}`);

        try {
            const order = await Order.findByPk(orderId, {
                include: [
                    { model: OrderItem, as: 'items' },
                    { model: User, as: 'user' },
                    { model: Address, as: 'shippingAddress' }
                ]
            });

            if (!order) {
                throw new Error(`Order not found: ${orderId}`);
            }

            if (order.odoo_order_id) {
                console.log(`[ODOO_SYNC] Order ${order.order_number} already synced to Odoo (ID: ${order.odoo_order_id})`);
                return order.odoo_order_id;
            }

            if (odooClient.isMockMode()) {
                console.log('[ODOO_SYNC] Mock mode - simulating order creation in Odoo');
                const mockOdooId = Math.floor(Math.random() * 100000);
                await order.update({ odoo_order_id: mockOdooId });
                console.log(`[ODOO_SYNC] Mock Odoo order created with ID: ${mockOdooId}`);
                return mockOdooId;
            }

            // Prepare order line items
            const orderLines = (order.items || []).map(item => {
                return [0, 0, {
                    product_id: item.odoo_product_id || null,
                    name: item.product_name,
                    product_uom_qty: item.quantity,
                    price_unit: Number(item.price),
                    tax_id: [[6, 0, []]], // No taxes for now
                }];
            });

            // Prepare order data for Odoo
            const odooOrderData = {
                partner_id: order.user?.odoo_partner_id || null,
                date_order: order.created_at.toISOString(),
                client_order_ref: order.order_number,
                state: 'sale', // Confirmed sale order
                order_line: orderLines,
                // Note: Add custom fields if needed
                note: order.customer_note || '',
            };

            // Create Sale Order in Odoo
            const odooOrderId = await odooClient.create('sale.order', odooOrderData);

            // Update local order with Odoo ID
            await order.update({ odoo_order_id: odooOrderId });

            console.log(`[ODOO_SYNC] Order ${order.order_number} synced successfully to Odoo (ID: ${odooOrderId})`);

            return odooOrderId;

        } catch (error) {
            console.error(`[ODOO_SYNC] Failed to sync order ${orderId} to Odoo:`, error);
            throw error;
        }
    }

    /**
     * Update order status in Odoo when local order status changes
     */
    async updateOrderStatus(orderId: number, status: string): Promise<void> {
        console.log(`[ODOO_SYNC] Updating order status in Odoo for order ${orderId}`);

        try {
            const order = await Order.findByPk(orderId);

            if (!order || !order.odoo_order_id) {
                console.warn(`[ODOO_SYNC] Order ${orderId} not synced to Odoo yet, skipping status update`);
                return;
            }

            if (odooClient.isMockMode()) {
                console.log(`[ODOO_SYNC] Mock mode - would update Odoo order ${order.odoo_order_id} status to: ${status}`);
                return;
            }

            // Map local status to Odoo state
            const odooStateMap: Record<string, string> = {
                'pending_payment': 'draft',
                'paid': 'sale',
                'processing': 'sale',
                'shipped': 'done',
                'delivered': 'done',
                'cancelled': 'cancel',
                'refunded': 'cancel'
            };

            const odooState = odooStateMap[status] || 'draft';

            // Update order in Odoo
            await odooClient.write('sale.order', [order.odoo_order_id], {
                state: odooState
            });

            console.log(`[ODOO_SYNC] Order ${order.order_number} status updated in Odoo to: ${odooState}`);

        } catch (error) {
            console.error(`[ODOO_SYNC] Failed to update order status in Odoo:`, error);
            // Don't throw - this is a non-critical sync
        }
    }

    /**
     * Poll Odoo for order status updates and sync back to local
     */
    async syncOrderStatusFromOdoo(): Promise<{ updated: number; failed: number }> {
        console.log('[ODOO_SYNC] Polling status updates from Odoo...');

        const orders = await Order.findAll({
            where: {
                odoo_order_id: { [require('sequelize').Op.ne]: null },
                status: { [require('sequelize').Op.notIn]: ['delivered', 'cancelled', 'refunded'] }
            }
        });

        let updated = 0;
        let failed = 0;

        for (const order of orders) {
            try {
                if (!order.odoo_order_id) continue;

                if (odooClient.isMockMode()) {
                    continue;
                }

                const odooOrder = await odooClient.searchRead('sale.order', [['id', '=', order.odoo_order_id]], ['state', 'delivery_status']);
                if (!odooOrder || odooOrder.length === 0) continue;

                const odooState = odooOrder[0].state;

                // Map Odoo state to local status
                let newStatus = order.status;
                if (odooState === 'sale') newStatus = 'processing';
                if (odooState === 'done') newStatus = 'delivered';
                if (odooState === 'cancel') newStatus = 'cancelled';

                // Check delivery status if available
                const deliveryStatus = odooOrder[0].delivery_status;
                if (deliveryStatus === 'shipped') newStatus = 'shipped';

                if (newStatus !== order.status) {
                    await order.update({ status: newStatus as any });
                    updated++;
                }

            } catch (error) {
                console.error(`[ODOO_SYNC] Failed to fetch status for order ${order.order_number}:`, error);
                failed++;
            }
        }

        return { updated, failed };
    }
}
