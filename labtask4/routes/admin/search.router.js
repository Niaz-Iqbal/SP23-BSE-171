const express = require('express');
const router = express.Router();
const Product = require('../../models/hostingproduct'); // Assuming you have a Product model

// Route for displaying products with search functionality
router.get('/products', async (req, res) => {
  const searchQuery = req.query.search || ''; // Get search term from the query parameter

  // Fetch products from database, filtering by the search term (if any)
  const products = await Product.find({
    name: { $regex: searchQuery, $options: 'i' } // 'i' for case-insensitive search
  });

  res.render('admin/products', { products, searchQuery }); // Pass search term and products to the view
});

module.exports = router;
