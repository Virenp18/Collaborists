const dotenv = require("dotenv");
const path = require("path");
const http = require('http');
const express = require("express");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

dotenv.config();

const connection = require('./src/database');
const boardRoutes = require('./src/boardsRoutes');
const postRoutes = require('./src/postRoutes')(io);
const userRoutes = require('./src/userRoutes');
const chatRoutes = require('./src/chatRoutes')(io);
const router = require("./src/boardsRoutes");


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/api/posts', postRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

const keys = { APPSETTING_BACK_END_URL: process.env.APPSETTING_BACK_END_URL} ;

app.get('/', function(req, res) {
    res.render('pages/index', keys);
});

const pages = ['create','profile','boards','singlePost','login','edit','register','search','setPassword','resetPassword','verify','messages'];

pages.forEach(pageName => {
    app.get(`/pages/${pageName}`, function(req, res) {
      res.render(`pages/${pageName}`,keys);
    });
  });

app.get('/pages/profile/:id',async (req,res) => {
  res.render('pages/profile',keys);
});
app.get('/pages/messages/:id',async (req,res) => {
  res.render('pages/messages',keys);
});

// This app will run on port 3000 locahost:3000
const port =  3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));