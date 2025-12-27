
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/dbConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
  const schemaPath = path.join(__dirname, '../data/schema.sql');
  
  try {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Reading schema.sql...');

    // Split by semicolons prevents some errors, but pg client can often handle multiple statements.
    // However, for safety/clarity, sending the whole block is usually fine if the driver supports it.
    // The pg 'pool.query' can execute multiple statements.
    
    await pool.query(sql);
    console.log('✅ Schema executed successfully! Tables Created.');
  } catch (err) {
    console.error('❌ Error executing schema:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

runSchema();
