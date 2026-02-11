import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
    Association,
} from 'sequelize';

import { sequelize } from '../config/database';

// Use type-only imports to avoid circular dependencies
import type { OrderItem } from './OrderItem';
import type { Payment } from './Payment';
import type { Review } from './Review';
import type { Shipping } from './Shipping';
import { User } from './User';
import { ORDER_STATUS, PAYMENT_STATUS, type OrderStatus, type PaymentStatus } from '@repo/shared';
export type { OrderStatus, PaymentStatus };

export interface OrderAttributes {
    id: number;
    order_number: string;
    user_id: number;
    odoo_order_id: number | null;
    status: OrderStatus;
    payment_status: PaymentStatus;
    subtotal: number;
    discount_amount: number;
    shipping_cost: number;
    total_amount: number;
    customer_note: string | null;
    admin_note: string | null;
    paid_at: Date | null;
    shipped_at: Date | null;
    delivered_at: Date | null;
    cancelled_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class Order extends Model<
    InferAttributes<Order>,
    InferCreationAttributes<Order>
> {
    declare id: CreationOptional<number>;
    declare order_number: string;
    declare user_id: ForeignKey<User['id']>;
    declare odoo_order_id: number | null;

    declare status: CreationOptional<OrderStatus>;
    declare payment_status: CreationOptional<PaymentStatus>;
    declare subtotal: number;
    declare discount_amount: CreationOptional<number>;
    declare shipping_cost: number;
    declare total_amount: number;
    declare customer_note: string | null;
    declare admin_note: string | null;

    declare paid_at: Date | null;
    declare shipped_at: Date | null;
    declare delivered_at: Date | null;
    declare cancelled_at: Date | null;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare user?: NonAttribute<User>;
    declare items?: NonAttribute<OrderItem[]>;
    declare payment?: NonAttribute<Payment>;
    declare shipping?: NonAttribute<Shipping>;
    declare reviews?: NonAttribute<Review[]>;

    declare static associations: {
        user: Association<Order, User>;
        items: Association<Order, OrderItem>;
        payment: Association<Order, Payment>;
        shipping: Association<Order, Shipping>;
        reviews: Association<Order, Review>;
    };
}

Order.init(
    {
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
        },
        odoo_order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Sale order ID from Odoo after sync',
        },
        status: {
            type: DataTypes.ENUM(
                ORDER_STATUS.PENDING_PAYMENT,
                ORDER_STATUS.PAID,
                ORDER_STATUS.PROCESSING,
                ORDER_STATUS.SHIPPED,
                ORDER_STATUS.DELIVERED,
                ORDER_STATUS.CANCELLED,
                ORDER_STATUS.REFUNDED
            ),
            allowNull: false,
            defaultValue: ORDER_STATUS.PENDING_PAYMENT,
        },
        payment_status: {
            type: DataTypes.ENUM(
                PAYMENT_STATUS.PENDING,
                PAYMENT_STATUS.PAID,
                PAYMENT_STATUS.FAILED,
                PAYMENT_STATUS.REFUNDED
            ),
            allowNull: false,
            defaultValue: PAYMENT_STATUS.PENDING,
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
    },
    {
        sequelize,
        tableName: 'orders',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['order_number'], unique: true },
            { fields: ['user_id'] },
            { fields: ['status'] },
            { fields: ['payment_status'] },
            { fields: ['odoo_order_id'] },
            { fields: ['created_at'] },
        ],
    }
);

export default Order;
