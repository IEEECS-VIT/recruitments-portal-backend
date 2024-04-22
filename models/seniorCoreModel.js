const mongoose = require ('mongoose')

const seniorCoreSchema = mongoose.Schema ({
    email: {
        type: String
    }
})

const seniorCore = mongoose.model('seniorCore', seniorCoreSchema)

module.exports = seniorCore