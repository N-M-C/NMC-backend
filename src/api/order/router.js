const express = require('express');

const router = express.Router();
const userAuth = require('src/middlewares/userAuth');
// const orders = require('./orders');
const b2bOrders = require('./b2bOrders');

router.use(userAuth);

// router.post('/v3/orders', orders.postOrder);
router.post('/v3/b2b_orders', b2bOrders.postB2BOrder);

module.exports = router;
