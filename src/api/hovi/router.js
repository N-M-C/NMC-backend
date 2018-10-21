const express = require('express');
const router = express.Router();

const answers = require('./answer');

router.get('/answer', answers.getAnswer);
router.get('/answerByObject', answers.getAnswerByObject);

module.exports = router;
