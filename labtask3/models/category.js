const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  title: String,
  detail : String,
  
});

let Category  = mongoose.model('category', categoriesSchema);
module.exports = Category