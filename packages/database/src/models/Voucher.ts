import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    Association,
} from 'sequelize';
import { sequelize } from '../config/database';

export type VoucherType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface VoucherAttributes {
    id: number;
    code: string;
    name: string;
    description: string | null;
    discount_type: VoucherType;
    discount_value: number;
    max_discount_amount: number | null;
    min_purchase_amount: number;
    usage_limit: number | null;
    usage_count: number;
    usage_limit_per_user: number;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export class Voucher extends Model<
    InferAttributes<Voucher>,
    InferCreationAttributes<Voucher>
> {
    declare id: CreationOptional<number>;
    declare code: string;
    declare name: string;
    declare description: string | null;
    declare discount_type: VoucherType;
    declare discount_value: number;
    declare max_discount_amount: number | null;
    declare min_purchase_amount: CreationOptional<number>;
    declare usage_limit: number | null;
    declare usage_count: CreationOptional<number>;
    declare usage_limit_per_user: CreationOptional<number>;
    declare start_date: Date;
    declare end_date: Date;
    declare is_active: CreationOptional<boolean>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare usages?: NonAttribute<any[]>;
    declare static associations: {
        usages: Association<Voucher, any>;
    };

    // Instance methods
    isValid(cartTotal: number): boolean {
        const now = new Date();
        return (
            this.is_active &&
            now >= this.start_date &&
            now <= this.end_date &&
            cartTotal >= this.min_purchase_amount &&
            (this.usage_limit === null || this.usage_count < this.usage_limit)
        );
    }

    calculateDiscount(cartTotal: number): number {
        let discount = 0;

        if (this.discount_type === 'percentage') {
            discount = (cartTotal * this.discount_value) / 100;
            if (this.max_discount_amount && discount > this.max_discount_amount) {
                discount = this.max_discount_amount;
            }
        } else if (this.discount_type === 'fixed_amount') {
            discount = this.discount_value;
        }

        return Math.min(discount, cartTotal);
    }
}

Voucher.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        discount_type: {
            type: DataTypes.ENUM('percentage', 'fixed_amount', 'free_shipping'),
            allowNull: false,
        },
        discount_value: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Percentage value or fixed amount',
        },
        max_discount_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Max discount for percentage type',
        },
        min_purchase_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
        },
        usage_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Total usage limit, null = unlimited',
        },
        usage_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        usage_limit_per_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        tableName: 'vouchers',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['code'], unique: true },
            { fields: ['is_active'] },
            { fields: ['start_date', 'end_date'] },
        ],
    }
);

export default Voucher;
