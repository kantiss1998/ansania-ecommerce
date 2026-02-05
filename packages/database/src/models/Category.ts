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

export interface CategoryAttributes {
    id: number;
    odoo_id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    sort_order: number;
    synced_at: Date;
    created_at: Date;
    updated_at: Date;
}

export class Category extends Model<
    InferAttributes<Category>,
    InferCreationAttributes<Category>
> {
    declare id: CreationOptional<number>;
    declare odoo_id: number;
    declare parent_id: ForeignKey<Category['id']> | null;

    declare name: string;
    declare slug: string;
    declare description: string | null;
    declare image_url: string | null;
    declare is_active: CreationOptional<boolean>;
    declare sort_order: CreationOptional<number>;
    declare synced_at: CreationOptional<Date>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare parent?: NonAttribute<Category>;
    declare children?: NonAttribute<Category[]>;
    declare products?: NonAttribute<any[]>;

    declare static associations: {
        parent: Association<Category, Category>;
        children: Association<Category, Category>;
        products: Association<Category, any>;
    };
}

Category.init(
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
            comment: 'Product category ID from Odoo',
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id',
            },
            onDelete: 'SET NULL',
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
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        tableName: 'categories',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['odoo_id'], unique: true },
            { fields: ['slug'], unique: true },
            { fields: ['parent_id'] },
            { fields: ['is_active'] },
            { fields: ['sort_order'] },
        ],
    }
);

export default Category;
