import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("product_stock", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "product_variants",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      odoo_warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Gudang Online ID dari Odoo",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reserved_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Stock yang di-cart belum checkout",
      },
      available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "quantity - reserved_quantity (computed)",
      },
      last_synced_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Last sync from Odoo (every 30 min)",
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
    await queryInterface.addIndex("product_stock", ["product_variant_id"], {
      unique: true,
      name: "product_stock_product_variant_id_unique",
    });

    await queryInterface.addIndex("product_stock", ["available_quantity"], {
      name: "product_stock_available_quantity_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("product_stock");
  },
};
