const express = require('express');
const { getAll } = require('./controllers');

const router = express.Router().get('/', getAll);

module.exports = router;
