import { sequelize } from './config/database';
import bannersSeeder from './seeders/banners.seeder';
import cmsPagesSeeder from './seeders/cms-pages.seeder';
import userSeeder from './seeders/users.seeder';

async function runSeeders() {
    try {
        console.log('🌱 Starting database seeding...');

        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Run seeders
        await userSeeder.up(sequelize.getQueryInterface());
        await cmsPagesSeeder.up(sequelize.getQueryInterface());
        await bannersSeeder.up(sequelize.getQueryInterface());

        console.log('✅ All seeders completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

runSeeders();
