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

import { Order } from './Order';

export type PaymentMethod =
    | 'virtual_account'
    | 'credit_card'
    | 'ewallet'
    | 'qris'
    | 'convenience_store';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'cancelled';

export interface PaymentAttributes {
    id: number;
    order_id: number;
    payment_method: PaymentMethod;
    payment_channel: string | null;
    payment_provider: string;
    transaction_id: string;
    transaction_token: string | null;
    transaction_url: string | null;
    amount: number;
    status: PaymentStatus;
    payment_response: object | null;
    expired_at: Date | null;
    paid_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class Payment extends Model<
    InferAttributes<Payment>,
    InferCreationAttributes<Payment>
> {
    declare id: CreationOptional<number>;
    declare order_id: ForeignKey<Order['id']>;

    declare payment_method: PaymentMethod;
    declare payment_channel: string | null;
    declare payment_provider: CreationOptional<string>;
    declare transaction_id: string;
    declare transaction_token: string | null;
    declare transaction_url: string | null;
    declare amount: number;
    declare status: CreationOptional<PaymentStatus>;
    declare payment_response: object | null;
    declare expired_at: Date | null;
    declare paid_at: Date | null;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare order?: NonAttribute<Order>;
    declare static associations: {
        order: Association<Payment, Order>;
    };
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        payment_method: {
            type: DataTypes.ENUM('virtual_account', 'credit_card', 'ewallet', 'qris', 'convenience_store'),
            allowNull: false,
        },
        payment_channel: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'e.g., BCA, Mandiri, GoPay, etc.',
        },
        payment_provider: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'doku',
        },
        transaction_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Transaction ID from payment gateway',
        },
        transaction_token: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Payment token from Doku',
        },
        transaction_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Payment redirect URL',
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'success', 'failed', 'expired', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        payment_response: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Full response from payment gateway',
        },
        expired_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paid_at: {
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
        tableName: 'payments',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['order_id'], unique: true },
            { fields: ['transaction_id'], unique: true },
            { fields: ['status'] },
        ],
    }
);

export default Payment;
