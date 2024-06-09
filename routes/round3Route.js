const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Detail = require('../models/studentModel');

router.get("/get_details/:email", authenticateToken, async (req, res) => {
    const { email } = req.params;

    try {
        const val = await Detail.findOne({ EmailID: email });

        if (val) {
            const modifiedData = Object.entries(val.Report).map(([domain, rounds]) => {
                const round3Result = rounds.round3 === 0 ? "Pending" : rounds.round3 === 1 ? "Accepted" : "Rejected";

                return { domain, round3Result };
            });

            res.status(200).json({ message: 'Round 3 Details', round3: modifiedData });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
