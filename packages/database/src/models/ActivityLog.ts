import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { sequelize } from "../config/database";

import { User } from "./User";

export interface ActivityLogAttributes {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export class ActivityLog extends Model<
  InferAttributes<ActivityLog>,
  InferCreationAttributes<ActivityLog>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User["id"]> | null;
  declare action: string;
  declare entity_type: string | null;
  declare entity_id: number | null;
  declare ip_address: string | null;
  declare user_agent: string | null;
  declare metadata: Record<string, unknown> | null;
  declare created_at: CreationOptional<Date>;
}

ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
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
    tableName: "activity_logs",
    timestamps: false,
  },
);
