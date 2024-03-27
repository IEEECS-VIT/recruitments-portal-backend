const express = require('express');
const mongoose = require('mongoose');
const pluralize = require('pluralize');
const router = express.Router();

router.get('/:domain', (req, res) => {
    let  { domain } = req.params;
    if (!pluralize.isPlural(domain)) {
        domain = pluralize.plural(domain);
    }
    const collection = mongoose.connection.collection(`${domain}`);
    collection.find().toArray()
    .then(documents => {
        res.status(200).json(documents)
    }) .catch (error => {
        res.status(500).json({message: error.message})
    })
})

module.exports = router