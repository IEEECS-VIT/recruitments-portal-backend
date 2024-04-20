const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    domain: {
        type: String,
        required: true,
    },
    questions: {
        easy: [{
            type: String
        }],
        medium: [{
            type: String
        }],
        hard: [{
            type: String
        }]
    },
    team: {
        teamName: {
            type: String
        },
        date: {
            type: String
        },
        time: {
            type: String
        },
        meetLink: {
            type: String
        },
        teamMembers: [{
            type: String
        }],
        supervisors: [{
            type: String
        }]
    }
});

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;