const mongoose = require('mongoose');

const responseRound2Schema = mongoose.Schema({
    domain: {
        type: String,
        required: true,
    },
    easy:[{
        question: String,
        links: [{
            githubRepo: String, 
            otherLink: String   
        }] 
    }],
    medium: [{
        question: String,
        links: [{
            githubRepo: String, 
            otherLink: String   
        }]
    }],
    hard: [{
        question: String,
        links: [{
            githubRepo: String, 
            otherLink: String   
        }]
    }]
});

const responseRound2 = mongoose.model('responseRound2', responseRound2Schema);

module.exports = responseRound2;
