const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    description: String,
    ratings: String,
    images: [
        {
            image: String
        }
    ],
    category: String,
    seller: String,
    stock: String,
    numOfReviews: String,
    createdAt: Date
}
);
// Models name should be singlar and schema should be passed as second argument
const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;