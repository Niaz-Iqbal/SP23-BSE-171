const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart"); 
const Product = require("../../models/hostingproduct"); 

function isAuthenticated(req, res, next) {

  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}


router.get("/",isAuthenticated,(req, res) => {
  res.render("index", { title: "Home Page", layout: "layout" });
});

router.get("/admin",isAuthenticated, (req, res) => {
  res.render("admin/dashboard", { layout: "layout/adminlayout" });
});

router.get("/contact-us", isAuthenticated,(req, res) => {
  res.render("contact-us", { title: "contact-us" });
});


router.get("/admin/cart-history", isAuthenticated, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.session.user._id }).populate("products.productId");
  res.render("admin/cart-history", { cart });
});

module.exports = router;
