const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const path = require("path");
const bodyParser = require('body-parser');
const Category = require('./models/category'); 

let app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

app.set("layout", "layout");

app.use(express.json());

// app.use("/products", productRoutes);


let dashboardRouter=require("./routes/admin/dashboard.router");
app.use(dashboardRouter);

let categoryRouter = require("./routes/admin/websitecategory.router");
app.use(categoryRouter);

const productsRouter = require('./routes/admin/websiteproduts.router');
app.use(productsRouter);






let connectionString = "mongodb://localhost:27017/database";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.message);
  });


app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});

