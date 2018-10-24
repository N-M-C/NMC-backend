/**
 * root api router
 */
const express = require('express');
const hovi = require('./hovi/router');

const router = express.Router();

router.use('/hovi', hovi);

router.get('/', function(req,res){
    res.send('test code');
});

module.exports = router;
