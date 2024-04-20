const express = require('express')
const Tasks = require('../models/taskModel')
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

module.exports = router;