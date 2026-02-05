import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('shipping', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'orders',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            recipient_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: 'Full address snapshot',
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            province: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            postal_code: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            courier: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: 'JNT, JNE, etc.',
            },
            service: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: 'REG, YES, etc.',
            },
            tracking_number: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            cost: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            estimated_delivery: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: 'e.g., 2-3 days',
            },
            shipped_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            delivered_at: {
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

        // Add indexes
        await queryInterface.addIndex('shipping', ['order_id'], {
            unique: true,
            name: 'shipping_order_id_unique',
        });

        await queryInterface.addIndex('shipping', ['tracking_number'], {
            name: 'shipping_tracking_number_idx',
        });

        await queryInterface.addIndex('shipping', ['courier'], {
            name: 'shipping_courier_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('shipping');
    },
};
