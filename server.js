const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.mongoURL;
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongoURL);
const Detail = require('./models/studentModel');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const adminRoute = require('./routes/adminRoute');
const responseRoute = require('./routes/responseRoute');
const domainRoute = require('./routes/domainRoute');
const questionRoute = require('./routes/questionRoute');
const evalRoute = require('./routes/evalRoute');
const Response = require('./models/responseModel');
const app = express();

app.use(cookieParser());
const cors = require('cors');
const corsOptions = {
  origin: ['https://recruitments-portal-seven.vercel.app','https://enrollments.ieeecsvit.com','http://localhost:3000','http://127.0.0.1:5500'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/admin', adminRoute);
app.use('/response', responseRoute);
app.use('/', domainRoute);
app.use('/eval', evalRoute);
app.use('/question', questionRoute);



const domainModels = {};


const PORT = process.env.PORT || 4030;
app.listen(PORT, () => {
  console.log(`Port is running at: ${PORT}`)
});

//Mongoose Connection
mongoose.connect(process.env.mongoURL)
  .then(() => {
    console.log('connected to monogdb');

  }).catch((error) => {
    console.log(error)
  });

  let ans = 0;
async function searchMail(emailId) {
  let ans = 0;
  try {
    await client.connect();
    const database = client.db('test');
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
      const accessToken = generateAccessToken(email);
      res.cookie('accessToken', accessToken, {
        // httpOnly : true,
        // sameSite: 'none'
      });
      res.status(200).json({ "message": "Found!", "accessToken": accessToken })
    } else if (val === 0) {
      res.status(404).json({ "message": "Not Found!" })
    } else if (val === 2) {
      res.status(500).json({ "message": "DB Error!" })
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/profile/:email', authenticateToken, (req, res) => {
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

app.get('/get_domains/:email', authenticateToken, async (req, res) => {
  const { email } = req.params;

  try {
    const student = await Detail.findOne({ EmailID: email });

    if (student) {
      const domains = student.Domains || {};
      const domainKeys = Object.keys(domains);
      const domainInfo = {};
      for (const domain of domainKeys) {
        const subdomains = domains[domain];
        const subdomainInfo = [];
        for (const subdomain of subdomains) {
          const response = await Response.findOne({ email: email, domain: subdomain });

          if (response && response.submissionTime) {
            subdomainInfo.push({ subdomain: subdomain, completed: true });
          } else {
            subdomainInfo.push({ subdomain: subdomain, completed: false });
          }
        }

        domainInfo[domain] = subdomainInfo;
      }

      res.status(200).json(domainInfo);
    } else {
      res.status(404).json({ message: "Details not found for the provided email" });
    }
  } catch (error) {
    console.error("Error finding details:", error);
    res.status(500).json({ message: "An error occurred while fetching details" });
  }
});



app.put('/put_domains/:domain/:email', authenticateToken, async (req, res) => {
  const { email, domain } = req.params;
  const newDomains = req.body[domain] || []

  try {
    let detail = await Detail.findOne({ EmailID: email });

    if (!detail) {
      throw new Error('Document not found');
    }

    if (!detail.Domains) {
      detail.Domains = {};
    }

    if (!detail.Domains[domain]) {
      detail.Domains[domain] = [];
    }

    const oldDomains = detail.Domains[domain] || [];

    for (const domain of oldDomains) {
      const model = domainModels[domain];
      if (model) {
        await model.deleteOne({ EmailID: email });
      }
    }

    detail.Domains[domain] = newDomains;
    await detail.save();

    for (const domain of newDomains) {
      if (!domainModels[domain]) {
        const schema = new mongoose.Schema({ EmailID: String });
        domainModels[domain] = mongoose.model(domain, schema);
      }
      const model = domainModels[domain];
      const existingDoc = await model.findOne({ EmailID: email });
      if (!existingDoc) {
        const newDoc = await model.create({ EmailID: email });
      }
    }

    res.status(200).json(detail);
  } catch (error) {
    console.error(`Error updating ${domain} domains:`, error);
    console.error(error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = app;