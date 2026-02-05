import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('sync_logs', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sync_type: {
                type: DataTypes.ENUM('products', 'stock', 'orders', 'customers', 'addresses'),
                allowNull: false,
            },
            sync_direction: {
                type: DataTypes.ENUM('from_odoo', 'to_odoo'),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('success', 'failed', 'partial'),
                allowNull: false,
            },
            records_processed: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            records_failed: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            error_message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            execution_time_ms: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        await queryInterface.addIndex('sync_logs', ['sync_type'], {
            name: 'sync_logs_sync_type_idx',
        });

        await queryInterface.addIndex('sync_logs', ['created_at'], {
            name: 'sync_logs_created_at_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('sync_logs');
    },
};
