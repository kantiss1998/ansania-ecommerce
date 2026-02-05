import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export interface SearchHistoryAttributes {
    id: number;
    user_id: number | null;
    session_id: string | null;
    search_query: string;
    results_count: number;
    filters_applied: Record<string, any> | null;
    created_at: Date;
}

export class SearchHistory extends Model<
    InferAttributes<SearchHistory>,
    InferCreationAttributes<SearchHistory>
> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']> | null;
    declare session_id: string | null;
    declare search_query: string;
    declare results_count: CreationOptional<number>;
    declare filters_applied: Record<string, any> | null;
    declare created_at: CreationOptional<Date>;
}

SearchHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        session_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        search_query: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        results_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        filters_applied: {
            type: DataTypes.JSON,
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
        tableName: 'search_history',
        timestamps: false,
    }
);
