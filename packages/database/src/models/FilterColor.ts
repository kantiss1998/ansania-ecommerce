import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../config/database';

export interface FilterColorAttributes {
    id: number;
    name: string;
    hex_code: string | null;
    display_order: number;
    is_active: boolean;
    created_at: Date;
}

export class FilterColor extends Model<
    InferAttributes<FilterColor>,
    InferCreationAttributes<FilterColor>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare hex_code: string | null;
    declare display_order: CreationOptional<number>;
    declare is_active: CreationOptional<boolean>;
    declare created_at: CreationOptional<Date>;
}

FilterColor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        hex_code: {
            type: DataTypes.STRING(7),
            allowNull: true,
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'filter_colors',
        timestamps: false,
    }
);
