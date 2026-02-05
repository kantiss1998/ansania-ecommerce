import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FilterSizeAttributes {
    id: number;
    name: string;
    display_order: number;
    is_active: boolean;
    created_at: Date;
}

export class FilterSize extends Model<
    InferAttributes<FilterSize>,
    InferCreationAttributes<FilterSize>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare display_order: CreationOptional<number>;
    declare is_active: CreationOptional<boolean>;
    declare created_at: CreationOptional<Date>;
}

FilterSize.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
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
        tableName: 'filter_sizes',
        timestamps: false,
    }
);
