require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
  console.log('--- Checking Database Schema ---');
  try {
    const res = await pool.query(`
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM 
        information_schema.columns 
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name, ordinal_position;
    `);

    if (res.rows.length === 0) {
      console.log('No tables found in the public schema.');
    } else {
      let currentTable = '';
      res.rows.forEach(row => {
        if (row.table_name !== currentTable) {
          console.log(`\nTable: ${row.table_name.toUpperCase()}`);
          console.log('---------------------------------------------------------');
          currentTable = row.table_name;
        }
        console.log(`${row.column_name.padEnd(15)} | ${row.data_type.padEnd(15)} | Nullable: ${row.is_nullable.padEnd(5)} | Default: ${row.column_default || 'None'}`);
      });
    }
  } catch (err) {
    console.error('❌ Error fetching schema:', err.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
