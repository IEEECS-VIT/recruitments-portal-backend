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
    }
});

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;