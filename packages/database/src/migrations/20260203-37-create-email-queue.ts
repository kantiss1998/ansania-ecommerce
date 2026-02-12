import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("email_queue", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recipient_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      recipient_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      template_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "order_confirmation, password_reset, etc",
      },
      priority: {
        type: DataTypes.ENUM("low", "normal", "high"),
        allowNull: false,
        defaultValue: "normal",
      },
      status: {
        type: DataTypes.ENUM("pending", "sent", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      max_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addIndex("email_queue", ["status"], {
      name: "email_queue_status_idx",
    });

    await queryInterface.addIndex("email_queue", ["scheduled_at"], {
      name: "email_queue_scheduled_at_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("email_queue");
  },
};
