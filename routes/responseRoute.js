const express = require('express');
const Response = require('../models/responseModel');
const Question = require('../models/questionModel');

const router = express.Router();

router.get('/response', (req, res) => {
    res.send("Hi")
})

module.exports = router;