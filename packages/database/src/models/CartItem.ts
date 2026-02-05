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
import { Cart } from './Cart';
import { ProductVariant } from './ProductVariant';

export interface CartItemAttributes {
    id: number;
    cart_id: number;
    product_variant_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: Date;
    updated_at: Date;
}

export class CartItem extends Model<
    InferAttributes<CartItem>,
    InferCreationAttributes<CartItem>
> {
    declare id: CreationOptional<number>;
    declare cart_id: ForeignKey<Cart['id']>;
    declare product_variant_id: ForeignKey<ProductVariant['id']>;

    declare quantity: number;
    declare price: number;
    declare subtotal: number;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare cart?: NonAttribute<Cart>;
    declare productVariant?: NonAttribute<ProductVariant>;

    declare static associations: {
        cart: Association<CartItem, Cart>;
        productVariant: Association<CartItem, ProductVariant>;
    };
}

CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'carts',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        product_variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Price at the time of adding to cart',
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
        tableName: 'cart_items',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['cart_id'] },
            { fields: ['product_variant_id'] },
            {
                fields: ['cart_id', 'product_variant_id'],
                unique: true,
                name: 'unique_cart_variant',
            },
        ],
    }
);

export default CartItem;
