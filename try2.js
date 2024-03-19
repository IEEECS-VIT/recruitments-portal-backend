require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Detail = require('./models/studentModel');
// require('dotenv').config();
// const mongoURL = process.env.mongoURL;

const app = express();
const PORT = process.env.PORT || 4030;

app.use(express.json())

app.get('/details', (req, res) => {
  Detail.find({})
  .then(details => {
    res.status(200).json(details);
  }) .catch(error => {
    res.status(500).json({message: error.message});
  })
});

app.get('/details/:email', (req, res) => {
  const { email } = req.params;
  Detail.findOne({ EmailID: email })
    .then(details => {
      if (details) {
        const domains = details.Domains || [];
        res.status(200).json(domains);
      } else {
        res.status(404).json({ message: "Details not found for the provided email" });
      }
    })
    .catch(error => {
      console.error("Error finding details:", error);
      res.status(500).json({ message: "An error occurred while fetching details" });
    });
});


app.get('/profile/:email', (req,res) => {
  const { email } = req.params;
  Detail.findOne({EmailID: email})
  .then (details => {
    res.status(200).json(details)
  }) .catch (error => {
    res.status(500).json({message: error.message})
  })
})

app.put('/details/:email', (req, res) => {
  const { email } = req.params;
  Detail.findOneAndUpdate({EmailID: email}, req.body)
    .then(details => {
      if (!details) {
        return res.status(404).json({ message: "Student not found" });
      }
      Detail.findOne({EmailID: email})
        .then(updatedDetail => {
          res.status(200).json(updatedDetail)
        })
    }).catch(error => {
      res.status(500).json
    })
})



mongoose.connect(process.env.mongoURL2)
  .then(() => {
    console.log('connected to monogdb');
    app.listen(PORT, () => {
      console.log(`Port is running at: ${PORT}`)
    });
  }).catch((error) => {
    console.log(error)
  });

