import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("vouchers", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discount_type: {
        type: DataTypes.ENUM("percentage", "fixed_amount", "free_shipping"),
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Percentage value or fixed amount",
      },
      max_discount_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "Max discount for percentage type",
      },
      min_purchase_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Total usage limit, null = unlimited",
      },
      usage_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      usage_limit_per_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.addIndex("vouchers", ["code"], {
      unique: true,
      name: "vouchers_code_unique",
    });

    await queryInterface.addIndex("vouchers", ["is_active"], {
      name: "vouchers_is_active_idx",
    });

    await queryInterface.addIndex("vouchers", ["start_date", "end_date"], {
      name: "vouchers_date_range_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("vouchers");
  },
};
