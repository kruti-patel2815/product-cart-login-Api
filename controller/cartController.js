const Cart = require('../model/cart');
const Product = require('../model/product');


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.redirect('/login?error=Please login first');
    }
    
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.redirect('/products?error=Product ID required');
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect('/products?error=Product not found');
    }
    
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    let cart = await Cart.findOne({ userId: userObjectId });
    
    if (!cart) {
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
    
    await cart.save();
    
    res.redirect('/cart');
    
  } catch (err) {
    console.error('Cart error:', err);
    res.redirect('/products?error=Server error');
  }
};
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