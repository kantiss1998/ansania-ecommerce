import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("order_items", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Snapshot of product ID",
      },
      product_variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Snapshot of variant ID",
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Product name at time of order",
      },
      variant_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Variant combo (Color / Finishing / Size)",
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Price at time of order",
      },
      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
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
    await queryInterface.addIndex("order_items", ["order_id"], {
      name: "order_items_order_id_idx",
    });

    await queryInterface.addIndex("order_items", ["product_id"], {
      name: "order_items_product_id_idx",
    });

    await queryInterface.addIndex("order_items", ["sku"], {
      name: "order_items_sku_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("order_items");
  },
};
