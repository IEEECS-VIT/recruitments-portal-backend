const mongoose = require('mongoose');

const R3GDSchema = mongoose.Schema({
    domain: {
        type: String,
        required: true,
    },
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

});

const R3GD = mongoose.model('R3GD', R3GDSchema);

module.exports = R3GD;