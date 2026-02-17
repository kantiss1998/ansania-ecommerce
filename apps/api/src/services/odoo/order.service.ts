import {
  Order,
  OrderItem,
  User,
  Address,
  ProductVariant,
  SyncLog,
} from "@repo/database";
import {
  NotFoundError,
  AppError,
  ServiceUnavailableError,
} from "@repo/shared/errors";
import { Op } from "sequelize";

import { odooClient } from "./odoo.client";

export class OdooOrderService {
  /**
   * Sync order to Odoo after successful payment
   */
  async syncOrder(orderId: number): Promise<number> {
    console.log(`[ODOO_SYNC] Starting order sync for order ID: ${orderId}`);
    const startTime = Date.now();

    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [{ model: ProductVariant, as: "productVariant" }],
          },
          { model: User, as: "user" },
          { model: Address, as: "shippingAddress" },
        ],
      });

      if (!order) {
        throw new NotFoundError("Order");
      }

      if (order.odoo_order_id) {
        console.log(
          `[ODOO_SYNC] Order ${order.order_number} already synced to Odoo (ID: ${order.odoo_order_id})`,
        );
        return order.odoo_order_id;
      }

      let odooOrderId: number;

      if (odooClient.isMockMode()) {
        console.log(
          "[ODOO_SYNC] Mock mode - simulating order creation in Odoo",
        );
        odooOrderId = Math.floor(Math.random() * 100000);
      } else {
        // Prepare order line items
        const orderLines = (order.items || []).map((item) => {
          return [
            0,
            0,
            {
              product_id: item.productVariant?.odoo_product_id || null,
              name: item.product_name,
              product_uom_qty: item.quantity,
              price_unit: Number(item.price),
              tax_id: [[6, 0, []]], // No taxes for now
            },
          ];
        });

        // Prepare order data for Odoo
        const odooOrderData = {
          partner_id: order.user?.odoo_partner_id || null,
          date_order: order.created_at.toISOString(),
          client_order_ref: order.order_number,
          state: "sale", // Confirmed sale order
          order_line: orderLines,
          // Note: Add custom fields if needed
          note: order.customer_note || "",
        };

        // Create Sale Order in Odoo
        odooOrderId = await odooClient.create("sale.order", odooOrderData);
      }

      // Update local order with Odoo ID
      await order.update({ odoo_order_id: odooOrderId });

      const duration = Date.now() - startTime;
      console.log(
        `[ODOO_SYNC] Order ${order.order_number} synced successfully to Odoo (ID: ${odooOrderId})`,
      );

      // Create success log
      await SyncLog.create({
        sync_type: "orders",
        sync_direction: "to_odoo",
        status: "success",
        records_processed: 1,
        records_failed: 0,
        execution_time_ms: duration,
        error_message: null,
      });

      return odooOrderId;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[ODOO_SYNC] Failed to sync order ${orderId} to Odoo:`,
        error,
      );

      // Create failure log
      await SyncLog.create({
        sync_type: "orders",
        sync_direction: "to_odoo",
        status: "failed",
        records_processed: 0,
        records_failed: 1, // Single order failed
        execution_time_ms: duration,
        error_message: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof AppError) throw error;
      throw new ServiceUnavailableError("Odoo Order Sync");
    }
  }

  /**
   * Update order status in Odoo when local order status changes
   */
  async updateOrderStatus(orderId: number): Promise<boolean> {
    console.log(
      `[ODOO_SYNC] Updating order status in Odoo for order ${orderId}`,
    );

    try {
      const order = await Order.findByPk(orderId);

      if (!order || !order.odoo_order_id) {
        console.warn(
          `[ODOO_SYNC] Order ${orderId} not synced to Odoo yet, skipping status update`,
        );
        return false;
      }

      // Logic to update status in Odoo would go here
      // distinct from creating order

      return true;
    } catch (error) {
      console.error(
        `[ODOO_SYNC] Failed to update status for order ${orderId}:`,
        error,
      );
      // Don't throw here, just return false to let local process continue
      return false;
    }
  }

  /**
   * Sync order status from Odoo for all pending orders
   */
  async syncOrderStatusFromOdoo(): Promise<{
    synced: number;
    updated: number;
    errors: number;
  }> {
    console.log("[ODOO_SYNC] syncing order status from Odoo...");
    const startTime = Date.now();

    try {
      // Find orders that are synced to Odoo but not in final state locally
      const orders = await Order.findAll({
        where: {
          odoo_order_id: { [Op.ne]: null },
        },
      });

      console.log(`[ODOO_SYNC] Found ${orders.length} orders to check status.`);

      let updatedCount = 0;
      let errorCount = 0;

      for (const order of orders) {
        try {
          // Placeholder for real logic
          // updatedCount++;
        } catch (err) {
          errorCount++;
          console.error(
            `[ODOO_SYNC] Failed to sync status for order ${order.id}`,
            err,
          );
        }
      }

      const duration = Date.now() - startTime;

      // Create success/partial log
      await SyncLog.create({
        sync_type: "orders",
        sync_direction: "from_odoo",
        status: errorCount > 0 ? "partial" : "success",
        records_processed: updatedCount,
        records_failed: errorCount,
        execution_time_ms: duration,
        error_message: errorCount > 0 ? `Failed for ${errorCount} orders` : null,
      });

      return {
        synced: orders.length,
        updated: updatedCount,
        errors: errorCount,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error("[ODOO_SYNC] Failed to sync order statuses:", error);

      // Create failure log
      await SyncLog.create({
        sync_type: "orders",
        sync_direction: "from_odoo",
        status: "failed",
        records_processed: 0,
        records_failed: 0,
        execution_time_ms: duration,
        error_message: error instanceof Error ? error.message : String(error),
      });

      throw new ServiceUnavailableError("Odoo Order Status Sync");
    }
  }
}
