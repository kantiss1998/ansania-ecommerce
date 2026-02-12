import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { sequelize } from "../config/database";

import { ProductVariant } from "./ProductVariant";

export interface ProductStockAttributes {
  id: number;
  product_variant_id: number;
  odoo_warehouse_id: number | null;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  last_synced_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class ProductStock extends Model<
  InferAttributes<ProductStock>,
  InferCreationAttributes<ProductStock>
> {
  declare id: CreationOptional<number>;
  declare product_variant_id: ForeignKey<ProductVariant["id"]>;
  declare odoo_warehouse_id: number | null;
  declare quantity: CreationOptional<number>;
  declare reserved_quantity: CreationOptional<number>;
  declare available_quantity: CreationOptional<number>;
  declare last_synced_at: Date | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

ProductStock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    odoo_warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reserved_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_synced_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "product_stock",
    timestamps: true,
    indexes: [
      { fields: ["product_variant_id"], unique: true },
      { fields: ["available_quantity"] },
    ],
    hooks: {
      beforeSave: (instance: ProductStock) => {
        // Auto-compute available_quantity
        instance.available_quantity =
          instance.quantity - instance.reserved_quantity;
      },
    },
  },
);
