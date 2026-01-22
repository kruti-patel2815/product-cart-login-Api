const mongoose = require('mongoose');
const Cart = require('../model/Cart');
const Product = require('../model/Product');


exports.addToCart = async (req, res) => {
    
    try {
        const { userId, productId, quantity } = req.body;
        
        if (!userId || !productId || !quantity) {
            
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
      
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        } else {
           
            const index = cart.products.findIndex(
                p => p.productId.toString() === productId
            );

            if (index > -1) {
                
                cart.products[index].quantity += quantity;
            } else {
                
                cart.products.push({ productId, quantity });
            }
        }
        
        await cart.save();
       
        const response = {
            success: true,
            message: 'Product added to cart',
            cart: cart
        };
        
        
        res.json(response);
        
        
    } catch (err) {
       
        res.status(500).json({ 
            success: false, 
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
            .populate('products.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.products.find(
            p => p.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: 'Product not in cart' });
        }

        item.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.products = cart.products.filter(
            p => p.productId.toString() !== productId
        );

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
