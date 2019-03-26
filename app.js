//Node Modules
const express = require('express');
const app = express();
const fs = require('fs');

//Custom Modules
const irC = require("./customModules/IRCClient");
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
app.listen(4242, () => console.log('Started server on 4242'));
