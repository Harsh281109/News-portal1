const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  summary: String,
  content: String, // sanitized HTML string
  category: { type: String, default: 'General' },
  imageUrl: String,
  published: { type: Boolean, default: false },
  author: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ArticleSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/(^-|-$)/g,'');
  }
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);

