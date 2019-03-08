//Node modules
const express = require('express');
const app = express();
const fs = require('fs');

//Custoom modules
var dateMod = require('./customModules/dateModule')

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
    })
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
    fs.readFile('./pages/Create_account.html', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});

app.get('/login', function (req, res) {
    fs.readFile('./pages/Login.html', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});
app.listen(4242, () => console.log('Started server on 4242'));
