const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
    {
        domain: {
            type: String,
            required: true
        },
        allQuestions: [{
            type: {
                type: String,
                enum: ['subjective', 'mcq'],
                required: true
            },
            question: {
                type: String,
                required: true
            },
            options: {
                type: [String],
                default: []
            }
        }]       
    }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;


