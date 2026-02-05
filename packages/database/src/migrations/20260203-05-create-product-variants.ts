import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('product_variants', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            odoo_product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                comment: 'Product variant ID from Odoo',
            },
            sku: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            color: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            finishing: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            size: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            price: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_visible: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            synced_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
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
        await queryInterface.addIndex('product_variants', ['product_id'], {
            name: 'product_variants_product_id_idx',
        });

        await queryInterface.addIndex('product_variants', ['odoo_product_id'], {
            unique: true,
            name: 'product_variants_odoo_product_id_unique',
        });

        await queryInterface.addIndex('product_variants', ['sku'], {
            unique: true,
            name: 'product_variants_sku_unique',
        });

        await queryInterface.addIndex('product_variants', ['stock'], {
            name: 'product_variants_stock_idx',
        });

        await queryInterface.addIndex('product_variants', ['is_visible'], {
            name: 'product_variants_is_visible_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('product_variants');
    },
};
