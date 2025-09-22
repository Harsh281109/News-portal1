const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PORT, MONGO_URI } = require('./config');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// static uploads (dev)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// routes
const articles = require('./routes/articles');
const auth = require('./routes/auth');
app.use('/api/articles', articles);
app.use('/api/auth', auth);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

(async function(){
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log('Server running on', PORT));
  } catch(e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
})();
