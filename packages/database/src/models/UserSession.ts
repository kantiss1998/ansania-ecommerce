import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";

import { sequelize } from "../config/database";

import { User } from "./User";

export interface UserSessionAttributes {
  id: number;
  user_id: number;
  session_token: string;
  refresh_token: string | null;
  device_info: string | null;
  ip_address: string | null;
  expires_at: Date;
  created_at: Date;
}

export class UserSession extends Model<
  InferAttributes<UserSession>,
  InferCreationAttributes<UserSession>
> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<User["id"]>;
  declare session_token: string;
  declare refresh_token: string | null;
  declare device_info: string | null;
  declare ip_address: string | null;
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;

  // Associations
  declare user?: NonAttribute<User>;
}

UserSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    session_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    device_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
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
    tableName: "user_sessions",
    timestamps: false,
    indexes: [
      { fields: ["session_token"] },
      { fields: ["user_id"] },
      { fields: ["expires_at"] },
    ],
  },
);
