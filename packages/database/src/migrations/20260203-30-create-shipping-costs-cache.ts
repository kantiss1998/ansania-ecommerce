import { QueryInterface, DataTypes } from "sequelize";

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("shipping_costs_cache", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      origin_city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Origin branch/area code (JNT Express) atau city ID",
      },
      destination_city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Destination branch/area code (JNT) atau city ID",
      },
      courier: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "jnt, jne, tiki, pos, sicepat",
      },
      service: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "REG, YES, dll",
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "gram",
      },
      cost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      etd: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Estimasi hari",
      },
      cached_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Cache 24 jam",
      },
    });

    await queryInterface.addIndex(
      "shipping_costs_cache",
      ["origin_city_id", "destination_city_id", "courier", "service", "weight"],
      {
        unique: true,
        name: "shipping_costs_cache_unique_shipping",
      },
    );

    await queryInterface.addIndex("shipping_costs_cache", ["expires_at"], {
      name: "shipping_costs_cache_expires_at_idx",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("shipping_costs_cache");
  },
};
