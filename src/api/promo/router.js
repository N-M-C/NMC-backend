const express = require('express');

const userAuth = require('src/middlewares/userAuth');

const promo = require('./inputToPromoCode');


const router = express.Router();



router.post('/v3/promo', promo.createPromoCode);


module.exports = router;
