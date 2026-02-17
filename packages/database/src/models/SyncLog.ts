import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../config/database";

export interface SyncLogAttributes {
  id: number;
  sync_type:
    | "products"
    | "stock"
    | "orders"
    | "customers"
    | "addresses"
    | "categories"
    | "full_sync";
  sync_direction: "from_odoo" | "to_odoo";
  status: "success" | "failed" | "partial";
  records_processed: number;
  records_failed: number;
  error_message: string | null;
  execution_time_ms: number | null;
  created_at: Date;
}

export class SyncLog extends Model<
  InferAttributes<SyncLog>,
  InferCreationAttributes<SyncLog>
> {
  declare id: CreationOptional<number>;
  declare sync_type:
    | "products"
    | "stock"
    | "orders"
    | "customers"
    | "addresses"
    | "categories"
    | "full_sync";
  declare sync_direction: "from_odoo" | "to_odoo";
  declare status: "success" | "failed" | "partial";
  declare records_processed: CreationOptional<number>;
  declare records_failed: CreationOptional<number>;
  declare error_message: string | null;
  declare execution_time_ms: number | null;
  declare created_at: CreationOptional<Date>;
}

SyncLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sync_type: {
      type: DataTypes.ENUM(
        "products",
        "stock",
        "orders",
        "customers",
        "addresses",
        "categories",
        "full_sync",
      ),
      allowNull: false,
    },
    sync_direction: {
      type: DataTypes.ENUM("from_odoo", "to_odoo"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("success", "failed", "partial"),
      allowNull: false,
    },
    records_processed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    records_failed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    execution_time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "sync_logs",
    timestamps: false,
  },
);
