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

import { Product } from './Product';

export interface ProductImageAttributes {
    id: number;
    product_id: number;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
    created_at: Date;
    updated_at: Date;
}

export class ProductImage extends Model<
    InferAttributes<ProductImage>,
    InferCreationAttributes<ProductImage>
> {
    declare id: CreationOptional<number>;
    declare product_id: ForeignKey<Product['id']>;

    declare image_url: string;
    declare alt_text: string | null;
    declare is_primary: CreationOptional<boolean>;
    declare sort_order: CreationOptional<number>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare product?: NonAttribute<Product>;
    declare static associations: {
        product: Association<ProductImage, Product>;
    };
}

ProductImage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        alt_text: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_primary: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        tableName: 'product_images',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['product_id'] },
            { fields: ['is_primary'] },
            { fields: ['sort_order'] },
        ],
    }
);

export default ProductImage;
