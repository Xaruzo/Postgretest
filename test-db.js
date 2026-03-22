require('dotenv').config();
const { Pool } = require('pg');

// Create a connection pool using the DATABASE_URL from your .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  console.log('--- Testing PostgreSQL Connection ---');
  console.log('Connecting to:', process.env.DATABASE_URL ? 'URL found in .env' : 'NO URL FOUND');

  try {
    // 1. Try to connect
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');

    // 2. Run a simple query
    const res = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query successful! Database time is:', res.rows[0].current_time);

    // 3. Check if we can see databases
    const dbRes = await client.query('SELECT datname FROM pg_database');
    console.log('Available databases:', dbRes.rows.map(r => r.datname).join(', '));

    client.release();
  } catch (err) {
    console.error('❌ Connection failed!');
    console.error('Error details:', err.message);
    console.log('\n--- Troubleshooting Tips ---');
    console.log('1. Is PostgreSQL service running? (Check Windows Services)');
    console.log('2. Is the password in your .env correct?');
    console.log('3. Does the database name in your .env exist?');
  } finally {
    await pool.end();
  }
}

testConnection();
