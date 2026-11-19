
/********************************************************************************
* WEB322 - Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Soroosh kazemi matin Student ID: ______________ Date: 2026/11/17
*
********************************************************************************/
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active",
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive",
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active",
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active",
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active",
  },
];

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const log = `Request from: ${req.get('user-agent')} at ${new Date().toLocaleString()}`;
  console.log(log);
  req.log = log;
  next();
});

function verifyBounty(req, res, next) {
  const result = Math.floor(Math.random() * 2);
  if (result === 1) {
    next();
  } else {
    res.status(403).send('403 - The Marines have blocked your path. Turn back.');
  }
}

app.get('/', (req, res) => {
  res.render('index', { crew: crewMembers });
});

app.get('/crew', (req, res) => {
  res.render('crew', { crew: crewMembers });
});

app.get('/recruit', (req, res) => {
  res.render('recruit', { errors: [], success: '', form: {} });
});

app.post('/recruit', (req, res) => {
  const { applicantName, skill, role, message, sea, agreeTerms } = req.body;
  const errors = [];

  if (!applicantName || !applicantName.trim()) errors.push('Please enter your name.');
  if (!skill || !skill.trim()) errors.push('Please enter your special skill.');
  if (!role || role === 'Select a role') errors.push('Please select a role.');
  if (!message || !message.trim()) errors.push('Please explain why you want to join.');
  if (!sea) errors.push('Please select a sea.');
  if (!agreeTerms) errors.push('You must agree to the risks.');

  if (errors.length > 0) {
    return res.render('recruit', { errors, success: '', form: req.body });
  }

  crewMembers.push({
    id: crewMembers.length + 1,
    name: applicantName.trim(),
    role,
    devilFruit: 'None',
    bounty: 0,
    status: 'pending',
    skill: skill.trim(),
    message: message.trim(),
    sea
  });

  res.render('recruit', { errors: [], success: 'Your application has been submitted!', form: {} });
});

app.get('/log-pose', verifyBounty, (req, res) => {
  res.render('logPose', { crew: crewMembers, log: req.log });
});

app.get('/error-test', (req, res) => {
  throw new Error('Engine malfunction!');
});

app.use((req, res) => {
  res.status(404).render('404', { message: "404 - We couldn't find what you're looking for on the Grand Line." });
});

app.use((err, req, res, next) => {
  res.status(500).send(`500 - Something went wrong on the Thousand Sunny: ${err.message}`);
});

if (require.main === module) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
