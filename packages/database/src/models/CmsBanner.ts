import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../config/database';

export interface CmsBannerAttributes {
    id: number;
    title: string | null;
    image_url: string;
    image_mobile_url: string | null;
    link_url: string | null;
    target_blank: boolean;
    display_order: number;
    is_active: boolean;
    start_date: Date | null;
    end_date: Date | null;
    created_at: Date;
    updated_at: Date;
}

export class CmsBanner extends Model<
    InferAttributes<CmsBanner>,
    InferCreationAttributes<CmsBanner>
> {
    declare id: CreationOptional<number>;
    declare title: string | null;
    declare image_url: string;
    declare image_mobile_url: string | null;
    declare link_url: string | null;
    declare target_blank: CreationOptional<boolean>;
    declare display_order: CreationOptional<number>;
    declare is_active: CreationOptional<boolean>;
    declare start_date: Date | null;
    declare end_date: Date | null;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CmsBanner.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        image_mobile_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        link_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        target_blank: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        display_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_date: {
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
        tableName: 'cms_banners',
        timestamps: true,
    }
);
