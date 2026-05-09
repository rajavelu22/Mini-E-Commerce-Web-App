const ProductModel = require('../models/productModel');


//Get Product API - /api/v1/products?keyword=phone
exports.getProducts = async (req, res, next) => {

    // If a keyword is sent in the query string, search by product name (case insensitive)
    // Example: /api/v1/products?keyword=phone
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,  // partial match
            $options: 'i'               // case insensitive
        }
    } : {};

    // Find products matching the keyword (or all products if no keyword)
    const products = await ProductModel.find({ ...keyword });

    res.json({
        success: true,
        message: 'Get products working',
        products: products
    });
}

//Get Single Product API - /ao/vi/products/<:id>
exports.getSingleProduct = async (req, res, next) => {
    // Getting products by id
    console.log(req.params.id, 'ID')

    try {
        const product = await ProductModel.findById(req.params.id);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
}