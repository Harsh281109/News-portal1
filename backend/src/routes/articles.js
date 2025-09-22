const express = require('express');
const Article = require('../models/Article');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const { USE_S3 } = require('../config');
const { uploadFile } = USE_S3 ? require('../services/s3') : { uploadFile: null };

const router = express.Router();

// list (public) with optional filters
router.get('/', async (req,res) => {
  try {
    const { page = 1, per = 12, cat, q } = req.query;
    const filter = { published: true };
    if (cat) filter.category = cat;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { summary: { $regex: q, $options: 'i' } }
    ];
    const skip = (page - 1) * per;
    const total = await Article.countDocuments(filter);
    const data = await Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(per));
    res.json({ total, page: parseInt(page), per: parseInt(per), data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get by slug
router.get('/:slug', async (req, res) => {
  try {
    const a = await Article.findOne({ slug: req.params.slug, published: true });
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json(a);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// admin create (multipart/form-data for an image)
router.post('/',
  requireAuth,
  upload.single('image'),
  body('title').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const obj = {
        title: req.body.title,
        summary: req.body.summary || '',
        content: sanitizeHtml(req.body.content || '', { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','p','br']) }),
        category: req.body.category || 'General',
        published: req.body.published === 'true' || req.body.published === true,
        author: req.body.author || req.user?.username || 'admin'
      };

      if (req.file) {
        if (USE_S3 && uploadFile) {
          const loc = await uploadFile(req.file.buffer, `articles/${req.file.filename}`, req.file.mimetype);
          obj.imageUrl = loc;
        } else {
          obj.imageUrl = '/uploads/' + req.file.filename;
        }
      }

      const a = new Article(obj);
      await a.save();
      res.json(a);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// admin update
router.put('/:id',
  requireAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      const upd = {};
      if (req.body.title) upd.title = req.body.title;
      if (req.body.summary) upd.summary = req.body.summary;
      if (req.body.content) upd.content = sanitizeHtml(req.body.content || '', { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','p','br']) });
      if (req.body.category) upd.category = req.body.category;
      if (req.body.published !== undefined) upd.published = req.body.published === 'true' || req.body.published === true;

      if (req.file) {
        if (USE_S3 && uploadFile) {
          const loc = await uploadFile(req.file.buffer, `articles/${req.file.filename}`, req.file.mimetype);
          upd.imageUrl = loc;
        } else {
          upd.imageUrl = '/uploads/' + req.file.filename;
        }
      }

      const a = await Article.findByIdAndUpdate(req.params.id, upd, { new: true });
      res.json(a);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// admin delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
