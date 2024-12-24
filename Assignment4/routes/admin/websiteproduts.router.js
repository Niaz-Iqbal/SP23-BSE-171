const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../../models/hostingproduct");

function isAuthenticated(req, res, next) {
  if (req.session.user) {
      return next();
  }
  res.redirect("/login");
}

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});
const upload = multer({ storage });

router.get("/admin/products",isAuthenticated,  async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/products", { products, layout: "layout/adminlayout" });
  } catch (err) {
    res.status(500).send("Error retrieving products");
  }
});


// Route: GET form to add a product
router.get("/admin/products/add",isAuthenticated, (req, res) => {
  res.render("admin/add-products");
});

// Route: POST to create a new product
router.post("/admin/products",isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { name, detail, price } = req.body;
    const image = req.file.path; 
    await Product.create({ name, detail, image, price }); 
  } catch (err) {
    res.status(500).send("Error creating product");
  }
});

// Route: GET form to edit a product
router.get("/admin/products/:id/edit",isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/edit-products", { product });
  } catch (err) {
    res.status(500).send("Error retrieving product for edit");
  }
});

// Route: POST to update a product
router.post(
  "/admin/products/:id/edit",isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, detail, price } = req.body; 
      const updatedData = { name, detail, price }; 

      if (req.file) updatedData.image = req.file.path; 

      await Product.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect("/admin/products");
    } catch (err) {
      res.status(500).send("Error updating product");
    }
  }
);

// Route: DELETE a product
router.get("/admin/products/:id/delete",isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});
router.get("/admin/products/:page?",isAuthenticated, async (req, res) => {
  try {
    let page = req.params.page ? Number(req.params.page) : 1; 
    let pageSize = 5; 
    const searchQuery = req.query.search || ""; 
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const sortField = req.query.sortBy || "name";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; 

    
    if (page < 1) {
      page = 1;
    }

    
    const query = {};

    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" }; 
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: minPrice, $lte: maxPrice }; 
      query.price = { $gte: minPrice }; 
    } else if (maxPrice !== undefined) {
      query.price = { $lte: maxPrice }; 
    }

    
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
      searchQuery,
      sortField,   
      sortOrder,   
      minPrice,    
      maxPrice,    
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products");
  }
});


module.exports = router;
