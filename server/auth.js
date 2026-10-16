import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'development-only-change-this-secret';
export function signIn(req, res) {
  const { username, password } = req.body || {};
  const role = username === 'admin' ? 'Admin' : username === 'doctor' ? 'Doctor' : null;
  const expected = role === 'Admin' ? process.env.ADMIN_PASSWORD || 'admin123' : role === 'Doctor' ? process.env.DOCTOR_PASSWORD || 'doctor123' : null;
  if (!role || password !== expected) return res.status(401).json({ error: 'Incorrect username or password.' });
  return res.json({ token: jwt.sign({ username, role }, secret, { expiresIn: '12h' }), user: { username, role } });
}
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  try { req.user = jwt.verify(token, secret); next(); }
  catch { res.status(401).json({ error: 'Please sign in to continue.' }); }
}
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'Admin') return res.status(403).json({ error: 'Admin access is required for this action.' });
  next();
}
