﻿const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    getAllProducts(req, res).catch(console.error);
});

async function getAllProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllSaleProducts();
    const priceAdjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    const adjustedProducts = require('../utils/dbUtils').addSizeColorFlags(priceAdjustedProducts);
    res.render('products', {title: 'Etsy Clone', session: req.session, products: adjustedProducts});
}

module.exports = router;