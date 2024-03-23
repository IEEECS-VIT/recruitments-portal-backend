const express = require('express');
const Response = require('../models/responseModel');
const authenticateToken = require("./auth");

const router = express.Router();

router.patch('/', authenticateToken, async (req, res) => {
    const { email, domain, questions } = req.body;

    try {
        const existingResponse = await Response.findOneAndUpdate(
            { email: email, domain: domain },
            {
                // $push: { questions: { $each: questions } },
                $set: { submissionTime: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' } ), questions: questions }
            },
            { new: true }
        );

        if (existingResponse) {
            res.status(200).json({ message: 'Response recorded successfully' });
        } else {
            res.status(404).json({ message: 'Response not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:email', authenticateToken, (req, res) => {
    const { email } = req.params
    Response.find({ email: email })
        .then(responses => {
            res.status(200).json(responses)
        }).catch(error => {
            res.status(500).json({ message: error.message })
        });
});

module.exports = router;