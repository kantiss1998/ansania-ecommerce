import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
    Association,
} from 'sequelize';
import { sequelize } from '../config/database';
import { Voucher } from './Voucher';
import { User } from './User';
import { Order } from './Order';

export interface VoucherUsageAttributes {
    id: number;
    voucher_id: number;
    user_id: number;
    order_id: number;
    used_at: Date;
}

export class VoucherUsage extends Model<
    InferAttributes<VoucherUsage>,
    InferCreationAttributes<VoucherUsage>
> {
    declare id: CreationOptional<number>;
    declare voucher_id: ForeignKey<Voucher['id']>;
    declare user_id: ForeignKey<User['id']>;
    declare order_id: ForeignKey<Order['id']>;
    declare used_at: CreationOptional<Date>;

    // Associations
    declare voucher?: NonAttribute<Voucher>;
    declare user?: NonAttribute<User>;
    declare order?: NonAttribute<Order>;

    declare static associations: {
        voucher: Association<VoucherUsage, Voucher>;
        user: Association<VoucherUsage, User>;
        order: Association<VoucherUsage, Order>;
    };
}

VoucherUsage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vouchers',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'voucher_usage',
        timestamps: false,
        underscored: true,
        indexes: [
            { fields: ['voucher_id'] },
            { fields: ['user_id'] },
            { fields: ['order_id'] },
            {
                fields: ['voucher_id', 'user_id'],
                name: 'idx_voucher_user',
            },
        ],
    }
);

export default VoucherUsage;
