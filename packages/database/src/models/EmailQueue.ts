import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

export interface EmailQueueAttributes {
    id: number;
    recipient_email: string;
    recipient_name: string | null;
    subject: string;
    body: string;
    template_name: string | null;
    priority: 'low' | 'normal' | 'high';
    status: 'pending' | 'sent' | 'failed';
    attempts: number;
    max_attempts: number;
    error_message: string | null;
    scheduled_at: Date;
    sent_at: Date | null;
    created_at: Date;
}

export class EmailQueue extends Model<
    InferAttributes<EmailQueue>,
    InferCreationAttributes<EmailQueue>
> {
    declare id: CreationOptional<number>;
    declare recipient_email: string;
    declare recipient_name: string | null;
    declare subject: string;
    declare body: string;
    declare template_name: string | null;
    declare priority: CreationOptional<'low' | 'normal' | 'high'>;
    declare status: CreationOptional<'pending' | 'sent' | 'failed'>;
    declare attempts: CreationOptional<number>;
    declare max_attempts: CreationOptional<number>;
    declare error_message: string | null;
    declare scheduled_at: CreationOptional<Date>;
    declare sent_at: Date | null;
    declare created_at: CreationOptional<Date>;
}

EmailQueue.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        recipient_email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        recipient_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        subject: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        template_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high'),
            allowNull: false,
            defaultValue: 'normal',
        },
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        max_attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        sent_at: {
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
        tableName: 'email_queue',
        timestamps: false,
    }
);
