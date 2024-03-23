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
        questions: [{
            q: {
                type: String
            },
            ans: {
                type: String
            }
        }],
        startTime: {
            type: String
        },
        submissionTime: {
            type: String
        },
        endTime: {
            type: String
        }
      
    }
)

const Response = mongoose.model('Response', responseSchema)

module.exports = Response;  
