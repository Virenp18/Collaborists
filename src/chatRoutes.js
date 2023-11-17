const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('./database.js'); // Import the MySQL connection

// Define a route to add data to the database
router.get("/", (req, res) => {
    res.send("Welcome to Chats!");
});

router.post("/saveChatUser",(req,res)=>{
    const dataToInsert = {
        chat_user_one : req.body.fromUser,
        chat_user_two : req.body.toUser
    }
    const query = 'INSERT INTO users_chats SET ?';
    db.query(query, dataToInsert, (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err);
        } else {
            res.status(200).send({
                status: "success",
                message : "Added Chat Data",
                chat_id : results.insertId
            });
        }
    });
});
router.post("/getAllChatMessages",(req,res)=>{
    const chat_id = req.body.chat_id;
    if(chat_id){
        const query = "SELECT * FROM chat_messages WHERE chat_id = ?";    
        db.query(query, chat_id, (err,results)=>{
            if (err) {
                console.log("Unable to fetch data. (SECR)");
            }else{
                res.status(200).json({'status':"Fetched All Messages", "data" : results});
            }
        });
    }
    return 0;
});

router.post("/:id",(req,res) => {
    const other_user_id = req.params.id;
    const logged_user_id = req.body.logged_user_id;
    if(other_user_id && logged_user_id){
        // check wheather there is any chat between you and the user_id
        const query = `
                        SELECT *
                        FROM users_chats
                        WHERE (chat_user_one = ? AND chat_user_two = ?) OR (chat_user_one = ? AND chat_user_two = ?);
                        `;
        db.query(query, [other_user_id,logged_user_id,logged_user_id,other_user_id],(err,results) => {
            if(err){
                console.error('Error checking for chat:', err);
                throw err;
            }
            if(results.length > 0){
                // console.log('Chat already exists!');
                res.status(200).json({ status:'success', message: 'Chat Found!',user_chats:results });
                // You can access the chat details from results[0]
                // if chat exists than you can take out the messages out of both the users using chat_id
            }else{
                res.status(200).json({ status:'success', message: 'Chatting for the first time!',user_chats:results });    
            }
        });        
    }
});

module.exports = (io) => {
    router.post("/user/savechat", (req,res) => {
        const dataToInsert = req.body;
        const query = "INSERT INTO chat_messages SET ?";
        db.query(query, dataToInsert, (err, results) => {
            if (err) {
                console.error('Error inserting data: ' + err);
            } else {
                const io_data = req.body;
                res.status(200).send({
                    status: "success",
                    message : "Save Sent Chat"
                });
                io.emit('new-message',io_data);
            }
        });
    });
    return router;
}