const mongoose = require('mongoose');
const Student = require('./models/studentModel'); // Assuming your model file is named studentModel.js

// Update schema to include new fields
const updateSchema = async () => {
    try {
        await Student.updateMany(
            {},
            {
                $set: {
                    Domains: {
                        tech: [],
                        design: [],
                        management: []
                    },
                    Report: {
                        round1: 0,
                        round2: 0,
                        round3: 0
                    }
                }
            }
        );

        console.log('Schema updated successfully');
    } catch (error) {
        console.error('Error updating schema:', error);
    }
};

// Call the function to update the schema
updateSchema();
