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

export interface ShippingAttributes {
    id: number;
    order_id: number;
    recipient_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    courier: string;
    service: string;
    tracking_number: string | null;
    cost: number;
    estimated_delivery: string | null;
    shipped_at: Date | null;
    delivered_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class Shipping extends Model<
    InferAttributes<Shipping>,
    InferCreationAttributes<Shipping>
> {
    declare id: CreationOptional<number>;
    declare order_id: ForeignKey<Order['id']>;

    declare recipient_name: string;
    declare phone: string;
    declare address: string;
    declare city: string;
    declare province: string;
    declare postal_code: string;
    declare courier: string;
    declare service: string;
    declare tracking_number: string | null;
    declare cost: number;
    declare estimated_delivery: string | null;
    declare shipped_at: Date | null;
    declare delivered_at: Date | null;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare order?: NonAttribute<Order>;
    declare static associations: {
        order: Association<Shipping, Order>;
    };
}

Shipping.init(
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
        recipient_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Full address snapshot',
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        province: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        courier: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'JNT, JNE, etc.',
        },
        service: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'REG, YES, etc.',
        },
        tracking_number: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        cost: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        estimated_delivery: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'e.g., 2-3 days',
        },
        shipped_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        delivered_at: {
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
        tableName: 'shipping',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['order_id'], unique: true },
            { fields: ['tracking_number'] },
            { fields: ['courier'] },
        ],
    }
);

export default Shipping;
