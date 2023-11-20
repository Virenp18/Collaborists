// https://bbbootstrap.com/snippets/bootstrap-notification-navbar-dropdown-80384397
const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('./database.js'); // Import the MySQL connection

// Define a route to add data to the database
router.get("/", (req, res) => {
    res.send("Welcome to Notification Routes!");
});

router.post("/addNotifications", (req,res) => {
    const dataToInsert = req.body;
    const addNotifictaion = "INSERT INTO notifications SET ?";
    db.query(addNotifictaion, dataToInsert, (err,results) => {
        if (err) {
            console.error('Error inserting data: ' + err);
        } else {
            res.status(200).send({
                status: "success",
                message : "Notification Added",
                notification_id : results.insertId
            });
        }
    });
});

router.post('/all', (req,res) => {
    const user_id = req.body.user_id;
    const notification_type = "FOLLOWER";
    const is_read = false;
    if(user_id){
        const getNotificationQuery = "SELECT notifications.*,users.profile_picture AS sender_dp FROM notifications LEFT JOIN users ON notifications.user_send = users.user_id WHERE notifications.user_id = ? AND notifications.notification_type = ? AND notifications.is_read = ?";
        db.query(getNotificationQuery , [user_id , notification_type, is_read], (err, results) => {
            if (err) {
                console.error('Error fecthing data: ' + err);
            } else {
                res.status(200).send({
                    status: "success",
                    message : "Fetched notifictions",
                    result : results
                });
            }
        }); 

    }
});

module.exports = router;