const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("../../models/user");
const router = express.Router();

// Render login form
router.get("/login", (req, res) => {
    res.render("admin/login", { messages: req.flash(), layout: false });
});

router.get("/", (req, res) => {
    res.render("admin/login", { messages: req.flash(), layout: false });
});

// Handle login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash("error", "Invalid credentials, please try again.");
            return res.redirect("/login");
        }

        req.session.user = user; 
        console.log("Logged-in User:", req.session.user); 
        res.redirect("/admin"); 
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send("An unexpected error occurred. Please try again later.");
    }
});

// Render signup form
router.get("/signup", (req, res) => {
    res.render("admin/signup", { messages: req.flash(), layout: false }); 
});

// Handle signup // Adjust the path as needed

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'An error occurred during signup.' });
  }
});

module.exports = router;


// Handle logout
router.get("/logout", (req, res) => {
    res.render("admin/login", { messages: req.flash(), layout: false });
});

module.exports = router;
