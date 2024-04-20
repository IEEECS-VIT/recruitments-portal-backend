const mongoose = require('mongoose');

const responseRound2Schema = mongoose.Schema({
    email: {
        type: String
    },
    domain: {
        type: String,
        required: true,
    },
    easy:[{
        question: String,
        links: {
            link1: String, 
            link2: [String]   
        }
    }],
    medium: [{
        question: String,
        links: {
            link1: String, 
            link2: [String]   
        }
    }],
    hard: [{
        question: String,
        links: {
            link1: String, 
            link2: [String]   
        }
    }]
});

const responseRound2 = mongoose.model('responseRound2', responseRound2Schema);

module.exports = responseRound2;
