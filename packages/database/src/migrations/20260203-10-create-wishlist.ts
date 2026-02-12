import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("wishlist", {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex("wishlist", ["user_id"], {
      name: "wishlist_user_id_idx",
    });

    await queryInterface.addIndex("wishlist", ["product_id"], {
      name: "wishlist_product_id_idx",
    });

    await queryInterface.addIndex(
      "wishlist",
      ["user_id", "product_id", "product_variant_id"],
      {
        unique: true,
        name: "wishlist_unique_user_product_variant",
      },
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("wishlist");
  },
};
