const express = require('express');
const router = express.Router();

const input = require('./input');
const address = require('./address');
const order = require('./order');
const getMinimumOrder = require('./getMinimumOrder');
const userAuth = require('src/middlewares/userAuth');
const b2b = require('./b2b');
const admin = require('./admin');

router.get('/v3/input/:companyName', input.getCompanyName);
router.get('/v3/order/amount', order.getAmount);
router.get('/v3/getMinimumOrder', getMinimumOrder.getMinimum);
router.get('/v3/admin/backbanmenu', admin.getBackbanMenuDaily);
router.get('/v3/admin/backbanmenuname', admin.getBackbanMenuName);

router.post('/v3/company', b2b.createCompany);
router.post('/v3/admin/backbanmenu', admin.createBackbanMenuDaily);

router.use(userAuth); // address 만 userId 때문에 pt가 필요하다.
router.post('/v3/address', address.postOne);
router.post('/v3/order', order.postOrder);

module.exports = router;
