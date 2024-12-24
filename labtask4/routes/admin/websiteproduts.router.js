const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../../models/hostingproduct");

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images will be saved to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

router.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/products", { products, layout: "layout/adminlayout" });
  } catch (err) {
    res.status(500).send("Error retrieving products");
  }
});

// Route: GET form to add a product
router.get("/admin/products/add", (req, res) => {
  res.render("admin/add-products");
});

// Route: POST to create a new product
router.post("/admin/products", upload.single("image"), async (req, res) => {
  try {
    const { name, detail, price } = req.body; // Include price from the form
    const image = req.file.path; // Path to the uploaded image
    await Product.create({ name, detail, image, price }); // Add price to the product creation
    res.redirect("/admin/products");
  } catch (err) {
    res.status(500).send("Error creating product");
  }
});

// Route: GET form to edit a product
router.get("/admin/products/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/edit-products", { product });
  } catch (err) {
    res.status(500).send("Error retrieving product for edit");
  }
});

// Route: POST to update a product
router.post(
  "/admin/products/:id/edit",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, detail, price } = req.body; // Include price for updating
      const updatedData = { name, detail, price }; // Update price along with other fields

      if (req.file) updatedData.image = req.file.path; // Update image if a new one is uploaded

      await Product.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect("/admin/products");
    } catch (err) {
      res.status(500).send("Error updating product");
    }
  }
);

// Route: DELETE a product
router.get("/admin/products/:id/delete", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});
router.get("/admin/products/:page?", async (req, res) => {
  try {
    let page = req.params.page ? Number(req.params.page) : 1; // Default to page 1
    let pageSize = 5; // Set to 5 products per page
    const searchQuery = req.query.search || ""; // Get search query from URL
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const sortField = req.query.sortBy || "name"; // Default to 'name'
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default to ascending order

    // Ensure page is not less than 1
    if (page < 1) {
      page = 1;
    }

    // Build the query object dynamically based on search and price filters
    const query = {};

    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive partial match
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: minPrice, $lte: maxPrice }; // Filter within the price range
    } else if (minPrice !== undefined) {
      query.price = { $gte: minPrice }; // Filter with minPrice
    } else if (maxPrice !== undefined) {
      query.price = { $lte: maxPrice }; // Filter with maxPrice
    }

    // Fetch products with pagination, optional search query, sorting, and price filter
    const products = await Product.find(query)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ [sortField]: sortOrder });

    // Get total matching records and calculate total pages
    const totalRecords = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Render the admin/products page with search, sorting, and price filter options
    res.render("admin/all-products", {
      layout: "layout/mainlayout",
      products,
      page,
      totalRecords,
      totalPages,
      searchQuery, // Pass search query to the frontend for display in the search bar
      sortField,   // Pass sortField to maintain the sort order in the UI
      sortOrder,   // Pass sortOrder to maintain the sort order in the UI
      minPrice,    // Pass the minPrice to the frontend
      maxPrice,    // Pass the maxPrice to the frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products");
  }
});




// Render All Products Page
// router.get('/admin/all-products', async (req, res) => {
//   try {
//     const products = await Product.find(); // Fetch all products
//     res.render('admin/all-products', {
//       title: 'All Products',
//       products: products,
//       layout: 'layout/mainlayout' // Use the main layout
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });


module.exports = router;
