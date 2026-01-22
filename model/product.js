const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    profile: String
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);