import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database';
import { Voucher } from './Voucher';
import { Product } from './Product';

export interface VoucherProductsAttributes {
    voucher_id: number;
    product_id: number;
}

export class VoucherProducts extends Model<
    InferAttributes<VoucherProducts>,
    InferCreationAttributes<VoucherProducts>
> {
    declare voucher_id: ForeignKey<Voucher['id']>;
    declare product_id: ForeignKey<Product['id']>;
}

VoucherProducts.init(
    {
        voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        tableName: 'voucher_products',
        timestamps: false,
    }
);
