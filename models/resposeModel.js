const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },    
    domain: {
        type: String,
        required: true
    },         
    submissions: [{
        question: {
            type: String
        },
        answer: {
            type: String
        }
    }],
    startTime: {
        type: Date,
        default: Date.now
    },
    submissionTime: {
        type: Date
    },
    endTime: {
        type: Date
    }
})

const Response = mongoose.model('Response', responseSchema)

module.exports = Response;