const Cart = require('../model/Cart');
const Product = require('../model/Product');

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
   
        const userId = req.user.userId || req.user.id;
        
        if (!userId) {
            console.log('❌ User ID not found in request');
            return res.status(401).json({
                success: false,
                message: 'User authentication failed'
            });
        }
        
        console.log('User ID:', userId);
        
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }
        
        // Check product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Convert userId to ObjectId if needed
        const mongoose = require('mongoose');
        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        // Find or create cart
        let cart = await Cart.findOne({ userId: userObjectId });
        
        if (!cart) {
            console.log('Creating new cart for user:', userId);
            cart = new Cart({
                userId: userObjectId,
                products: [{ productId, quantity }]
            });
        } else {
            const existingItem = cart.products.find(
                item => item.productId.toString() === productId
            );
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }
        
        // Save cart
        await cart.save();
        console.log('✅ Cart saved. ID:', cart._id);
        
        // Populate product details
        const populatedCart = await Cart.findById(cart._id)
            .populate('products.productId');
        
        res.json({
            success: true,
            message: 'Product added to cart',
            cart: populatedCart
        });
        
    } catch (err) {
        console.error('❌ Cart error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};
// Get Cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId })
            .populate('products.productId');
            
        res.json({
            success: true,
            cart: cart || { products: [] }
        });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};