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
        }]  
    }
)

const Response = mongoose.model('Response', responseSchema)

module.exports = Response;  