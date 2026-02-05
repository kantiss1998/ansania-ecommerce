import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('orders', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_number: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                comment: 'Format: ORD-YYYYMMDD-XXX',
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            odoo_order_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Sale order ID from Odoo after sync',
            },
            status: {
                type: DataTypes.ENUM('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
                allowNull: false,
                defaultValue: 'pending_payment',
            },
            payment_status: {
                type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
                allowNull: false,
                defaultValue: 'pending',
            },
            subtotal: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            discount_amount: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            shipping_cost: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            total_amount: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            customer_note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            admin_note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            paid_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            shipped_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            delivered_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            cancelled_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        // Add indexes
        await queryInterface.addIndex('orders', ['order_number'], {
            unique: true,
            name: 'orders_order_number_unique',
        });

        await queryInterface.addIndex('orders', ['user_id'], {
            name: 'orders_user_id_idx',
        });

        await queryInterface.addIndex('orders', ['status'], {
            name: 'orders_status_idx',
        });

        await queryInterface.addIndex('orders', ['payment_status'], {
            name: 'orders_payment_status_idx',
        });

        await queryInterface.addIndex('orders', ['odoo_order_id'], {
            name: 'orders_odoo_order_id_idx',
        });

        await queryInterface.addIndex('orders', ['created_at'], {
            name: 'orders_created_at_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('orders');
    },
};
