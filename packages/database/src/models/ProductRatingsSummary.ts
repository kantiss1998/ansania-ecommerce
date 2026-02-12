import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { sequelize } from "../config/database";

import { Product } from "./Product";

export interface ProductRatingsSummaryAttributes {
  product_id: number;
  total_reviews: number;
  average_rating: number;
  rating_5_count: number;
  rating_4_count: number;
  rating_3_count: number;
  rating_2_count: number;
  rating_1_count: number;
  updated_at: Date;
}

export class ProductRatingsSummary extends Model<
  InferAttributes<ProductRatingsSummary>,
  InferCreationAttributes<ProductRatingsSummary>
> {
  declare product_id: ForeignKey<Product["id"]>;
  declare total_reviews: CreationOptional<number>;
  declare average_rating: CreationOptional<number>;
  declare rating_5_count: CreationOptional<number>;
  declare rating_4_count: CreationOptional<number>;
  declare rating_3_count: CreationOptional<number>;
  declare rating_2_count: CreationOptional<number>;
  declare rating_1_count: CreationOptional<number>;
  declare updated_at: CreationOptional<Date>;
}

ProductRatingsSummary.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    rating_5_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating_4_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating_3_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating_2_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating_1_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "product_ratings_summary",
    timestamps: false,
    updatedAt: "updated_at",
  },
);
