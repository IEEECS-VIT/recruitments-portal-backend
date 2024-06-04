const express = require('express');
const seniorCore = require('../models/seniorCoreModel');
const groupDiscussions = require('../models/groupDiscussionModel') 
const r3GD = require('../models/round3GDModel')
const authSeniorCore = require('../middleware/authsenior');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Details = require('../models/studentModel');
const cookieParser = require('cookie-parser');
const authseniorcore = require('../middleware/authsenior');
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


router.get('/group-discussion/:domain/:email',authSeniorCore, async (req, res) => {
    const {email, domain} = req.params;

    try {
        const discussion = await groupDiscussions.find({
            domain: domain,
            supervisors: { $in: [email] }
        });

        const teamName = discussion.map(discussion => discussion.teamName)

        res.status(200).json(teamName)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


router.get('/teamDetails/:teamName/:domain',authSeniorCore, async (req, res) => {
    const {teamName,domain} = req.params;

    try {
        const teamDetails = await groupDiscussions.findOne ({
            domain: domain,
            teamName: teamName
        });

        if(teamDetails) {
            res.status(200).json(teamDetails)
        } else {
            res.status(404).json({ message: 'No team found with that name' });
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.put('/meetLink',authSeniorCore, async (req, res) => {
    const { teamName, domain, meetLink } = req.body;

    try {
        const updatedTeam = await groupDiscussions.findOneAndUpdate(
            { teamName, domain },
            { $set: { meetLink } },
            { new: true, upsert: true }
        );

        if (updatedTeam) {
            res.status(200).json({ message: 'Meet link updated successfully' });
        } else {
            res.status(404).json({ message: 'No team found with that name' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/set_round2_gd", authseniorcore, async (req, res) => {
    const { result, email, round, domain } = req.body;
    const update = {};
    update[`Report.${domain}.round${round}`] = result;

    try {
        const updatedDetail = await Details.findOneAndUpdate(
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


router.get('/group-discussion/round3/:domain/:email',authSeniorCore, async (req, res) => {
    const {email, domain} = req.params;

    try {
        const discussion = await r3GD.find({
            domain: domain,
            supervisors: { $in: [email] }
        });

        const teamName = discussion.map(discussion => discussion.teamName)

        res.status(200).json(teamName)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


router.get('/teamDetails/round3/:teamName/:domain',authSeniorCore, async (req, res) => {
    const {teamName,domain} = req.params;

    try {
        const teamDetails = await r3GD.findOne ({
            domain: domain,
            teamName: teamName
        });

        if(teamDetails) {
            res.status(200).json(teamDetails)
        } else {
            res.status(404).json({ message: 'No team found with that name' });
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.put('/meetLink/round3',authSeniorCore, async (req, res) => {
    const { teamName, domain, meetLink } = req.body;

    try {
        const updatedTeam = await r3GD.findOneAndUpdate(
            { teamName, domain },
            { $set: { meetLink } },
            { new: true, upsert: true }
        );

        if (updatedTeam) {
            res.status(200).json({ message: 'Meet link updated successfully' });
        } else {
            res.status(404).json({ message: 'No team found with that name' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/set_round3_gd", authseniorcore, async (req, res) => {
    const { result, email, round, domain } = req.body;
    const update = {};
    update[`Report.${domain}.round${round}`] = result;

    try {
        const updatedDetail = await Details.findOneAndUpdate(
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