// Load environment variables FIRST before any imports
import dotenv from 'dotenv';

// Use absolute path to ensure .env is found
const envPath = 'D:\\Kantiss\\zanza_project\\ansania-ecommerce\\.env';
console.log('[ENV] Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('[ENV] ❌ Failed to load .env:', result.error);
} else {
    console.log('[ENV] ✅ .env loaded successfully');
    console.log('[ENV] ODOO_URL:', process.env.ODOO_URL ? 'SET' : 'NOT SET');
}

// Now import app and other modules AFTER env is loaded
// IMPORTANT: Use require() instead of import to prevent hoisting
/* eslint-disable @typescript-eslint/no-var-requires */
const { sequelize } = require('@repo/database');
const app = require('./app').default;
/* eslint-enable @typescript-eslint/no-var-requires */

const PORT = process.env.API_PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 API Server running on http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}

startServer();
