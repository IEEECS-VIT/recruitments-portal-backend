const express = require('express');
const mongoose = require('mongoose');
const pluralize = require('pluralize');
const Details = require('../models/studentModel');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin')

router.get('/:domain', authAdmin, async (req, res) => {
    let { domain } = req.params;
    // if (!pluralize.isPlural(domain)) {
    //     domain = pluralize.plural(domain);
    // }

    const query = {};
    query[`Report.${domain}.round1`] = 0;

    try {
        const documents = await Details.find(query); 
        res.status(200).json(documents.EmailID); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.get('/:domain', authAdmin, (req, res) => {
    
//     let  { domain } = req.params;
//     if (!pluralize.isPlural(domain)) {
//         domain = pluralize.plural(domain);
//     }
//     const collection = mongoose.connection.collection(`${domain}`);
//     collection.find().toArray()
//     .then(documents => {
//         res.status(200).json(documents)
//     }) .catch (error => {
//         res.status(500).json({message: error.message})
//     })
// })


module.exports = router