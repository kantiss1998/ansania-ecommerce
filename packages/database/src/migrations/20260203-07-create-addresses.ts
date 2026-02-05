import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('addresses', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            label: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: 'e.g., Home, Office, etc.',
            },
            recipient_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            address_line1: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            address_line2: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            district: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            subdistrict: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            province: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            postal_code: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            is_default: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            latitude: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: true,
            },
            longitude: {
                type: DataTypes.DECIMAL(11, 8),
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

        // Add indexes
        await queryInterface.addIndex('addresses', ['user_id'], {
            name: 'addresses_user_id_idx',
        });

        await queryInterface.addIndex('addresses', ['is_default'], {
            name: 'addresses_is_default_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('addresses');
    },
};
