import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("cms_banners", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      image_mobile_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      link_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      target_blank: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
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

    await queryInterface.addIndex("cms_banners", ["display_order"], {
      name: "cms_banners_display_order_idx",
    });

    await queryInterface.addIndex("cms_banners", ["is_active"], {
      name: "cms_banners_is_active_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("cms_banners");
  },
};
