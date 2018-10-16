const express = require('express');
const router = express.Router();

const reviews = require('./reviews');
const menus = require('./menus');
const meta = require('./meta');
const deliverys = require('./deliverys');
const chefs = require('./chefs');
const card = require('./card');
const photo = require('./photo');

router.get('/v3/reviews', reviews.getAll);
router.get('/v3/menus', menus.getAll);
router.get('/v3/menus/:menuId', menus.getOne);
router.get('/v3/deliverys', deliverys.getAll);
router.get('/v3/chefs', chefs.getAll);
router.post('/v3/menus', menus.postMenu);
router.post('/v3/menus/update', menus.updateMenu);
router.post('/v3/menus/uploadImage', menus.uploadImage);
router.post('/v3/meta', meta.updateDeliveryTime);
router.get('/v3/meta/deliveryTime', meta.getDeliveryTime);
router.delete('/v3/card/:id', card.deleteCard);
router.delete('/v3/photo/:id', photo.deletePhoto);
module.exports = router;
