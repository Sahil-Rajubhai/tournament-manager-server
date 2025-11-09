import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  res.json({ token });
}
