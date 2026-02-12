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
import { ProductVariant } from "./ProductVariant";
import { User } from "./User";

export interface WishlistAttributes {
  id: number;
  user_id: number;
  product_id: number;
  product_variant_id: number | null;
  created_at: Date;
}

export class Wishlist extends Model<
  InferAttributes<Wishlist>,
  InferCreationAttributes<Wishlist>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User["id"]>;
  declare product_id: ForeignKey<Product["id"]>;
  declare product_variant_id: ForeignKey<ProductVariant["id"]> | null;
  declare created_at: CreationOptional<Date>;

  // Associations
  declare user?: NonAttribute<User>;
  declare product?: NonAttribute<Product>;
  declare productVariant?: NonAttribute<ProductVariant>;

  declare static associations: {
    user: Association<Wishlist, User>;
    product: Association<Wishlist, Product>;
    productVariant: Association<Wishlist, ProductVariant>;
  };
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
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
    product_variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "product_variants",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "wishlist",
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["product_id"] },
      {
        fields: ["user_id", "product_id", "product_variant_id"],
        unique: true,
        name: "unique_user_product_variant",
      },
    ],
  },
);

export default Wishlist;
