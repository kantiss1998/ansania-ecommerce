import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { sequelize } from '../config/database';

import { User } from './User';

export interface NotificationAttributes {
    id: number;
    user_id: number;
    type: string;
    title: string;
    message: string;
    related_type: string | null;
    related_id: number | null;
    is_read: boolean;
    read_at: Date | null;
    created_at: Date;
}

export class Notification extends Model<
    InferAttributes<Notification>,
    InferCreationAttributes<Notification>
> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare type: string;
    declare title: string;
    declare message: string;
    declare related_type: string | null;
    declare related_id: number | null;
    declare is_read: CreationOptional<boolean>;
    declare read_at: Date | null;
    declare created_at: CreationOptional<Date>;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        related_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        related_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        read_at: {
            type: DataTypes.DATE,
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
        tableName: 'notifications',
        timestamps: false,
    }
);
