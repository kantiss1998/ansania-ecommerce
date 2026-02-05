import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('notifications', {
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
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: 'order_status, payment, promo, etc',
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            related_type: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: 'order, product, voucher',
            },
            related_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'ID dari related entity',
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            read_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        await queryInterface.addIndex('notifications', ['user_id'], {
            name: 'notifications_user_id_idx',
        });

        await queryInterface.addIndex('notifications', ['is_read'], {
            name: 'notifications_is_read_idx',
        });

        await queryInterface.addIndex('notifications', ['created_at'], {
            name: 'notifications_created_at_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('notifications');
    },
};
