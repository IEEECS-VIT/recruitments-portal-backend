const mongoose = require('mongoose');
const Detail = require('./models/studentModel'); // Adjust the path as necessary

require('dotenv').config();
const mongoURI = process.env.mongoURL;

// Array of emails to update
const researchEmails = [
    "aditya.rai2022@vitstudent.ac.in",
    "bhavya.harlalka2022@vitstudent.ac.in",
    "niyati.kumaria2022@vitstudent.ac.in",
    "arjunaryaa.kumar2022@vitstudent.ac.in",
    "varun.malavan2022@vitstudent.ac.in",
    "aryan.poojary2022@vitstudent.ac.in",
    "shaan.jain2022@vitstudent.ac.in",
    "prabhitha.miracline2022@vitstudent.ac.in",
    "anshuman.aryan2022@vitstudent.ac.in",
    "devarsh.vinay2022@vitstudent.ac.in",
    "kanishka.sahu2022@vitstudent.ac.in",
    "aryankumar.singh2022@vitstudent.ac.in",
    "arshamaria.joyson2022@vitstudent.ac.in",
    "muskaan.dangi2022@vitstudent.ac.in",
    "jagruthi.sharma2022@vitsudent.ac.in",
    "dhruvvenu.nair2022@vitstudent.ac.in",
    "kundanika.reddy2022@vitstudent.ac.in"
];

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
        return Detail.updateMany(
            { EmailID: { $in: researchEmails } },
            { $set: { 'Report.research.round3': 1 } }
        );
    })
    .then(updateResult => {
        console.log(`Round 3 status updated for research domain. Modified count: ${updateResult.modifiedCount}`);
        return mongoose.disconnect();
    })
    .then(() => {
        console.log('Disconnected from MongoDB');
    })
    .catch(error => {
        console.error('Error:', error);
    });