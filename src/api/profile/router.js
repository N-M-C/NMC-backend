const express = require('express');

const userAuth = require('src/middlewares/userAuth');

const coupons = require('./coupons/router');
const me = require('./me');
const b2bMe = require('./b2bMe');
const b2bAddInfo = require('./b2bAddInfo');
const orders = require('./orders');
const b2bOrderList = require('./b2bOrderList');
const addresses = require('./addresses');
const verify = require('./verify');

const router = express.Router();

router.use(userAuth);
router.use('/v3/coupons', coupons);

router.get('/v3/orders', orders.getAll);
router.get('/v3/orders/:orderId', orders.getOne);
router.get('/v3/b2bOrderList', b2bOrderList.getAll);
router.get('/v3/b2bOrderList/:orderId', b2bOrderList.getOne);

router.get('/v3/me', me.find);
router.get('/v3/b2bMe', b2bMe.find);
router.put('/v3/b2bAddInfo', b2bAddInfo.putOne);

router.get('/v3/addresses', addresses.getAll);
router.get('/v3/addresses/:addressId', addresses.getOne);
router.get('/v3/addresses/active', addresses.getActive);
router.post('/v3/addresses', addresses.postOne);
router.put('/v3/addresses/:addressId', addresses.putActive);
router.delete('/v3/addresses/:addressId', addresses.deleteOne);

router.post('/v3/verify/:uid', verify);

module.exports = router;
