const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
    {
        Register_Number: {
            type: String,
            required: true
        },
        Student_Name: {
            type: String,
            required: true
        },
        EmailID: {
            type: String,
            required: true
        },
        Mobile_No: {
            type: Number,
            required: true
        },
        Domains: {
            type: [String],
            required: true
        }
}, {collection : 'Details'});

const Detail = mongoose.model('Details', studentSchema);

module.exports = Detail;