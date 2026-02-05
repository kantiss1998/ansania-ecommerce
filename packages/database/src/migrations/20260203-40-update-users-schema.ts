import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        // Add role column
        await queryInterface.addColumn('users', 'role', {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'customer'
        });

        // Make odoo_user_id nullable
        await queryInterface.changeColumn('users', 'odoo_user_id', {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reference to Odoo user ID'
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        // Remove role column
        await queryInterface.removeColumn('users', 'role');

        // Revert odoo_user_id to not null (warning: might fail if nulls exist)
        // Fix: Update null values to a placeholder (e.g., 1) before altering
        await queryInterface.sequelize.query('UPDATE users SET odoo_user_id = 1 WHERE odoo_user_id IS NULL');

        await queryInterface.changeColumn('users', 'odoo_user_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to Odoo user ID'
        });
    },
};
