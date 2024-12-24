const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Product = require('../../models/hostingproduct');

// Route to add product to wishlist
router.get('/wishlist/add/:productId', (req, res) => {
    const productId = req.params.productId;

    // Check if the user is logged in
    if (!req.session.user) {
        return res.status(401).send('Please log in to add items to your wishlist.');
    }

    const userId = req.session.user._id; // Assume user is in the session

    // Find the product by ID
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found.');
            }

            // Find the user by ID
            User.findById(userId)
                .then(user => {
                    if (!user) {
                        return res.status(404).send('User not found.');
                    }

                    // Initialize wishlist if it doesn't exist
                    if (!user.wishlist) {
                        user.wishlist = [];
                    }

                    // Check if the product is already in the wishlist
                    const existingItem = user.wishlist.some(item => item.toString() === productId);
                    if (existingItem) {
                        return res.redirect('/wishlist'); // Redirect to wishlist if item already exists
                    }

                    // Add the product to the wishlist
                    user.wishlist.push(product._id);
                    return user.save()
                        .then(() => res.redirect('/wishlist')); // Redirect to the wishlist page after adding the product
                })
                .catch(err => {
                    console.error('Error adding to wishlist:', err);
                    res.status(500).send('Error adding to wishlist.');
                });
        })
        .catch(err => {
            console.error('Error finding product:', err);
            res.status(500).send('Error finding product.');
        });
});

// Route to view the wishlist
router.get('/wishlist',  (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
        return res.status(401).send('Please log in to view your wishlist.');
    }

    const userId = req.session.user._id;

    // Find the user and populate their wishlist
    User.findById(userId)
        .populate('wishlist') // Populate product details from the Product collection
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found.');
            }
            res.render('admin/wishlist', { wishlistItems: user.wishlist });
        })
        .catch(err => {
            console.error('Error fetching wishlist:', err);
            res.status(500).send('Error fetching wishlist.');
        });
});

module.exports = router;
