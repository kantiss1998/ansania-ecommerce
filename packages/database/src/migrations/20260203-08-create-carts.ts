import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("carts", {
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      session_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "For guest users",
      },
      voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "vouchers",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Cart expiry for guest users",
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
    await queryInterface.addIndex("carts", ["user_id"], {
      name: "carts_user_id_idx",
    });

    await queryInterface.addIndex("carts", ["session_id"], {
      name: "carts_session_id_idx",
    });

    await queryInterface.addIndex("carts", ["expires_at"], {
      name: "carts_expires_at_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("carts");
  },
};
