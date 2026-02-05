import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('voucher_products', {
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
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        });

        // Add composite primary key
        await queryInterface.addConstraint('voucher_products', {
            fields: ['voucher_id', 'product_id'],
            type: 'primary key',
            name: 'voucher_products_pk',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('voucher_products');
    },
};
