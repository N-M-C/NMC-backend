const express = require('express');

const router = express.Router();
// const userAuth = require('src/middlewares/userAuth');
const getCompanyInfo = require('../company/getCompanyInfo');

// router.use(userAuth);

router.get('/v3/getCompanyInfo', getCompanyInfo.find);

module.exports = router;
