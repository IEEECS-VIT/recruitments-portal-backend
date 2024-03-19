const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURL = process.env.mongoURL;
const uri = mongoURL;

const client = new MongoClient(uri);

async function connectToDatabase(emailId) {
    try {
        await client.connect();

        console.log('Connected to the database');
        const database = client.db('Members');
        const collection = database.collection('Details');
        const queryResult = await collection.findOne({ EmailID: emailId });
        console.log('Query Result:', queryResult);
        if(queryResult){
            console.log('Skoa');
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        await client.close();
    }
}

// connectToDatabase('amrit.sundarka2022@vitstudent.ac.in'); 

const mongoose = require('mongoose');

// Get a reference to the collection
const collection = mongoose.connection.collection('Details');

// Example: Update a single document in the collection
collection.updateOne(
  { 'emailID': 'akshit.anand2022@vitstudent.ac.in' }, // Filter for the document you want to update
  { $set: { 
      'domains': "web"  // Set new values for the domains field
  } }, // Update operation
  (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  }
);