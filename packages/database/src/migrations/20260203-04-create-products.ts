import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('products', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            odoo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                comment: 'Product template ID from Odoo',
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id',
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            short_description: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            selling_price: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            compare_price: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: true,
                comment: 'Original price before discount',
            },
            sku: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            weight: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Weight in grams',
            },
            length: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Length in cm',
            },
            width: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Width in cm',
            },
            height: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Height in cm',
            },
            is_featured: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            meta_title: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            meta_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            synced_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                comment: 'Last sync time from Odoo',
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
        await queryInterface.addIndex('products', ['odoo_id'], {
            unique: true,
            name: 'products_odoo_id_unique',
        });

        await queryInterface.addIndex('products', ['slug'], {
            unique: true,
            name: 'products_slug_unique',
        });

        await queryInterface.addIndex('products', ['category_id'], {
            name: 'products_category_id_idx',
        });

        await queryInterface.addIndex('products', ['is_featured'], {
            name: 'products_is_featured_idx',
        });

        await queryInterface.addIndex('products', ['is_active'], {
            name: 'products_is_active_idx',
        });

        await queryInterface.addIndex('products', ['selling_price'], {
            name: 'products_selling_price_idx',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('products');
    },
};
