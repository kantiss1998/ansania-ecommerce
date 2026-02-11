import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../config/database';

export interface FlashSaleAttributes {
    id: number;
    name: string;
    description: string | null;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export class FlashSale extends Model<
    InferAttributes<FlashSale>,
    InferCreationAttributes<FlashSale>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string | null;
    declare start_date: Date;
    declare end_date: Date;
    declare is_active: CreationOptional<boolean>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

FlashSale.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        tableName: 'flash_sales',
        timestamps: true,
    }
);
