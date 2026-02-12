import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export interface CmsSettingAttributes {
  id: number;
  setting_key: string;
  setting_value: string | null;
  setting_type:
    | "text"
    | "textarea"
    | "longtext"
    | "image"
    | "boolean"
    | "json"
    | "number"
    | "color";
  setting_group: string | null;
  description: string | null;
  updated_at: Date;
  updated_by: number | null;
}

export class CmsSetting extends Model<
  InferAttributes<CmsSetting>,
  InferCreationAttributes<CmsSetting>
> {
  declare id: CreationOptional<number>;
  declare setting_key: string;
  declare setting_value: string | null;
  declare setting_type: CreationOptional<
    | "text"
    | "textarea"
    | "longtext"
    | "image"
    | "boolean"
    | "json"
    | "number"
    | "color"
  >;
  declare setting_group: string | null;
  declare description: string | null;
  declare updated_at: CreationOptional<Date>;
  declare updated_by: number | null;
}

CmsSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    setting_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    setting_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    setting_type: {
      type: DataTypes.ENUM(
        "text",
        "textarea",
        "longtext",
        "image",
        "boolean",
        "json",
        "number",
        "color",
      ),
      allowNull: false,
      defaultValue: "text",
    },
    setting_group: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "cms_settings",
    timestamps: false,
    updatedAt: "updated_at",
  },
);
