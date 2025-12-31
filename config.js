process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = `.env.${process.env.NODE_ENV}`;

// Load environment variables. The order is important:
// 1. .env (defaults)
// 2. .env.[NODE_ENV] (environment-specific)
// 3. .env.local (local overrides, should be gitignored)
require('dotenv').config({
    path: ['.env', envFile, '.env.local'],
    override: true
});

// Add validation to fail fast if required variables are missing.
const requiredVars = ['DB_NAME', 'PORT'];
const missingVars = requiredVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
    throw new Error(`[App Config] ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
}

// Export a structured config object
const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    appName: process.env.APP_NAME,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES
    },
    db: {
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS
    },
    api: {
        url: process.env.API_URL,
        key: process.env.API_KEY,
    }
};

module.exports = config;