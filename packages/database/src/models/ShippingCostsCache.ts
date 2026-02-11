import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../config/database';

export interface ShippingCostsCacheAttributes {
    id: number;
    origin_city_id: number;
    destination_city_id: number;
    courier: string;
    service: string;
    weight: number;
    cost: number;
    etd: string | null;
    cached_at: Date;
    expires_at: Date | null;
}

export class ShippingCostsCache extends Model<
    InferAttributes<ShippingCostsCache>,
    InferCreationAttributes<ShippingCostsCache>
> {
    declare id: CreationOptional<number>;
    declare origin_city_id: number;
    declare destination_city_id: number;
    declare courier: string;
    declare service: string;
    declare weight: number;
    declare cost: number;
    declare etd: string | null;
    declare cached_at: CreationOptional<Date>;
    declare expires_at: Date | null;
}

ShippingCostsCache.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        origin_city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        destination_city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courier: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        service: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cost: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        etd: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        cached_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'shipping_costs_cache',
        timestamps: false,
    }
);
