// db/helpers.js
const pool = require('./pool');
const { DatabaseError } = require('../errors/ErrorHandlers')

/**
 * Execute a query with parameters
 */
async function query(text, params = []) {
    const start = Date.now();

    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        console.log('Executed query', {
            text: text.substring(0, 100) + '...',
            duration,
            rows: result.rowCount
        });

        return result;
    } catch (error) {
        console.error('Database query error:', {
            text: text.substring(0, 100) + '...',
            params,
            error: error.message
        });
        throw new DatabaseError('Query execution failed', error);
    }
}

module.exports = {
    query,
};
