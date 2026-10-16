import pg from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const isProduction = process.env.NODE_ENV === 'production';
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  ...(process.env.DATABASE_URL ? {} : { host: process.env.PGHOST || 'localhost', port: Number(process.env.PGPORT || 5432), database: process.env.PGDATABASE || 'harbor_hospital', user: process.env.PGUSER || 'postgres', password: process.env.PGPASSWORD || 'postgres' })
});
export async function initializeDatabase() {
  const filename = fileURLToPath(new URL('./schema.sql', import.meta.url));
  await pool.query(await fs.readFile(filename, 'utf8'));
  if (process.env.SEED_SAMPLE_DATA === 'true') {
    await pool.query(`INSERT INTO doctors (name, specialization, phone) SELECT 'Ava Patel', 'Cardiology', '+1 555 0101' WHERE NOT EXISTS (SELECT 1 FROM doctors)`);
    await pool.query(`INSERT INTO doctors (name, specialization, phone) SELECT 'Noah Williams', 'Pediatrics', '+1 555 0102' WHERE (SELECT COUNT(*) FROM doctors) = 1`);
    await pool.query(`INSERT INTO patients (name, age, gender, phone) SELECT 'Mia Chen', 34, 'Female', '+1 555 0201' WHERE NOT EXISTS (SELECT 1 FROM patients)`);
    await pool.query(`INSERT INTO patients (name, age, gender, phone) SELECT 'Liam Johnson', 51, 'Male', '+1 555 0202' WHERE (SELECT COUNT(*) FROM patients) = 1`);
    await pool.query(`INSERT INTO appointments (patient_id, doctor_id, appointment_date) SELECT p.id, d.id, NOW() + INTERVAL '1 day' FROM patients p CROSS JOIN doctors d WHERE p.name = 'Mia Chen' AND d.name = 'Ava Patel' AND NOT EXISTS (SELECT 1 FROM appointments)`);
  }
}
