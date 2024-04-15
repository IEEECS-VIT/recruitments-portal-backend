const express = require ('express');
const Detail = require('../models/studentModel');
const Admin = require('../models/adminModel');
const Question = require('../models/questionModel');
const pluralize = require('pluralize');
const jwt = require('jsonwebtoken');
const authAdmin = require('../middleware/authAdmin');
const router = express.Router();

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.post('/check-user', async (req, res) => {
    const { email } = req.body;
    console.log("Inside Admin");
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
            res.cookie('token', token, {
                // httpOnly: true,
                // sameSite: 'none'
            });
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


router.get('/profile/:email', authAdmin, (req, res) => {
    const { email } = req.params;
    Detail.findOne({ EmailID: email })
        .then(details => {
            if (details) {
                res.status(200).json(details)
            } else {
                res.status(404).json({ message: "User not found" })
            }
        }).catch(error => {
            res.status(500).json({ message: error.message })
        })
})


module.exports = router;
