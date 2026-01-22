const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.post('/', cartController.addToCart);
router.get('/:userId', cartController.getCart);
router.patch('/', cartController.updateQuantity);
router.delete('/', cartController.removeFromCart);

module.exports = router;
