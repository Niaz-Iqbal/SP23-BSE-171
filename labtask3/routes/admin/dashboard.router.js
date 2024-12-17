const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page", layout: "layout" });
});

router.get("/admin", (req, res) => {
  res.render("admin/dashboard", { layout: "layout/adminlayout" });
});

router.get("/contact-us", (req, res) => {
  res.render("contact-us", { title: "contact-us" });
});

module.exports = router;
