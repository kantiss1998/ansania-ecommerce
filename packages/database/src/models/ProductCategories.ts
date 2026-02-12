import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  NonAttribute,
} from "sequelize";

import { sequelize } from "../config/database";

import { Category } from "./Category";
import { Product } from "./Product";

// ProductCategories junction model
export class ProductCategories extends Model<
  InferAttributes<ProductCategories>,
  InferCreationAttributes<ProductCategories>
> {
  declare product_id: ForeignKey<Product["id"]>;
  declare category_id: ForeignKey<Category["id"]>;

  // Associations
  declare product?: NonAttribute<Product>;
  declare category?: NonAttribute<Category>;
}

ProductCategories.init(
  {
    product_id: {
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
    tableName: "product_categories",
    timestamps: false,
  },
);
