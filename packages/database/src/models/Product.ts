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

import { Category } from './Category';
// Use type-only imports to avoid circular dependencies
import type { ProductImage } from './ProductImage';
import type { ProductVariant } from './ProductVariant';
import type { Review } from './Review';

export interface ProductAttributes {
    id: number;
    odoo_id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    selling_price: number;
    compare_price: number | null;
    sku: string | null;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    is_featured: boolean;
    is_active: boolean;
    meta_title: string | null;
    meta_description: string | null;
    synced_at: Date;
    created_at: Date;
    updated_at: Date;
}

export class Product extends Model<
    InferAttributes<Product>,
    InferCreationAttributes<Product>
> {
    declare id: CreationOptional<number>;
    declare odoo_id: number;
    declare category_id: ForeignKey<Category['id']>;

    declare name: string;
    declare slug: string;
    declare description: string | null;
    declare short_description: string | null;
    declare selling_price: number;
    declare compare_price: number | null;
    declare sku: string | null;
    declare weight: number | null;
    declare length: number | null;
    declare width: number | null;
    declare height: number | null;
    declare is_featured: CreationOptional<boolean>;
    declare is_active: CreationOptional<boolean>;
    declare meta_title: string | null;
    declare meta_description: string | null;
    declare synced_at: CreationOptional<Date>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare category?: NonAttribute<Category>;
    declare variants?: NonAttribute<ProductVariant[]>;
    declare images?: NonAttribute<ProductImage[]>;
    declare reviews?: NonAttribute<Review[]>;

    declare static associations: {
        category: Association<Product, Category>;
        variants: Association<Product, ProductVariant>;
        images: Association<Product, ProductImage>;
        reviews: Association<Product, Review>;
    };
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        odoo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            comment: 'Product template ID from Odoo',
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        short_description: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        selling_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        compare_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Original price before discount',
        },
        sku: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Weight in grams',
        },
        length: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Length in cm',
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Width in cm',
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Height in cm',
        },
        is_featured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        meta_title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        synced_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Last sync time from Odoo',
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
        tableName: 'products',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['odoo_id'], unique: true },
            { fields: ['slug'], unique: true },
            { fields: ['category_id'] },
            { fields: ['is_featured'] },
            { fields: ['is_active'] },
            { fields: ['selling_price'] },
        ],
    }
);

export default Product;
