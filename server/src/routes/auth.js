import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 10) {
      return res.status(400).json({ message: 'Name, email, and a password of at least 10 characters are required.' });
    }
    const count = await User.countDocuments();
    if (count > 0) {
      const header = req.headers.authorization || '';
      const [scheme, token] = header.split(' ');
      let isAdmin = false;
      try {
        if (scheme === 'Bearer' && token) {
          const payload = (await import('jsonwebtoken')).default.verify(token, process.env.JWT_SECRET);
          isAdmin = payload.role === 'admin';
        }
      } catch { isAdmin = false; }
      if (!isAdmin) return res.status(403).json({ message: 'Initial administrator setup is already complete. Sign in with an administrator account.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    });
    const tokenValue = signToken(user);
    return res.status(201).json({ token: tokenValue, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' });
    return res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select('name email role');
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});

export default router;
