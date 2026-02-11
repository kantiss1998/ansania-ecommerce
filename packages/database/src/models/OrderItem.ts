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

export interface OrderItemAttributes {
    id: number;
    order_id: number;
    product_id: number;
    product_variant_id: number;
    product_name: string;
    variant_name: string | null;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: Date;
    updated_at: Date;
}

export class OrderItem extends Model<
    InferAttributes<OrderItem>,
    InferCreationAttributes<OrderItem>
> {
    declare id: CreationOptional<number>;
    declare order_id: ForeignKey<Order['id']>;
    declare product_id: number;
    declare product_variant_id: number;

    declare product_name: string;
    declare variant_name: string | null;
    declare sku: string;
    declare quantity: number;
    declare price: number;
    declare subtotal: number;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare order?: NonAttribute<Order>;
    declare static associations: {
        order: Association<OrderItem, Order>;
    };
}

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Snapshot of product ID',
        },
        product_variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Snapshot of variant ID',
        },
        product_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Product name at time of order',
        },
        variant_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Variant combo (Color / Finishing / Size)',
        },
        sku: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Price at time of order',
        },
        subtotal: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
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
        tableName: 'order_items',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['order_id'] },
            { fields: ['product_id'] },
            { fields: ['sku'] },
        ],
    }
);

export default OrderItem;
