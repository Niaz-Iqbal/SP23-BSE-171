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

// Handle signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            req.flash("error", "Passwords don't match. Please check and try again.");
            return res.redirect("/signup");
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            req.flash("error", "An account with this email already exists.");
            return res.redirect("/signup");
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();

        req.flash("success", "Account created! Log in to access your dashboard.");
        res.redirect("/login");
    } catch (error) {
        console.error("Error during signup:", error);
        req.flash("error", "Something went wrong during signup. Please try again.");
        res.redirect("/signup");
    }
});

// Handle logout
router.get("/logout", (req, res) => {
    res.render("admin/login", { messages: req.flash(), layout: false });
});

module.exports = router;
