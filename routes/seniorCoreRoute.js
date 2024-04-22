const express = require('express');
const seniorCore = require('../models/seniorCoreModel');
const authSeniorCore = require('../middleware/authsenior');
const jwt = require('jsonwebtoken');
const router = express.Router();

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.post('/check-user', async (req, res) => {
    const { email } = req.body;
    seniorCore.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "Senior Core user not found" });
            }

            const token = jwt.sign(
                { email: email },
                process.env.JWT_SECRET_SENIORCORE,
                { expiresIn: '5h' }
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


module.exports = router;