import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('voucher_categories', {
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
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        });

        // Add composite primary key
        await queryInterface.addConstraint('voucher_categories', {
            fields: ['voucher_id', 'category_id'],
            type: 'primary key',
            name: 'voucher_categories_pk',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('voucher_categories');
    },
};
