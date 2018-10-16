const express = require('express');
const router = express.Router();

const breakfast = require('./breakfast');

router.post('/v3/breakfast', breakfast.isDeliveryAvailable);

module.exports = router;
