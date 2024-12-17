const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detail: { type: String, required: true }, // New field for product details
  image: { type: String, required: true }, // Path to the uploaded image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
