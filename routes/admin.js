const express = require ('express')
const Admin = require('../models/adminModel')
const Question = require('../models/questionModel')
const pluralize = require('pluralize')

const router = express.Router();

router.post('/questions/:domain', (req, res) => {
    const domain = req.params.domain;
    const { type, question, options } = req.body;

    Question.findOne({ domain })
        .then(foundQuestion => {
            if (!foundQuestion) {
                const newQuestion = new Question({
                    domain,
                    allQuestions: [{ type, question, options }]
                });
                return newQuestion.save();
            } else {
                foundQuestion.allQuestions.push({ type, question, options });
                return foundQuestion.save();
            }
        })
        .then(savedQuestion => {
            res.status(201).json(savedQuestion);
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).json({ message: "Internal server error" });
        });
});



module.exports = router;
