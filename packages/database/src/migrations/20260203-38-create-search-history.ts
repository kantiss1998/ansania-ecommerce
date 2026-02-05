import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('search_history', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            },
            session_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            search_query: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            results_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            filters_applied: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: 'Filter yang digunakan',
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        await queryInterface.addIndex('search_history', ['search_query'], {
            name: 'search_history_search_query_idx',
        });

        await queryInterface.addIndex('search_history', ['created_at'], {
            name: 'search_history_created_at_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('search_history');
    },
};
