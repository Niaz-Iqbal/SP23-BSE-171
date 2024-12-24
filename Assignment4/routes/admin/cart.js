const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart");
const Product = require("../../models/hostingproduct");
const { render } = require("express/lib/response");

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
}

// Add to Cart

router.get("/cart/add/:productId", isAuthenticated, async (req, res) => {
    const productId = req.params.productId; 
    const userId = req.session.user._id; 

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
        } else {
            // If cart exists, check if the product is already in the cart
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                // If product is already in the cart, increase the quantity
                cart.products[productIndex].quantity += 1;
            } else {
                // If product is not in the cart, add it
                cart.products.push({ productId, quantity: 1 });
            }
        }

        await cart.save(); 
        res.redirect("/cart"); 
    } catch (err) {
        console.error(err); 
        res.status(500).send("Error adding to cart"); 
    }
});

// View Cart
router.get("/cart", isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.user._id }).populate("products.productId");
        res.render("admin/cart", { cart });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving cart");
    }
});

// Remove from Cart
router.post("/cart/remove/:productId", isAuthenticated, async (req, res) => {
    const userId = req.session.user._id;
    const productId = req.params.productId;

    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();
        }
        res.redirect("/cart");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error removing from cart");
    }
});

// Update Cart Quantity
router.post("/cart/update/:productId", isAuthenticated, async (req, res) => {
    const userId = req.session.user._id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity; 
                await cart.save();
            }
        }
        res.redirect("/cart");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating cart");
    }
});

// Checkout Route
// router.get("/checkout",isAuthenticated, (req, res) => {
//   res.render("admin/thank-you");
// });
router.get("/checkout", isAuthenticated, async (req, res) => {
    res.redirect("/admin/cart-history");
});
module.exports = router;