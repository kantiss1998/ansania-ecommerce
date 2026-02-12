import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("reviews", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_verified_purchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Moderation approval",
      },
      helpful_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex("reviews", ["product_id"], {
      name: "reviews_product_id_idx",
    });

    await queryInterface.addIndex("reviews", ["user_id"], {
      name: "reviews_user_id_idx",
    });

    await queryInterface.addIndex("reviews", ["order_id"], {
      name: "reviews_order_id_idx",
    });

    await queryInterface.addIndex("reviews", ["rating"], {
      name: "reviews_rating_idx",
    });

    await queryInterface.addIndex("reviews", ["is_approved"], {
      name: "reviews_is_approved_idx",
    });

    await queryInterface.addIndex(
      "reviews",
      ["product_id", "user_id", "order_id"],
      {
        unique: true,
        name: "reviews_unique_product_user_order",
      },
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("reviews");
  },
};
