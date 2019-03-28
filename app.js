//Node Modules
const express = require('express');
const app = express()
const path = require('path');
const fs = require('fs');
const net = require('net');

let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let peers = [];
let bodyParser = require('body-parser');
let session = require('express-session');
//static path to our chat directory
app.use(express.static(path.join(__dirname, 'pages/chatDir')));

//Web server listening to client's messages on port 4343
server.listen(4343, function(){
    console.log("server runs on linux01");
});
//Handling server errors
server.on('error', (error) => {
    console.log(error.toString());
});

//Custom Modules
const irC = require("./customModules/IRCClient");
const chList = require("./customModules/channel_list");
const loginModule = require("./max/login.js");

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Session
app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));


/* -------- App Routing -------- */

//PAGES
app.get('/', function (req, res) {
    fs.readFile('./pages/index.xhtml', function (err, data) {

        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
        //console.log(req.session);
    });
});

//Login page setup
loginModule.login(app);

//Channel list page setup.
chList.getList(app);
chList.cachedList(app);


app.get('/help', function (req, res) {
    fs.readFile('./pages/help.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });

    //TODO: Cleanup sequence is temporarily placed on the help page, should be on 'logout' button
    let IRCsock = loginModule.sockArray[req.session.username];
    irC.sendCmd("QUIT", IRCsock);
    irC.closeIRC(IRCsock);
    delete loginModule.sockArray[req.session.username];
});


app.get('/signup', function (req, res) {
    fs.readFile('./pages/create_account.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});


app.get('/login', function (req, res) {
    fs.readFile('./pages/login.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});


app.get('/chat', function (req, res) {
    fs.readFile('./pages/chatDir/chat.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});




//SCRIPTS
//TODO: Justify the need for a GET <script> or remove this.
app.get('/customModules/IRCClient.js', function (req, res) {
    fs.readFile('./customModules/IRCClient.js', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/javascript'});
        res.write(data);
        res.end();
    })
});

/*
//TODO: Justify the need for a GET <script> or remove this.
app.get('//pages/chatDir/chatDir.js', function (req, res) {
    fs.readFile('./pages/chatDir/chatDir.js', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/javascript'});
        res.write(data);
        res.end();
    })
});*/


//TODO: Justify the need for a GET <script> or remove this.
app.get('/node_modules/socket.io-client/dist/socket.io.js', function (req, res) {
    fs.readFile('./node_modules/socket.io-client/dist/socket.io.js', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});




//STYLESHEETS
app.get('/CSS/sticky-footer', function (req, res) {
    res.sendFile(__dirname + "/pages/CSS/sticky-footer.css");
});




/* Socket IO Setup - Should be in dedicated .js */
io.on('connection', function (socket) {
    let IRCsock = ircC.connectIRC("irc.freenode.net", 6667);

    peers.push(socket); // store the connection
    socket.emit('message', 'Welcome to Socket IO Chat');
    ircC.sendCmd("NICK ALAATOUNSI \r\n",IRCsock);
    ircC.sendCmd("USER ALAATOUNSI : ALAA TOUNSI \r\n",IRCsock);

    socket.on('message', function (data) {
        for (var i=0; i<peers.length; i++)
            peers[i].emit('message', data); // send to each peer
    });
    socket.on('disconnect', function(reason) {
        console.log(reason);
        for (var i in peers)
            if ( peers[i] === socket )
                peers.splice(i, 1); // remove this socket from peers
    });


});




/* ------- Start Web-server ------- */
app.listen(4242, () => console.log('Started server on 4242'));

