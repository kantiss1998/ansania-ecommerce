import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../config/database';

export interface CmsPageAttributes {
    id: number;
    slug: string;
    title: string;
    content: string | null;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class CmsPage extends Model<
    InferAttributes<CmsPage>,
    InferCreationAttributes<CmsPage>
> {
    declare id: CreationOptional<number>;
    declare slug: string;
    declare title: string;
    declare content: string | null;
    declare meta_title: string | null;
    declare meta_description: string | null;
    declare is_published: CreationOptional<boolean>;
    declare published_at: Date | null;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CmsPage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        meta_title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        published_at: {
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
        tableName: 'cms_pages',
        timestamps: true,
    }
);
