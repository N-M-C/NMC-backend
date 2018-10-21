/**
 * root api router
 */

const express = require('express');
const hovi = require('./hovi/router');
const router = express.Router();

router.use('/hovi', hovi);
module.exports = router;
