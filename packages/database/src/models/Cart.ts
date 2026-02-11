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

import type { CartItem } from './CartItem';
import { User } from './User';
// Use type-only imports to avoid circular dependencies
import type { Voucher } from './Voucher';

export interface CartAttributes {
    id: number;
    user_id: number | null;
    session_id: string | null;
    voucher_id: number | null;
    subtotal: number;
    discount_amount: number;
    total: number;
    expires_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class Cart extends Model<
    InferAttributes<Cart>,
    InferCreationAttributes<Cart>
> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']> | null;
    declare session_id: string | null;
    declare voucher_id: number | null;

    declare subtotal: CreationOptional<number>;
    declare discount_amount: CreationOptional<number>;
    declare total: CreationOptional<number>;
    declare expires_at: Date | null;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare user?: NonAttribute<User>;
    declare items?: NonAttribute<CartItem[]>;
    declare voucher?: NonAttribute<Voucher>;

    declare static associations: {
        user: Association<Cart, User>;
        items: Association<Cart, CartItem>;
        voucher: Association<Cart, Voucher>;
    };
}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        session_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'For guest users',
        },
        voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'vouchers',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        subtotal: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        discount_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        total: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Cart expiry for guest users',
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
        tableName: 'carts',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['session_id'] },
            { fields: ['expires_at'] },
        ],
    }
);

export default Cart;
