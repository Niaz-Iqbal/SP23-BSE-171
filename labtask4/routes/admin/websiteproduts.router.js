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

// Route: GET all products
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
    const { name, detail } = req.body; // Include detail from the form
    const image = req.file.path; // Path to the uploaded image
    await Product.create({ name, detail, image });
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
      const { name, detail } = req.body; // Include detail for updating
      const updatedData = { name, detail };

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



module.exports = router;
