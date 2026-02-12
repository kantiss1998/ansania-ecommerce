import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  Association,
} from "sequelize";

import { sequelize } from "../config/database";

import { Product } from "./Product";
import { ProductStock } from "./ProductStock";

export interface ProductVariantAttributes {
  id: number;
  product_id: number;
  odoo_product_id: number;
  sku: string;
  color: string | null;
  finishing: string | null;
  size: string | null;
  price: number;
  stock: number;
  is_visible: boolean;
  synced_at: Date;
  created_at: Date;
  updated_at: Date;
}

export class ProductVariant extends Model<
  InferAttributes<ProductVariant>,
  InferCreationAttributes<ProductVariant>
> {
  declare id: CreationOptional<number>;
  declare product_id: ForeignKey<Product["id"]>;
  declare odoo_product_id: number;

  declare sku: string;
  declare color: string | null;
  declare finishing: string | null;
  declare size: string | null;
  declare price: number;
  declare stock: CreationOptional<number>;
  declare is_visible: CreationOptional<boolean>;
  declare synced_at: CreationOptional<Date>;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // Associations
  declare product?: NonAttribute<Product>;
  declare inventory?: NonAttribute<ProductStock>;

  declare static associations: {
    product: Association<ProductVariant, Product>;
    inventory: Association<ProductVariant, ProductStock>;
  };
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    odoo_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: "Product variant ID from Odoo",
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    finishing: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    synced_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "product_variants",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["product_id"] },
      { fields: ["odoo_product_id"], unique: true },
      { fields: ["sku"], unique: true },
      { fields: ["stock"] },
      { fields: ["is_visible"] },
    ],
  },
);

export default ProductVariant;
