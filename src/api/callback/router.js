const express = require('express');
const router = express.Router();

const vroong = require('./vroong');

router.post('/v3/vroong', vroong);

module.exports = router;
