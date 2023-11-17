const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('./database.js'); // Import the MySQL connection
const multer = require('multer');

// Define a route to add data to the database
router.get("/", (req, res) => {
    res.send("Welcome to users!");
});

//image upload
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/img/uploads/'); // "uploads" is the folder where images will be saved
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post('/addProfilePicture',upload.single('avatar'), (req,res) => {  
    if (req.file) {
        const filename = req.file.filename;
        const dataToUpdate = {
            profile_picture : filename
        };
        const query = 'UPDATE users SET ? WHERE user_id = ?';
        db.query(query, [dataToUpdate,req.body.user_id], (err, results) => {
            if (err) {
                console.error('Error inserting data: ' + err);
            } else {
                // File was uploaded successfully
                res.redirect(`/pages/profile/${req.body.user_id}`);
            }
        });        
    } else {
        // No file was uploaded
        res.status(400).json({ message: 'No file uploaded' });
    }
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
    const query = 'SELECT users.*,SUM(projects.likes_count) as likes_count FROM users LEFT JOIN projects ON users.user_id = projects.user_id WHERE users.user_id = ?';
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