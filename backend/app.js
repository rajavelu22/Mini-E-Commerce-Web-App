// It tells Node.js to go into your node_modules folder, find the "Express" package you installed, and 
// bring all its code into this file so you can use it.
const express = require('express');
const app = express()
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: path.join(__dirname, 'config', 'config.env')} )

// I'm going to call all the routes here
const products = require('./routes/product');
const orders = require('./routes/order');
const cors = require('cors');

const connectDase = require('./config/connectDatabase');
const connectDatabase = require('./config/connectDatabase');

connectDatabase()
app.use(express.json());
app.use(cors());
app.use('/api/v1/',products);
app.use('/api/v1/',orders);

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening to Port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});