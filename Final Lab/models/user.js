const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]// Ensure wishlist is always an array, even if no items are added

});

const user = mongoose.model('User ', userSchema);
module.exports = user;