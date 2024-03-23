const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('./auth');
const Detail = require('../models/studentModel')
const router = express.Router();

router.post("/set_report", async (req, res) => {
    const { result, email, round } = req.body;
    const update = {};
    update["Report." + round] = result; 

    try {
        console.log("Here");
        const updatedDetail = await Detail.findOneAndUpdate(
            { EmailID: email },
            { $set: update },
            { new: true }
        );

        if (updatedDetail) {
            res.status(200).json({ message: 'Round details updated successfully', updatedDetail });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
