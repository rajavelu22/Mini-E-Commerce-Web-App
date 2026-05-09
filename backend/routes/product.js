const express = require('express');
const { getProducts, getSingleProduct } = require('../controllers/productController');
const router = express.Router();

// why? we can creates routes and export from this file alone, if we need something else then we should create from another file
//So we need Router module for each routes

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

module.exports = router;