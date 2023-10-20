const dotenv = require("dotenv");
const path = require("path");
const http = require('http');
const express = require("express");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

dotenv.config();

const connection = require('./src/database');
const boardRoutes = require('./src/boardsRoutes');


io.on('connection', (socket)=>{
  console.log('A user connected');
  // Handle the database changes and send updates to the client
  const query = 'SELECT * FROM projects';
  connection.query(query, (err, results) => {
    if (err) {
        console.error('Error fetching data from the database: ' + err);
    } else {
        // Send the initial data to the client
        socket.emit('data', results);
    }
  });
  connection.on('change', () => {
    // Fetch and send the updated data to the client
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from the database: ' + err);
        } else {
            io.sockets.emit('data-change', results);
        }
    });
});
  socket.on('disconnect', () => {
    console.log('A user disconnected');
});

});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/api/boards', boardRoutes);

const keys = { APPSETTING_BACK_END_URL: process.env.APPSETTING_BACK_END_URL} ;

app.get('/', function(req, res) {
    res.render('pages/register',keys);
});

const pages = ['create','profile','boards','singlePost','login','edit','register','search','setPassword','resetPassword','verify'];

pages.forEach(pageName => {
    app.get(`/pages/${pageName}`, function(req, res) {
      res.render(`pages/${pageName}`,keys);
    });
  });

// This app will run on port 3000 locahost:3000
const port =  3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));