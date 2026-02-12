import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("payments", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      payment_method: {
        type: DataTypes.ENUM(
          "virtual_account",
          "credit_card",
          "ewallet",
          "qris",
          "convenience_store",
        ),
        allowNull: false,
      },
      payment_channel: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "e.g., BCA, Mandiri, GoPay, etc.",
      },
      payment_provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "doku",
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: "Transaction ID from payment gateway",
      },
      transaction_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "Payment token from Doku",
      },
      transaction_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "Payment redirect URL",
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "success",
          "failed",
          "expired",
          "cancelled",
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      payment_response: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Full response from payment gateway",
      },
      expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex("payments", ["order_id"], {
      unique: true,
      name: "payments_order_id_unique",
    });

    await queryInterface.addIndex("payments", ["transaction_id"], {
      unique: true,
      name: "payments_transaction_id_unique",
    });

    await queryInterface.addIndex("payments", ["status"], {
      name: "payments_status_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("payments");
  },
};
