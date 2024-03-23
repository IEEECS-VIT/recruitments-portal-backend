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
            tech: {
                type: [String]
            },
            design: {
                type: [String]
            },
            management: {
                type: [String]
            }
        },
        Report : {
            round1 : {
                type : Number,
                default : 0
            },
            round2: {
                type : Number,
                default : 0
            },
            round3 : {
                type : Number,
                default : 0
            },
        }
}, {collection : 'Details'});

const Detail = mongoose.model('Details', studentSchema);

module.exports = Detail;