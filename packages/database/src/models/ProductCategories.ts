import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database';
import { Product } from './Product';
import { Category } from './Category';

// ProductCategories junction model
export class ProductCategories extends Model<
    InferAttributes<ProductCategories>,
    InferCreationAttributes<ProductCategories>
> {
    declare product_id: ForeignKey<Product['id']>;
    declare category_id: ForeignKey<Category['id']>;
}

ProductCategories.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        tableName: 'product_categories',
        timestamps: false,
    }
);
