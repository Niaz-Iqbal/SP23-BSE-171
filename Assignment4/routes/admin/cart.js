const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart");
const Product = require("../../models/hostingproduct");
const { render } = require("express/lib/response");
const PDFDocument = require('pdfkit');
const fs = require('fs');


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
}

// Route to download cart history as PDF
router.get("/cart/download-pdf", isAuthenticated, async (req, res) => {
    const cart = await Cart.findOne({ userId: req.session.user._id }).populate("products.productId");

    if (!cart) {
        return res.status(404).send("Cart not found");
    }

    // Create a PDF document
    const doc = new PDFDocument();
    let filename = `cart-history-${req.session.user._id}.pdf`;
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    // Pipe the PDF into the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(25).text('Cart History', { align: 'center' });
    doc.moveDown();

    cart.products.forEach(item => {
        const totalPrice = item.productId.price * item.quantity; // Calculate total price
        doc.fontSize(12).text(`Product Name: ${item.productId.name}`);
        doc.text(`Quantity: ${item.quantity}`);
        doc.text(`Price: $${item.productId.price} (Total: $${totalPrice.toFixed(2)})`); // Display total price
        doc.moveDown();
    });

    // Finalize the PDF and end the stream
    doc.end();
});
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
// router.get("/checkout", isAuthenticated, async (req, res) => {
//     res.redirect("/admin/cart-history");
// });
// Checkout Route
router.get("/checkout", isAuthenticated, async (req, res) => {
    res.render("admin/checkout"); // Render the checkout view
});

module.exports = router;