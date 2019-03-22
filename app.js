//Node Modules
const express = require('express');
const dateMod = require('./customModules/dateModule');
dateMod.connect();
const app = express();
const fs = require('fs');


//Custom Modules
const ircC = require("./customModules/IRCClient");
>>>>>>> 08f29278264cad84ad78b15ec70ba66e44bd4f90

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
    fs.readFile('./pages/chat.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});
app.listen(4242, () => console.log('Started server on 4242'));





