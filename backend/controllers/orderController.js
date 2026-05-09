const orderModel = require("../models/orderModel");

exports.createOrder = async (req, res, next) => {
    const cartItems = req.body.cartItems;
    const amount = Number(cartItems.reduce((acc, item) => ((item.price * item.qty) + acc), 0)).toFixed(2);
    const status = 'pending';
    const order = await orderModel.create({cartItems, amount, status})
    console.log(amount, 'AMOUNT');
    // orderModel.create()
    res.json({
        success: true,
        order
    })
}