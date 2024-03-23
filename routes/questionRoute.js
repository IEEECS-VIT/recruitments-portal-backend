const express = require('express');
const Question = require('../models/questionModel');
const responses = require('../models/responseModel')
const mongoose = require('mongoose');
const authenticateToken = require("./auth")
const router = express.Router();

router.post('/:domain/:email',authenticateToken,async  (req, res) => {
    const { domain } = req.params;
    const {email } =  req.user;
    const collection = mongoose.connection.collection('responses');
        let response = await collection.findOne({ email:email, domain : domain} );
        console.log(response);
        if (!response) {
                    
            const currentTime = new Date();
            const futureTime = new Date(currentTime.getTime() + (20 * 60000));
            const startTime = currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
            const endTime = futureTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

            const resp1 = new responses({
                email: email,
                domain: domain,
                submissions : [],   
                startTime: startTime,
                endTime :endTime,
                submissionTime : ""

            });
            
            await resp1.save();
        }
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