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

import { Review } from "./Review";

export interface ReviewImageAttributes {
  id: number;
  review_id: number;
  image_url: string;
  created_at: Date;
}

export class ReviewImage extends Model<
  InferAttributes<ReviewImage>,
  InferCreationAttributes<ReviewImage>
> {
  declare id: CreationOptional<number>;
  declare review_id: ForeignKey<Review["id"]>;
  declare image_url: string;
  declare created_at: CreationOptional<Date>;

  // Associations
  declare review?: NonAttribute<Review>;
  declare static associations: {
    review: Association<ReviewImage, Review>;
  };
}

ReviewImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reviews",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "review_images",
    timestamps: false,
    underscored: true,
    indexes: [{ fields: ["review_id"] }],
  },
);

export default ReviewImage;
