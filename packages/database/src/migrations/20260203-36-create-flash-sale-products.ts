import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("flash_sale_products", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      flash_sale_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "flash_sales",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      product_variant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "product_variants",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      original_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      flash_sale_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      stock_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Stock terbatas untuk flash sale",
      },
      sold_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });

    await queryInterface.addIndex("flash_sale_products", ["flash_sale_id"], {
      name: "flash_sale_products_flash_sale_id_idx",
    });

    await queryInterface.addIndex("flash_sale_products", ["product_id"], {
      name: "flash_sale_products_product_id_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("flash_sale_products");
  },
};
