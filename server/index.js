import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, initializeDatabase } from './db.js';
import { signIn, requireAuth, requireAdmin } from './auth.js';

const app = express();
const port = process.env.PORT || 3000;
const root = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(503).json({ status: 'error', database: 'unavailable' }); }
});
app.post('/api/auth/login', signIn);
app.use('/api', requireAuth);
app.get('/api/auth/me', (req, res) => res.json({ user: { username: req.user.username, role: req.user.role } }));
app.get('/api/dashboard', async (_req, res, next) => {
  try {
    const { rows: [stats] } = await pool.query(`SELECT (SELECT COUNT(*)::int FROM patients) AS patients, (SELECT COUNT(*)::int FROM doctors) AS doctors, (SELECT COUNT(*)::int FROM appointments) AS appointments`);
    const upcoming = await pool.query(`SELECT a.id, a.appointment_date, a.status, p.name AS patient_name, d.name AS doctor_name, d.specialization FROM appointments a JOIN patients p ON p.id=a.patient_id JOIN doctors d ON d.id=a.doctor_id WHERE a.status <> 'Cancelled' ORDER BY a.appointment_date LIMIT 6`);
    res.json({ stats, upcoming: upcoming.rows });
  } catch (error) { next(error); }
});

const configs = {
  patients: { table: 'patients', fields: ['name', 'age', 'gender', 'phone'], search: ['name', 'phone'] },
  doctors: { table: 'doctors', fields: ['name', 'specialization', 'phone'], search: ['name', 'specialization', 'phone'] }
};
for (const [resource, cfg] of Object.entries(configs)) {
  app.get(`/api/${resource}`, async (req, res, next) => {
    try {
      const term = `%${String(req.query.search || '').slice(0, 100)}%`;
      const condition = cfg.search.map((field) => `${field} ILIKE $1`).join(' OR ');
      const { rows } = await pool.query(`SELECT * FROM ${cfg.table} WHERE ($1 = '%%' OR ${condition}) ORDER BY id DESC`, [term]);
      res.json({ [resource]: rows });
    } catch (error) { next(error); }
  });
  app.post(`/api/${resource}`, requireAdmin, async (req, res, next) => {
    try {
      const values = cfg.fields.map((field) => req.body?.[field]);
      validateResource(resource, req.body, res); if (res.headersSent) return;
      const cols = cfg.fields.join(', '), placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const { rows: [record] } = await pool.query(`INSERT INTO ${cfg.table} (${cols}) VALUES (${placeholders}) RETURNING *`, values);
      res.status(201).json({ [resource.slice(0, -1)]: record });
    } catch (error) { next(error); }
  });
  app.put(`/api/${resource}/:id`, requireAdmin, async (req, res, next) => {
    try {
      validateResource(resource, req.body, res); if (res.headersSent) return;
      const values = cfg.fields.map((field) => req.body?.[field]);
      const setters = cfg.fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
      const { rows: [record] } = await pool.query(`UPDATE ${cfg.table} SET ${setters} WHERE id = $${values.length + 1} RETURNING *`, [...values, Number(req.params.id)]);
      if (!record) return res.status(404).json({ error: 'Record not found.' });
      res.json({ [resource.slice(0, -1)]: record });
    } catch (error) { next(error); }
  });
  app.delete(`/api/${resource}/:id`, requireAdmin, async (req, res, next) => {
    try {
      const { rows: [record] } = await pool.query(`DELETE FROM ${cfg.table} WHERE id = $1 RETURNING id`, [Number(req.params.id)]);
      if (!record) return res.status(404).json({ error: 'Record not found.' });
      res.status(204).end();
    } catch (error) { next(error); }
  });
}
function validateResource(resource, body, res) {
  const required = configs[resource].fields;
  for (const field of required) if (body?.[field] === undefined || String(body[field]).trim() === '') return res.status(400).json({ error: `${field[0].toUpperCase() + field.slice(1)} is required.` });
  if (resource === 'patients' && (!Number.isInteger(Number(body.age)) || Number(body.age) < 0 || Number(body.age) > 130)) return res.status(400).json({ error: 'Age must be a number between 0 and 130.' });
}

app.get('/api/appointments', async (req, res, next) => {
  try {
    const term = `%${String(req.query.search || '').slice(0, 100)}%`;
    const { rows } = await pool.query(`SELECT a.id, a.patient_id, a.doctor_id, a.appointment_date, a.status, p.name AS patient_name, d.name AS doctor_name, d.specialization FROM appointments a JOIN patients p ON p.id=a.patient_id JOIN doctors d ON d.id=a.doctor_id WHERE ($1='%%' OR p.name ILIKE $1 OR d.name ILIKE $1 OR a.status ILIKE $1) ORDER BY a.appointment_date DESC`, [term]);
    res.json({ appointments: rows });
  } catch (error) { next(error); }
});
app.post('/api/appointments', requireAdmin, async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate } = req.body || {};
    if (!patientId || !doctorId || !appointmentDate || Number.isNaN(Date.parse(appointmentDate))) return res.status(400).json({ error: 'Patient, doctor, and a valid appointment date are required.' });
    const { rows: [appointment] } = await pool.query(`INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES ($1,$2,$3) RETURNING *`, [Number(patientId), Number(doctorId), new Date(appointmentDate)]);
    res.status(201).json({ appointment });
  } catch (error) { next(error); }
});
app.put('/api/appointments/:id', requireAdmin, async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate, status } = req.body || {};
    if (!patientId || !doctorId || !appointmentDate || !['Scheduled','Completed','Cancelled'].includes(status) || Number.isNaN(Date.parse(appointmentDate))) return res.status(400).json({ error: 'Provide a patient, doctor, valid date, and appointment status.' });
    const { rows: [appointment] } = await pool.query(`UPDATE appointments SET patient_id=$1, doctor_id=$2, appointment_date=$3, status=$4 WHERE id=$5 RETURNING *`, [Number(patientId), Number(doctorId), new Date(appointmentDate), status, Number(req.params.id)]);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    res.json({ appointment });
  } catch (error) { next(error); }
});
app.delete('/api/appointments/:id', requireAdmin, async (req, res, next) => {
  try {
    const { rows: [appointment] } = await pool.query(`UPDATE appointments SET status='Cancelled' WHERE id=$1 RETURNING id`, [Number(req.params.id)]);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

if (process.env.NODE_ENV === 'production') {
  const dist = path.resolve(root, '../dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === '23503') return res.status(409).json({ error: 'This record is linked to an appointment and cannot be deleted.' });
  if (error.code === '23514' || error.code === '22P02') return res.status(400).json({ error: 'Please check the values and try again.' });
  if (error.code === '23502') return res.status(400).json({ error: 'Required information is missing.' });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

initializeDatabase().then(() => app.listen(port, () => console.log(`Hospital Management API listening on ${port}`))).catch((error) => { console.error('Database initialization failed:', error); process.exit(1); });
