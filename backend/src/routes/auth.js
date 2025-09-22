const express = require('express');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SETUP_TOKEN } = require('../config');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// login
router.post('/login', 
  body('username').isString(), body('password').isString(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, password } = req.body;
  const user = await Admin.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

// one-time setup (requires SETUP_TOKEN)
router.post('/setup', 
  body('username').isString(), body('password').isString(), body('token').isString(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  if (!SETUP_TOKEN) return res.status(403).json({ error: 'Setup disabled on this environment' });
  if (req.body.token !== SETUP_TOKEN) return res.status(403).json({ error: 'Invalid setup token' });

  const { username, password } = req.body;
  if (await Admin.findOne({ username })) return res.status(400).json({ error: 'User exists' });

  const hash = await bcrypt.hash(password, 12);
  const u = new Admin({ username, passwordHash: hash });
  await u.save();
  res.json({ ok: true });
});

module.exports = router;
