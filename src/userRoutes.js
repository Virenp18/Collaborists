const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('./database.js'); // Import the MySQL connection

// Define a route to add data to the database
router.get("/", (req, res) => {
    res.send("Welcome to users!");
});

router.post('/register', (req, res) => {
    const dataToInsert = {
        username: req.body.name,
        email: req.body.email,
        password : req.body.password
    };
    // console.log(dataToInsert);
    const query = 'INSERT INTO users SET ?';
    db.query(query, dataToInsert, (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err);
        } else {
            res.status(200).send({
                status: "success",
                message : "User Created"
            });
        }
    });
    // Redirect to a success page or perform any other actions as needed
    // res.redirect('/pages/boards');
});

router.post('/login', (req, res) => {
    const dataToInsert = {
        email: req.body.email,
        password : req.body.password
    };
    // console.log(dataToInsert);
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [dataToInsert.email,dataToInsert.password], (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err);
        }
        if (results.length > 0) {
            // User found, authentication successful
            res.status(200).json({ status:'success', message: 'Authentication successful',results:results });
        } else {
            // User not found or invalid credentials
            res.status(401).json({ error: 'Invalid username or password' });
        }   
    });
});

router.get('/:id',async(req,res) => {
    const user = req.params.id;
    // get User Details
    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, user, (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err);
        }
        if (results.length > 0) {
            // User found, authentication successful
            res.status(200).json({ status:'success', message: 'User found successful',results:results[0] });
        } else {
            // User not found or invalid credentials
            res.status(401).json({ error: 'Invalid username or password' });
        }   
    });
})




module.exports = router;