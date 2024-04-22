const mongoose = require('mongoose');

const GDSchema = mongoose.Schema({
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

const GD = mongoose.model('groupdiscussion', GDSchema);

module.exports = GD;