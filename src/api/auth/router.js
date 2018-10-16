const express = require('express');

const router = express.Router();

const signin = require('./signin');
const signup = require('./signup');

router.post('/v3/signin', signin);
router.post('/v3/signup', signup);

module.exports = router;
