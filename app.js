//Node Modules
const express = require('express');
const app = express()
var path = require('path');
const fs = require('fs');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var peers = [];



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
let IRCsock = irC.connectIRC("irc.freenode.net", 6667);
const chList = require("./customModules/channel_list");

//Constants
let IRCSock = irC.connectIRC("irc.freenode.net", 6667); //A socket to connect to the IRC, there should be one for each session/user

//App Routing


app.get('/', function (req, res) {
    fs.readFile('./pages/index.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });

    //Registration sequence
    irC.sendCmd("NICK Roumata42", IRCSock);
    irC.sendCmd("USER guest tolmoon tolsun :Ronnie Reagan", IRCSock);
});

//Channel list requests handled in a separate script.
chList.getList(app, IRCSock);
chList.cachedList(app);


app.get('/help', function (req, res) {
    fs.readFile('./pages/help.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });

    //Cleanup sequence is temporarily placed on the help page
    //Should be on 'logout'
    irC.sendCmd("QUIT", IRCSock);
    irC.closeIRC(IRCSock);
});

app.get('/create', function (req, res) {
    fs.readFile('./pages/create.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});


app.get('/customModules/IRCClient.js', function (req, res) {
    fs.readFile('./customModules/IRCClient.js', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/javascript'});
        res.write(data);
        res.end();
    })
});

/*
app.get('//pages/chatDir/chatDir.js', function (req, res) {
    fs.readFile('./pages/chatDir/chatDir.js', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/javascript'});
        res.write(data);
        res.end();
    })
});*/

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


app.get('/node_modules/socket.io-client/dist/socket.io.js', function (req, res) {
    fs.readFile('./node_modules/socket.io-client/dist/socket.io.js', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});
app.listen(4242, () => console.log('Started server on 4242'));

io.on('connection', function (socket) {

    peers.push(socket); // store the connection
    socket.emit('message', 'Welcome to Socket IO Chat');

    socket.on('chat started',function () {
        irC.sendCmd("NICK ALAATOUNSI91 \r\n",IRCsock);
        irC.sendCmd("USER ALAATOUNSI 0: ALAA TOUNSI \r\n",IRCsock);
        irC.sendCmd("JOIN leotesting 1234567800 \r\n",IRCsock);
    });


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





