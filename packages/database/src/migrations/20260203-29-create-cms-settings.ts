import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('cms_settings', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            setting_key: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            setting_value: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            setting_type: {
                type: DataTypes.ENUM('text', 'textarea', 'longtext', 'image', 'boolean', 'json', 'number', 'color'),
                allowNull: false,
                defaultValue: 'text',
            },
            setting_group: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: 'general, contact, social, shipping, payment',
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Admin user ID',
            },
        });

        await queryInterface.addIndex('cms_settings', ['setting_key'], {
            unique: true,
            name: 'cms_settings_setting_key_unique',
        });

        await queryInterface.addIndex('cms_settings', ['setting_group'], {
            name: 'cms_settings_setting_group_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('cms_settings');
    },
};
