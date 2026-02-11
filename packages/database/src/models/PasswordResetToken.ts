import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { sequelize } from '../config/database';

import { User } from './User';

export interface PasswordResetTokenAttributes {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    used: boolean;
    created_at: Date;
}

export class PasswordResetToken extends Model<
    InferAttributes<PasswordResetToken>,
    InferCreationAttributes<PasswordResetToken>
> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare token: string;
    declare expires_at: Date;
    declare used: CreationOptional<boolean>;
    declare created_at: CreationOptional<Date>;
}

PasswordResetToken.init(
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
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'password_reset_tokens',
        timestamps: false,
        indexes: [
            { fields: ['token'] },
            { fields: ['user_id'] },
            { fields: ['expires_at'] },
        ],
    }
);
