import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.addColumn('categories', 'meta_title', {
            type: DataTypes.STRING(255),
            allowNull: true,
        });

        await queryInterface.addColumn('categories', 'meta_description', {
            type: DataTypes.TEXT,
            allowNull: true,
        });

        await queryInterface.addColumn('categories', 'keywords', {
            type: DataTypes.STRING(255),
            allowNull: true,
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.removeColumn('categories', 'meta_title');
        await queryInterface.removeColumn('categories', 'meta_description');
        await queryInterface.removeColumn('categories', 'keywords');
    },
};
