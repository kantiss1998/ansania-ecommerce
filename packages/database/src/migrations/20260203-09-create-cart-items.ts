import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('cart_items', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            cart_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            product_variant_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'product_variants',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
                comment: 'Price at the time of adding to cart',
            },
            subtotal: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
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
        await queryInterface.addIndex('cart_items', ['cart_id'], {
            name: 'cart_items_cart_id_idx',
        });

        await queryInterface.addIndex('cart_items', ['product_variant_id'], {
            name: 'cart_items_product_variant_id_idx',
        });

        await queryInterface.addIndex('cart_items', ['cart_id', 'product_variant_id'], {
            unique: true,
            name: 'cart_items_unique_cart_variant',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('cart_items');
    },
};
