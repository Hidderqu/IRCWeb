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
const ircC = require("./customModules/IRCClient");
ircC.connectIRC("chat.freenode.net","6667");
//App Routing
app.get('/', function (req, res) {
    fs.readFile('./pages/index.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/channels', function (req, res) {
    fs.readFile('./pages/channel_list.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
    //FOR TEST PURPOSES - A socket should be created for each client
    let IRCsock = ircC.connectIRC("irc.freenode.net", 6667);
    ircC.sendCmd("LIST", IRCsock);
    ircC.sendCmd("QUIT", IRCsock);
    ircC.closeIRC(IRCsock);
});

app.get('/help', function (req, res) {
    fs.readFile('./pages/help.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
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
    })
});

app.get('/login', function (req, res) {
    fs.readFile('./pages/login.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
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





