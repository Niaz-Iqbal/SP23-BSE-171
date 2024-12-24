const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const session = require("express-session");


function isAuthenticated(req, res, next) {

  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}



// Home route - list all categories
router.get("/admin/categories",isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/itemcategories", { categories,layout: "layout/adminlayout" });
  } catch (err) {
    res.status(500).send("Error fetching categories");
  }
});

// Form to create a new category
router.get("/admin/categories/new",isAuthenticated, (req, res) => {
  res.render("admin/add-category");
});

// Create a new category
router.post("/admin/categories", isAuthenticated,async (req, res) => {
  const { title, detail } = req.body;
  const newCategory = new Category({ title, detail });

  try {
    await newCategory.save(); 
    res.redirect("/admin/categories");
  } catch (err) {
    res.status(500).send("Error saving category");
  }
});

// Form to edit a category
router.get("/admin/categories/:id/edit",isAuthenticated, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send("Category not found");
    res.render("admin/edit-category", { category });
  } catch (err) {
    res.status(500).send("Error fetching category");
  }
});

// Update a category
router.post("/admin/categories/:id/edit",isAuthenticated, async (req, res) => {
  const { title, detail } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      title,
      detail,
    });
    if (!category) return res.status(404).send("Category not found");
    res.redirect("/admin/categories");
  } catch (err) {
    res.status(500).send("Error updating category");
  }
});

// Delete a category
router.post("/admin/categories/:id/delete",isAuthenticated, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories");
  } catch (err) {
    res.status(500).send("Error deleting category");
  }
});

module.exports = router;
