const express = require('express');
const Response = require('../models/resposeModel');
const Question = require('../models/questionModel');

const router = express.Router();

router.get('/question', (req, res) => {
    res.send("Hi")
})

module.exports = router;