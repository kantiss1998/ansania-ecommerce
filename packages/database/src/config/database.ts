import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables
dotenv.config();

// Database configuration
const config = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    database: process.env.DATABASE_NAME || 'ansania_ecommerce',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    dialect: 'mysql' as const,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    timezone: '+07:00', // Indonesia timezone
    define: {
        timestamps: true,
        underscored: true, // Use snake_case for column names
        freezeTableName: true, // Don't pluralize table names
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    },
};

// Create Sequelize instance
export const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// Test connection
export async function testConnection(): Promise<boolean> {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        return false;
    }
}

// Sync database (use with caution in production)
export async function syncDatabase(force = false): Promise<void> {
    try {
        await sequelize.sync({ force, alter: !force });
        console.log('✅ Database synchronized successfully.');
    } catch (error) {
        console.error('❌ Database synchronization failed:', error);
        throw error;
    }
}

// Close connection
export async function closeConnection(): Promise<void> {
    try {
        await sequelize.close();
        console.log('✅ Database connection closed.');
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
}

export default sequelize;
