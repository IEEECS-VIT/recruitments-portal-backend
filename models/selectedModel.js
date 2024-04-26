const mongoose = require('mongoose')

const selectedSchema = mongoose.Schema({
    
    domain: {
        type: String
    },
    email: {
        type: [String]
    }
})

const selected = mongoose.model('selected', selectedSchema)

module.exports = selected