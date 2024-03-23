const express = require('express');
const Question = require('../models/questionModel');
// const pluralize = require('pluralize');

const router = express.Router();

router.get('/:domain', (req, res) => {
    const { domain } = req.params;
    Question.findOne({domain: domain})
    .then (questionDoc => {
        if(questionDoc) {
            res.status(200).json(questionDoc.allQuestions);
        } else {
            res.status(200).json([])
        }
    }) .catch (error => {
        res.status(500).json({message: error.message})
    })
});

module.exports = router