import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("activity_logs", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "login, view_product, add_to_cart, checkout, etc",
      },
      entity_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "product, order, user",
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
        comment: "Additional data",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addIndex("activity_logs", ["user_id"], {
      name: "activity_logs_user_id_idx",
    });

    await queryInterface.addIndex("activity_logs", ["action"], {
      name: "activity_logs_action_idx",
    });

    await queryInterface.addIndex("activity_logs", ["created_at"], {
      name: "activity_logs_created_at_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("activity_logs");
  },
};
