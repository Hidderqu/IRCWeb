//Node Modules
const express = require('express');
const app = express();
let path = require('path');
const fs = require('fs');
const net = require('net');
let server = require('http').createServer(app);
let io = require('socket.io')(server);

let peers = [];
let channel = "leo2testing";


let bodyParser = require('body-parser');
let session = require('express-session');
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
const loginModule = require("./max/login.js");
const NewCHModule = require("./customModules/NewCH");

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
NewCHModule.NewCH(app);

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

app.get('/node_modules/socket.io-client/dist/socket.io.js', function (req, res) {
    fs.readFile('./node_modules/socket.io-client/dist/socket.io.js', function (err, data) {

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

app.get('/create', function (req, res) {
    fs.readFile('./pages/create.xhtml', function (err, data) {
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
    });
});



app.get('/validate', function (req, res) {
    fs.readFile('./pages/validate.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});

app.get('/logout', function (req, res) {
    let IRCsock = loginModule.sockArray[req.session.username];

    if (IRCsock){
        irC.sendCmd("QUIT", IRCsock);
        irC.closeIRC(IRCsock);
        delete loginModule.sockArray[req.session.username];

        res.send('You are now logged out. Thank you ' + req.session.username +'.');
        res.end();
    }

    else {
        //TODO: Redirect to login page
        res.send('You are not logged in.');
        res.end();
    }
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


app.get('/chat', function (req, res) {
    console.log(req.session.username + " opened the page");
    let IRCSock = loginModule.sockArray[req.session.username];
    //SocketIO Server Reconfig
    io.on('connection', function (socket)
    {
        if(IRCSock) {

           // console.log("Total number of peers "+peers.length);
            console.log("user connected is "+req.session.username);
            socket.on('chat started', function () {
               // socket.emit('joinChannel', channel,req.session.username);
                socket.emit('systemNotification','Connecting to '+channel+'...');
                irC.sendCmd("JOIN #" + channel, IRCSock);
                socket.emit('joinChannel', channel,req.session.username);


            });

            socket.on('message', function (data,sender) {
                console.log("socket on message is now called!!!");
                irC.sendCmd("PRIVMSG #" + channel + " :" + data, IRCSock);
                socket.emit('message',data,req.session.username); // send to each peer


            });

            socket.on('disconnect', function (reason) {
                console.log(reason);
                for (var i in peers)
                    if (peers[i] === socket)
                        peers.splice(i, 1); // remove this socket from peers
            });


            //IRC Socket Reconfig
            IRCSock._events.data = (data) => {

                if (data.includes(channel) === true)
                {
                    var response = data.toString().split(":");
                    console.log("response 3 is "+response[3]);
                    console.log("whole response is "+data.toString());

                    if(response[3] !=null)
                    {
                        if(data.includes(irC.getServer()) && data.includes('353') )
                        {
                           // let users = response[3].slice(response[3].lastIndexOf('6')+1,response[3].indexOf("#"));
                            users = response[2].substr(response[2].lastIndexOf('6'),response[3].indexOf("#"));
                            console.log(users);
                            //for (var i = 0; i < peers.length; i++)
                           // {
                                socket.emit('usersList',users);
                           // }

                        }
                       /* for (var i = 0; i < peers.length; i++)
                        {
                            peers[i].emit('conv', response[3]); // send to each peer
                        }*/

                    }
                    if(data.toString().includes('PRIVMSG'))
                    {
                        let conv = response[2].split(' ');

                       // for (var i = 0; i < peers.length; i++)
                       // {
                            socket.emit('conv', response[1].substr(0,response[1].indexOf('!')), response[2].substr(0,response[2].length)); // send to each peer
                       // }

                    }

                }
            };

        }
        else
        {
            socket.emit('socketUndefined','You are not yet logged in');
        }




    });

    fs.readFile('./pages/chatDir/chat.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    });
});



//STYLESHEETS
app.get('/CSS/sticky-footer', function (req, res) {
    res.sendFile(__dirname + "/pages/CSS/sticky-footer.css");
});

/* ------- Start Web-server ------- */
app.listen(8080, () => console.log('Started server on 4242'));

app.on('error', (error) => {
    console.log(error.toString());
});