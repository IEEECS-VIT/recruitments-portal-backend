require('dotenv').config();
const mongoURL = process.env.mongoURL;

const mongoose = require('mongoose');
const Detail = require('./models/studentModel');
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongoURL);
const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const domainModels = {};

const cors = require('cors');
const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:5500','file://'],
  credentials: true,
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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ "message": "Unauthorized: Token missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ "message": "Unauthorized: Token expired" });
      } else {
        return res.status(403).json({ "message": "Forbidden: Invalid token" });
      }
    }
    if (!decoded || !decoded.email) {
      return res.status(403).json({ "message": "Forbidden: Token does not contain email" });
    }
    const userEmailFromToken = decoded.email;
    if (userEmailFromToken !== req.params.email) {
      return res.status(403).json({ "message": "Forbidden: Token does not match user's email" });
    }
    req.user = decoded;
    next();
  });
}

function generateAccessToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2d' });
}


app.post('/check_user', async (req, res) => {
  const email = req.body.email;
  try {
    const val = await searchMail(email);
    if (val === 1) {
      console.log("Found!");
      const accessToken = generateAccessToken(email);
      res.cookie('accessToken', accessToken, { 
        // httpOnly : true,
        // sameSite: 'none'
      });
      res.status(200).json({"message" : "Found!","accessToken": accessToken})
    } else if (val === 0) {
      console.log("Not Found!");
      res.status(404).json({"message" : "Not Found!"})
    } else if (val === 2) {
      console.log("DB Error!");
      res.status(500).json({"message" : "DB Error!"})
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  Detail.findOne({ EmailID: email })
    .then(details => {
      if (details) {
        res.status(200).json(details)
      } else {
        res.status(404).json({ message: "User not found" })
      }
    }).catch(error => {
      res.status(500).json({ message: error.message })
    })
})

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




app.put('/put_domains/:email', (req, res) => {
  const { email } = req.params;
  const domains = req.body.Domains;

  Detail.findOneAndUpdate(
    { EmailID: email },
    { Domains: domains },
    { new: true }
  ).then(updatedDetail => {
    const updatePromises = domains.map(domain => {
      if (!domainModels[domain]) {
        const schema = new mongoose.Schema({ EmailID: String });
        domainModels[domain] = mongoose.model(domain, schema);
      }
      const model = domainModels[domain];

      return model.findOne({ EmailID: email })
        .then(existingDoc => {
          if (existingDoc) {
            return Promise.resolve();
          } else {
            return model.create({ EmailID: email });
          }
        });
    });

    return Promise.all(updatePromises)
      .then(() => {
        res.status(200).json(updatedDetail);
      });
  }).catch(error => {
    console.error("Error updating domains:", error);
    res.status(500).json({ message: "Internal Server Error" });
  });
});



module.exports = app;