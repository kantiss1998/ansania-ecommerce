import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';

import { sequelize } from '../config/database';

import { Category } from './Category';
import { Voucher } from './Voucher';

export interface VoucherCategoriesAttributes {
    voucher_id: number;
    category_id: number;
}

export class VoucherCategories extends Model<
    InferAttributes<VoucherCategories>,
    InferCreationAttributes<VoucherCategories>
> {
    declare voucher_id: ForeignKey<Voucher['id']>;
    declare category_id: ForeignKey<Category['id']>;
}

VoucherCategories.init(
    {
        voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        tableName: 'voucher_categories',
        timestamps: false,
    }
);
