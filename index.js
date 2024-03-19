require('dotenv').config();
const mongoURL = process.env.mongoURL;
const mongoose = require('mongoose');
const Detail = require('./models/studentModel');
// const mongoURL2 = process.env.mongoURL2;
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongoURL);
const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');

const corsOptions = {
  origin: 
  ['http://127.0.0.1:5173'
  ,'http://127.0.0.1:5500'
],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4030;
mongoose.connect(process.env.mongoURL)
  .then(() => {
    console.log('connected to monogdb');
    app.listen(PORT, () => {
      console.log(`Port is running at: ${PORT}`)
    });
  }).catch((error) => {
    console.log(error)
  });
async function searchMail(emailId) {
  let ans = 0;
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected !!");
    console.log(emailId);
    const database = client.db('Members');
    const collection = database.collection('Details');
    const queryResult = await collection.findOne({ EmailID: emailId });
    // console.log(queryResult);

    if (queryResult) {
      ans = 1;
    }
    else {
      ans = 0;
    }
  } catch (error) {
    ans = 2;
  } finally {
    await client.close();
    return ans;
  }
}

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({"message" : "Unauthorized: Token missing"});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({"message" : "Unauthorized: Token expired"});
      } else {
        return res.status(403).json({"message" : "Forbidden: Invalid token"});
      }
    }

    // Check if decoded exists and has email property
    if (!decoded || !decoded.email) {
      return res.status(403).json({"message" : "Forbidden: Token does not contain email"});
    }

    // Extract user identifier from the decoded token
    const userEmailFromToken = decoded.email;

    // Check if the token matches with the current user's email
    if (userEmailFromToken !== req.params.email) {
      return res.status(403).json({"message" : "Forbidden: Token does not match user's email"});
    }

    req.user = decoded;
    next();
  });
}




app.post('/check_user', async (req, res) => {
  const email = req.body.email;
  const user = { username: req.body.email };
  const accessToken = jwt.sign(user, process.env.JWT_SECRET);
  try {
    const val = await searchMail(email);
    if (val === 1) {
      console.log("Found!");
      res.status(200).json({"message" : "Found!",accesstoken: accessToken})
    } else if (val === 0) {
      console.log("Not Found!");
      res.status(404).json({"message" : "Not Found!",accesstoken : accessToken})
    } else if (val === 2) {
      console.log("DB Error!");
      res.status(500).json({"message" : "DB Error!",accesstoken : accessToken})
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/get_domains/:email', authenticateToken,(req, res) => {
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


app.get('/profile/:email',authenticateToken, (req, res) => {
  const { email } = req.params;
  Detail.findOne({ EmailID: email })
    .then(details => {
      res.status(200).json(details)
    }).catch(error => {
      res.status(500).json({ message: error.message })
    })
})

app.put('/put_domains/:email',authenticateToken, (req, res) => {
  const { email } = req.params;
  Detail.findOneAndUpdate({ EmailID: email }, req.body)
    .then(details => {
      if (!details) {
        return res.status(404).json({ message: "Student not found" });
      }
      Detail.findOne({ EmailID: email })
        .then(updatedDetail => {
          res.status(200).json(updatedDetail)
        })
    }).catch(error => {
      res.status(500).json
    })
})


module.exports = app;