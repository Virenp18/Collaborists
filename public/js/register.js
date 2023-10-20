const express = require('express');
const router = express.Router();
const db = require('../../src/database.js'); // Correct the path to your 'database.js' file

// Registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/users', (req, res) => {
  const { username, email, password } = req.body;

  // Implement registration logic here
  // Insert user data into the database (assuming 'users' table)
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) throw err;
    console.log('User registered');
    res.redirect('/login');
  });
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Implement login logic here
  // Check user credentials and set up a session
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.loggedIn = true;
      req.session.user = results[0];
      res.redirect('/profile');
    } else {
      res.redirect('/login');
    }
  });
});


// Profile page
router.get('/profile', (req, res) => {
  if (req.session.loggedIn) {
    res.render('profile', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
