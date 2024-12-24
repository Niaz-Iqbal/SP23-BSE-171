const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detail: { type: String, required: true }, // Product details
  image: { type: String, required: true }, // Path to the uploaded image
  price: { type: Number, required: true }, // Product price
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category model
});

module.exports = mongoose.model("Product", ProductSchema);
