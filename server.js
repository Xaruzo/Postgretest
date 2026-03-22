require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('--- Server Starting ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false
});

// Database initialization
const initDB = async () => {
  try {
    console.log('Attempting to initialize database...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database table "items" is ready');
  } catch (err) {
    console.error('❌ DATABASE INIT ERROR:', err.message);
  }
};

initDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'up', database_url: !!process.env.DATABASE_URL });
});

// API Routes
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/items error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  
  try {
    const result = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/items error:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// Catch-all route to serve index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
