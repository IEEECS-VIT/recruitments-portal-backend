const express = require('express');
const Response = require('../models/responseModel');
const authenticateToken = require("../middleware/auth");
const authAdmin = require('../middleware/authAdmin')
const router = express.Router();

router.patch('/submit', authenticateToken, async (req, res) => {
    const { email, domain, questions } = req.body;

    try {
        const existingResponse = await Response.findOneAndUpdate(
            { email: email, domain: domain },
            {
                $set: { submissionTime: new Date().toLocaleTimeString('en-IN',{ timeZone: 'Asia/Kolkata' } ),
                        questions: questions }
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
router.get('/get_time/:domain/:email', async (req, res) => {
    const { domain , email} = req.params;
    try {
        let response = await Response.findOne({ email: email, domain: domain });

        if (response) {
            res.status(200).json({ "time": response.endTime });
        } else {
            res.status(404).json({ "error": "Time not found" });
        }
    } catch (error) {
        console.error("Error fetching time:", error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

router.get('/:email',authAdmin, (req, res) => {
    const { email } = req.params
    Response.find({ email: email })
        .then(responses => {
            res.status(200).json(responses)
        }).catch(error => {
            res.status(500).json({ message: error.message })
        });
});

router.get('round2/:email',authAdmin, (req, res) => {
    const { email } = req.params
    Response.find({ email: email })
        .then(responses => {
            res.status(200).json(responses)
        }).catch(error => {
            res.status(500).json({ message: error.message })
        });
});

module.exports = router;