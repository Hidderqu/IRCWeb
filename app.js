//Node modules
const express = require('express');
const app = express();
const fs = require('fs');

//Custoom modules
var dateMod = require('./customModules/dateModule')

//App code
app.get('/', function (req, res) {
    fs.readFile('./pages/index.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});

app.listen(4242, () => console.log('Started server on 4242'));
