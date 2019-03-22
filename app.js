//Node Modules
const express = require('express');
const app = express();
const fs = require('fs');

//Custom Modules
const ircC = require("./customModules/IRCClient");

let IRCsock;

//App Routing
app.get('/', function (req, res) {
    fs.readFile('./pages/index.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
    IRCsock = ircC.connectIRC("irc.freenode.net", 6667);
    ircC.sendCmd("NICK Roumata", IRCsock);
    ircC.sendCmd("USER guest tolmoon tolsun :Ronnie Reagan", IRCsock);
});

app.get('/channels', function (req, res) {
    fs.readFile('./pages/channel_list.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
    //GLOBAL SOCKET IS FOR TEST PURPOSES - A socket should be created for each user
    ircC.sendCmd("LIST", IRCsock);
});

app.get('/help', function (req, res) {
    fs.readFile('./pages/help.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
    ircC.sendCmd("QUIT", IRCsock);
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
    });
    ircC.closeIRC(IRCsock);
});

app.get('/login', function (req, res) {
    fs.readFile('./pages/login.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});
app.listen(4242, () => console.log('Started server on 4242'));
