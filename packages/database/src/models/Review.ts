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
import { Product } from './Product';
import type { ReviewImage } from './ReviewImage';
import { User } from './User';
// Use type-only imports to avoid circular dependencies

export interface ReviewAttributes {
    id: number;
    product_id: number;
    user_id: number;
    order_id: number;
    rating: number;
    title: string | null;
    comment: string | null;
    is_verified_purchase: boolean;
    is_approved: boolean;
    helpful_count: number;
    created_at: Date;
    updated_at: Date;
}

export class Review extends Model<
    InferAttributes<Review>,
    InferCreationAttributes<Review>
> {
    declare id: CreationOptional<number>;
    declare product_id: ForeignKey<Product['id']>;
    declare user_id: ForeignKey<User['id']>;
    declare order_id: ForeignKey<Order['id']>;

    declare rating: number;
    declare title: string | null;
    declare comment: string | null;
    declare is_verified_purchase: CreationOptional<boolean>;
    declare is_approved: CreationOptional<boolean>;
    declare helpful_count: CreationOptional<number>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare product?: NonAttribute<Product>;
    declare user?: NonAttribute<User>;
    declare order?: NonAttribute<Order>;
    declare images?: NonAttribute<ReviewImage[]>;

    declare static associations: {
        product: Association<Review, Product>;
        user: Association<Review, User>;
        order: Association<Review, Order>;
        images: Association<Review, ReviewImage>;
    };
}

Review.init(
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
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
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_verified_purchase: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Moderation approval',
        },
        helpful_count: {
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
        tableName: 'reviews',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['product_id'] },
            { fields: ['user_id'] },
            { fields: ['order_id'] },
            { fields: ['rating'] },
            { fields: ['is_approved'] },
            {
                fields: ['product_id', 'user_id', 'order_id'],
                unique: true,
                name: 'unique_product_user_order_review',
            },
        ],
    }
);

export default Review;
