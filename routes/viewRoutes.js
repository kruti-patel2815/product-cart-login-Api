const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../model/product');
const Cart = require('../model/cart');


router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/login', (req, res) => {
  res.render('login');
});


router.get('/signup', (req, res) => {
  res.render('signup');
});


router.get('/cart', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate('products.productId');

    res.render('cart', {
      cart: cart || { products: [] }
    });
  } catch (error) {
    console.error('Cart page error:', error);
    res.status(500).send('Server Error');
  }
});



const checkLogin = (req, res, next) => {
  if (req.cookies.token) {
    next();
  } else {
    res.redirect('/login');
  }
};


router.get('/products', checkLogin, async (req, res) => {
  const products = await Product.find();
  res.render('products', { products });
});


router.get('/cart', checkLogin, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate('products.productId');

    res.render('cart', {
      cart: cart || { products: [] }
    });
  } catch (error) {
    res.redirect('/login');
  }
});
router.get('/logout', (req, res) => {

  res.clearCookie('token');

  res.redirect('/');
});
module.exports = router;