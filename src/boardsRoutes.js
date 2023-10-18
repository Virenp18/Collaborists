const express = require('express');
const router = express.Router();
const db = require('./database.js'); // Import the MySQL connection

// Define a route to add data to the database
router.get("/", async (req, res) => {
    res.send("Welcome Aboard!");
});
  
router.post('/addBoard', (req, res) => {
    const dataToInsert = {
        board_name: req.body.boardName,
        user_id: 1
    };

    const query = 'INSERT INTO boards SET ?';

    db.query(query, dataToInsert, (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err);
        } else {
            res.status(200).send({
                status: "success",
                message : "Board Name Inserted"
            });
        }
    });

    // Redirect to a success page or perform any other actions as needed
    // res.redirect('/pages/boards');
});

router.post('/addBoardPin', (req, res) => {
    const dataToInsert = {
        user_id: 4,
        title: req.body.title,
        description : req.body.description
    };

    const query = 'INSERT INTO projects SET ?';

    db.query(query, dataToInsert, (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err);
        } else {
            res.status(200).send({
                status: "success",
                message : "Project Added!"
            });
        }
    });

    // Redirect to a success page or perform any other actions as needed
    // res.redirect('/pages/boards');
});

module.exports = router;