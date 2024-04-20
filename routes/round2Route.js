const express = require('express')
const Tasks = require('../models/taskModel')
const Response = require('../models/responseRound2Model')
const Detail = require('../models/studentModel') 
const authenticateToken = require('../middleware/auth')
const router = express.Router();

router.get('/tasks/:domain/:email',authenticateToken, async (req, res) => {
    const domain = req.params.domain;
    const email = req.params.email;
    try {
        const student = await Detail.findOne({ EmailID: email }).exec();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (student.Report[domain] && student.Report[domain].round1 == 1) {
            const tasks = await Tasks.find({ domain }).exec();
            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ message: 'Tasks not found for the specified domain' });
            }
            res.json(tasks);
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

router.put('/submit', authenticateToken, async (req, res) => {
    const { email, domain, question, difficulty, link1, link2 } = req.body;

    try {
        let response = await Response.findOne({ email: email, domain: domain });

        if (response) {
            const questionIndex = response[difficulty].findIndex(q => q.question === question);

            if (questionIndex !== -1) {
                response[difficulty][questionIndex].links.link1 = link1;
                response[difficulty][questionIndex].links.link2 = link2;
            } else {
                response[difficulty].push({ question: question, links: { link1: link1, link2: link2 } });
            }
        } else {
            response = new Response({
                email: email,
                domain: domain,
                [difficulty]: [{ question: question, links: { link1: link1, link2: link2 } }]
            });
        }

        await response.save();
        res.status(200).json({ message: 'Link updated or created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
module.exports = router;
