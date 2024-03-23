const express = require('express');
const Response = require('../models/responseModel');


const router = express.Router();

router.post('/', (req, res) => {
    const { email, domain, questions } = req.body;
    const newResponse = new Response({ email, domain, questions });

    newResponse.save()
        .then(() => res.status(201).json({ message: 'Response created successfully' }))
        .catch(error => res.status(500).json({ message: error.message }));
});

router.get('/:email', (req, res) => {
    const { email } = req.params
    Response.find({email: email})
    .then (responses => {
        res.status(200).json(responses)
    }) .catch (error => {
        res.status(500).json({message: error.message})
    });
});

module.exports = router;