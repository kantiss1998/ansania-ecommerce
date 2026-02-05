import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Product } from './Product';

export interface ProductViewAttributes {
    id: number;
    product_id: number;
    user_id: number | null;
    session_id: string | null;
    referrer_url: string | null;
    ip_address: string | null;
    created_at: Date;
}

export class ProductView extends Model<
    InferAttributes<ProductView>,
    InferCreationAttributes<ProductView>
> {
    declare id: CreationOptional<number>;
    declare product_id: ForeignKey<Product['id']>;
    declare user_id: ForeignKey<User['id']> | null;
    declare session_id: string | null;
    declare referrer_url: string | null;
    declare ip_address: string | null;
    declare created_at: CreationOptional<Date>;
}

ProductView.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        session_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        referrer_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'product_views',
        timestamps: false,
    }
);
