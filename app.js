//Node Modules
const express = require('express');
const app = express()
let path = require('path');
const fs = require('fs');
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let peers = [];
let user = "ALAATOUNSI";
let nickname="ALAATOUNSI91";
//let channel = "linuxac";
let channel = "leo2testing";
let IRCSock ="";

const loginModule = require()




//static path to our chat directory
app.use(express.static(path.join(__dirname, 'pages/chatDir')));

//Web server listening to client's messages on port 4343
server.listen(4343, function(){
    console.log("server listening to port 4343");
});
//Handling server errors
server.on('error', (error) => {
    console.log(error.toString());
});
//TEMP CONNECTION TO IRC - TO-BE-REMOVED
//Custom Modules
const irC = require("./customModules/IRCClient");
const chList = require("./customModules/channel_list");
//Constants
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
//chList.getList(app, IRCSock);
//chList.cachedList(app);


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
        IRCSock = irC.connectIRC("irc.freenode.net", 6667); //A socket to connect to the IRC, there should be one for each session/user

    })
});

app.listen(4242, () => console.log('Started server on 4242'));
let IRCserver = irC.getServer();


io.on('connection', function (socket) {
    peers.push(socket); // store the connection
    for (var i=0; i<peers.length; i++)
        peers[i].emit('message', irC.getConversation()); // send to each peer

    socket.on('chat started',function () {
        socket.emit('message', 'Welcome to Socket IO Chat');
        irC.sendCmd("NICK "+nickname,IRCSock);
        irC.setNickname(nickname);
        irC.sendCmd("USER "+user+" 0 *: ALAA TOUNSI",IRCSock);
        irC.sendCmd("JOIN #"+channel,IRCSock);
    });


    socket.on('message', function (data) {
        console.log("socket on message is now called!!!");
        irC.sendCmd("PRIVMSG #"+channel+" :"+data,IRCSock);
        for (var i=0; i<peers.length; i++)
            peers[i].emit('message', data); // send to each peer

    });

    socket.on('disconnect', function(reason) {
        console.log(reason);
        for (var i in peers)
            if ( peers[i] === socket )
                peers.splice(i, 1); // remove this socket from peers

    });

    IRCSock.event.data
    if(irC.getConversation() !== null)
    {
        for (var i=0; i<peers.length; i++)
            peers[i].emit('message', irC.getConversation()); // send to each peer
        console.log("get converation is not null");
    }
    else {
        console.log("get converation is null");

    }

});





