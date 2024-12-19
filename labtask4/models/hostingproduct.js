const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detail: { type: String, required: true }, // Product details
  image: { type: String, required: true }, // Path to the uploaded image
  price: { type: Number, required: true }, // New field for product price
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

module.exports = mongoose.model("Product", ProductSchema);
