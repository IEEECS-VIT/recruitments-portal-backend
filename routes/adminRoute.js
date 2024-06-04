const express = require('express');
const Detail = require('../models/studentModel');
const Admin = require('../models/adminModel');
const Question = require('../models/questionModel');
const responseRound2 = require('../models/responseRound2Model');
const jwt = require('jsonwebtoken');
const authAdmin = require('../middleware/authAdmin');
const GD = require('../models/groupDiscussionModel')
const r3GD = require('../models/round3GDModel')
const router = express.Router();
const seniorCore = require('../models/seniorCoreModel');
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

router.post('/questions/:domain', authAdmin, (req, res) => {
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

router.get('/get_details/round2/:domain', authAdmin, async (req, res) => {
    const { email } = req.params;

    try {

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/get-gd/:domain' , authAdmin , async (req,res) => {
    const domain = req.params.domain;
    const gd = await GD.find({domain}).exec();
    res.status(200).json(gd);
});

router.get('/get-gd/round3/:domain' , authAdmin , async (req,res) => {
    const domain = req.params.domain;
    const gd = await r3GD.find({domain}).exec();
    res.status(200).json(gd);
});

router.put('/create-gd', authAdmin, async (req, res) => {
    try {
        console.log("Inside create GD");
        const { domain, teamName, date, time, meetLink, teamMembers, supervisors } = req.body;

        if (!Array.isArray(teamMembers) || !Array.isArray(supervisors)) {
            return res.status(400).json({ error: 'teamMembers and supervisors must be arrays' });
        }
        const existingTeam = await GD.findOne({ 'teamName': teamName  , 'domain' : domain});
        if (existingTeam) {
            return res.status(400).json({ error: 'A team with the same name in the domain already exists' });
        }

        const newTeam = new GD({
            domain,
            teamName,
            date,
            time,
            meetLink,
            teamMembers,
            supervisors

        });

        await newTeam.save();

        res.status(201).json({ message: 'Team created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/create-gd/round3', authAdmin, async (req, res) => {
    try {
        console.log("Inside create GD");
        const { domain, teamName, date, time, meetLink, teamMembers, supervisors } = req.body;

        if (!Array.isArray(teamMembers) || !Array.isArray(supervisors)) {
            return res.status(400).json({ error: 'teamMembers and supervisors must be arrays' });
        }
        const existingTeam = await r3GD.findOne({ 'teamName': teamName  , 'domain' : domain});
        if (existingTeam) {
            return res.status(400).json({ error: 'A team with the same name in the domain already exists' });
        }

        const newTeam = new GD({
            domain,
            teamName,
            date,
            time,
            meetLink,
            teamMembers,
            supervisors

        });

        await newTeam.save();

        res.status(201).json({ message: 'Team created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/senior-core', authAdmin, async (req, res) => {
    const seniorCoreRes = await seniorCore.find().exec();
    res.status(200).json(seniorCoreRes);

});

router.post('/senior-core/:action', authAdmin, async (req, res) => {
    const action = req.params.action;
    const { email } = req.body;
    if (action === 'add') {
        const newSeniorCore = new seniorCore({
            email
        });
        await newSeniorCore.save();
        res.status(201).json({ message: 'Senior Core added successfully' });
    } else if (action === 'remove') {
        await seniorCore.deleteOne({ email });
        res.status(200).json({ message: 'Senior Core removed successfully' });
    } else {
        res.status(400).json({ message: 'Invalid action' });
    }
});
// Route to get details where round 1 = 1 and round 2 is none
router.get("/round2/none/:domain", authAdmin, async (req, res) => {
  const { domain } = req.params;
  const query = {};
  query[`Report.${domain}.round1`] = 1;
  query[`Report.${domain}.round2`] = 0;

  try {
    const emails = await responseRound2.find({ domain }, { email: 1, _id: 0 });
    const emailsArray = emails.map((doc) => doc.email);

    if (domain === "events" || domain === "pnm") {
        const documents = await Detail.find(query); res.status(200).json(documents); 
    } else {
      const documents = await Detail.find({
        EmailID: { $in: emailsArray },
        ...query,
      });
      res.status(200).json(documents);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get details where round 1 = 0 (rejected)
router.get("/round2/rejected/:domain", authAdmin, async (req, res) => {
  const { domain } = req.params;
  const query = {};
  query[`Report.${domain}.round1`] = 1;
  query[`Report.${domain}.round2`] = 2;

  try {
    const emails = await responseRound2.find({ domain }, { email: 1, _id: 0 });
    const emailsArray = emails.map((doc) => doc.email);

    if (domain === "events" || domain === "pnm") {
        const documents = await Detail.find(query); res.status(200).json(documents); 
    } else {
      const documents = await Detail.find({
        EmailID: { $in: emailsArray },
        ...query,
      });
      res.status(200).json(documents);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get details where round 1 = 1 and round 2 = 1 (accepted)
router.get("/round2/accepted/:domain", authAdmin, async (req, res) => {
  const { domain } = req.params;
  const query = {};
  query[`Report.${domain}.round1`] = 1;
  query[`Report.${domain}.round2`] = 1;

  try {
    const emails = await responseRound2.find({ domain }, { email: 1, _id: 0 });
    const emailsArray = emails.map((doc) => doc.email);

    if (domain === "events" || domain === "pnm") {
        const documents = await Detail.find(query); res.status(200).json(documents); 
    } else {
      const documents = await Detail.find({
        EmailID: { $in: emailsArray },
        ...query,
      });
      res.status(200).json(documents);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
