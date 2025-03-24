const express = require('express');
const router = express.Router();
const {addToCart, getCartItems, removeCartItems, updateCartItems} = require('../controller/CartController');

router.use(express.json());

router
    .route('/')
    .post(addToCart)
    .get(getCartItems)
    
router.delete('/:id', removeCartItems);
// router.put('/:id', updateCartItems);

module.exports = router;