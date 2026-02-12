import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("user_sessions", {
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
        onUpdate: "CASCADE",
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
    });

    // Add indexes
    await queryInterface.addIndex("user_sessions", ["session_token"], {
      name: "user_sessions_session_token_idx",
    });

    await queryInterface.addIndex("user_sessions", ["user_id"], {
      name: "user_sessions_user_id_idx",
    });

    await queryInterface.addIndex("user_sessions", ["expires_at"], {
      name: "user_sessions_expires_at_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("user_sessions");
  },
};
