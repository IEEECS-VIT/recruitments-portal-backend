const express = require ('express')
const Admin = require('../models/adminModel')
const Question = require('../models/questionModel')
const pluralize = require('pluralize')
const jwt = require('jsonwebtoken');
const authAdmin = require('../middleware/authAdmin')

const router = express.Router();


router.post('/check-user', (req, res) => {
    const { email } = req.body;

    Admin.findOne({ email: email })
        .then(admin => {
            if (!admin) {
                return res.status(404).json({ message: "User not found" });
            }

            const token = jwt.sign(
                { email: admin.email },
                process.env.JWT_SECRET_ADMIN,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token: token });
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        });
});

router.post('/questions/:domain',authAdmin, (req, res) => {
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
