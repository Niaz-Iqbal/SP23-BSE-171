const express = require("express");
const expressLayouts = require("express-ejs-layouts");
let app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(expressLayouts);

app.set("layout", "layout");

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.get("/contact-us", (req, res) => {
  res.render("contact-us", { title: "contact-us" });
});

app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});