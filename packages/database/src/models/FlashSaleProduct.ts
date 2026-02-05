import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database';
import { Product } from './Product';
import { ProductVariant } from './ProductVariant';
import { FlashSale } from './FlashSale';

export interface FlashSaleProductAttributes {
    id: number;
    flash_sale_id: number;
    product_id: number;
    product_variant_id: number | null;
    original_price: number;
    flash_sale_price: number;
    stock_limit: number | null;
    sold_count: number;
    is_active: boolean;
}

export class FlashSaleProduct extends Model<
    InferAttributes<FlashSaleProduct>,
    InferCreationAttributes<FlashSaleProduct>
> {
    declare id: CreationOptional<number>;
    declare flash_sale_id: ForeignKey<FlashSale['id']>;
    declare product_id: ForeignKey<Product['id']>;
    declare product_variant_id: ForeignKey<ProductVariant['id']> | null;
    declare original_price: number;
    declare flash_sale_price: number;
    declare stock_limit: number | null;
    declare sold_count: CreationOptional<number>;
    declare is_active: CreationOptional<boolean>;
}

FlashSaleProduct.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        flash_sale_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_variant_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        original_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        flash_sale_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        stock_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sold_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'flash_sale_products',
        timestamps: false,
    }
);
