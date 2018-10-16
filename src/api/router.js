/**
 * root api router
 */

const express = require('express');

const profile = require('./profile/router');
const auth = require('./auth/router');
const order = require('./order/router');
const resource = require('./resource/router');
const canteen = require('./canteen/router');
const morning = require('./morning/router');
const callback = require('./callback/router');
const promo = require('./promo/router');
const company = require('./company/router');

const router = express.Router();

router.use('/morning', morning);
router.use('/profile', profile);
router.use('/auth', auth);
router.use('/order', order);
router.use('/resource', resource);
router.use('/canteen', canteen);
router.use('/callback', callback);
router.use('/promo', promo);
router.use('/company', company);
module.exports = router;
