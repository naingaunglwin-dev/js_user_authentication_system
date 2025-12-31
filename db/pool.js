// db/pool.js
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
    host: config.db.host,
    port: parseInt(config.db.port),
    database: config.db.name,
    user: config.db.user,
    password: config.db.pass,
    // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,

    // Pool configuration
    // min: parseInt(process.env.DB_POOL_MIN) || 2,
    // max: parseInt(process.env.DB_POOL_MAX) || 10,
    // idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
    // connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT) || 2000,
});

// Handle pool errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing database pool...');
    await pool.end();
    process.exit(0);
});

module.exports = pool;
