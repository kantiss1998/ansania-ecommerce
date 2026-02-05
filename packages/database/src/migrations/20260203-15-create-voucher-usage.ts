import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('voucher_usage', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            voucher_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'vouchers',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
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
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            used_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        // Add indexes
        await queryInterface.addIndex('voucher_usage', ['voucher_id'], {
            name: 'voucher_usage_voucher_id_idx',
        });

        await queryInterface.addIndex('voucher_usage', ['user_id'], {
            name: 'voucher_usage_user_id_idx',
        });

        await queryInterface.addIndex('voucher_usage', ['order_id'], {
            name: 'voucher_usage_order_id_idx',
        });

        await queryInterface.addIndex('voucher_usage', ['voucher_id', 'user_id'], {
            name: 'voucher_usage_voucher_user_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('voucher_usage');
    },
};
