import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("product_categories", {
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
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });

    // Add composite primary key
    await queryInterface.addConstraint("product_categories", {
      fields: ["product_id", "category_id"],
      type: "primary key",
      name: "product_categories_pk",
    });

    // Add indexes
    await queryInterface.addIndex("product_categories", ["product_id"], {
      name: "product_categories_product_id_idx",
    });

    await queryInterface.addIndex("product_categories", ["category_id"], {
      name: "product_categories_category_id_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("product_categories");
  },
};
