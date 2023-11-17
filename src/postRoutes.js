const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('./database.js'); // Import the MySQL connection
const multer = require('multer');

// Define a route to add data to the database
router.get("/", async (req, res) => {
    res.send("Welcome to Post Routes!");
});
router.get("/:id",(req,res)=>{
    const user_id = req.params.id;
    const getAllUploadedPinsQuery = "SELECT projects.*,images.url from projects LEFT JOIN images ON projects.project_id = images.project_id LEFT JOIN users ON projects.user_id = users.user_id WHERE users.user_id = ?";
    try {
        db.query(getAllUploadedPinsQuery, user_id, (err,results)=>{
            if (err) {
                console.log("Unable to fetch data. (SEPR)");
            }else{
                res.status(200).json({'status':"Fetched All Pins", "data" : results});
            }
        });
    } catch (error) {
        console.error("Something Went Wrong! " + error);
    }
    
});

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/img/posts/'); // "posts" is the folder where images will be saved
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });



module.exports = (io) =>{
    router.post("/addPost",upload.single('post'), (req,res) => {
        try {
            const dataToInsert = {
                user_id  : req.body.user_id,
                title : req.body.title,
                description : req.body.description,
            };
            // insert the image path in images projects
            const query = 'INSERT INTO projects SET ?';
            db.query(query, dataToInsert, (err, results) => {
                if (err) {
                    res.status(400).json({ message: 'Unable to Insert the data. (INPR)' });
                } else {
                    if (req.file) {
                        // insert the image path in images table
                        const data = {
                            project_id: results.insertId,
                            url: req.file.filename,
                            description: req.body.description
                        };
                        const query2 = "INSERT INTO images SET ?";
                        db.query(query2, data, (err, results_Image_table) => {
                            if (err) {
                                res.status(400).json({ message: 'Unable to Insert the data. (INIM)' });
                            } else {
                                const io_data = {
                                    url: req.file.filename,
                                    title : req.body.title,
                                    description: req.body.description,
                                    user_id : req.body.user_id,
                                    project_id : results.insertId
                                };
                                io.emit('new-post',io_data);
                                // File was uploaded successfully
                                res.redirect(`/pages/profile/${req.body.user_id}`);
                            }
                        });
                    }
                }
            });
        } catch (error) {
           
        }
    });
    return router;
} 