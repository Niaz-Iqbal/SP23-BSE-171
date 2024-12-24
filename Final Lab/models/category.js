const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: { type: String },
});

module.exports = mongoose.model('Category', categoriesSchema);
