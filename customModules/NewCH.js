const irC = require("./IRCClient");
const loginModule = require("../max/login.js");
const fs = require('fs');
const bodyParser = require("body-parser");
const express = require('express');

let IRClist = ''; //IRC Response
let page = '';

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

exports.NewCH = (app) => {
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    var session = require('express-session');
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    //app.use(express.static(path.join(__dirname, 'pages/chatDir')));
    
    app.post('/newCH', function (request, response) {

        //irC.sendCmd("LIST", IRCsock);
        var nick = (request.session.username);
        var IRCsock = loginModule.sockArray[nick];
        var CHname = request.body.CHname;
        var PW = request.body.PW;
        var DS = request.body.DS;
        //var FD = request.body.FD;
        irC.sendCmd("join #"+CHname, IRCsock);
        irC.sendCmd("chanserv REGISTER #"+CHname+" "+PW+" "+DS, IRCsock);
        irC.sendCmd("chanserv set #"+CHname+" guard on", IRCsock) //this can keep the channel setting if no one in the channel
        response.redirect('/create');

    });

    app.post('/mode', function (request, response) {
        var nick = (request.session.username);
        var IRCsock = loginModule.sockArray[nick];
        var MCHname = request.body.MCHname;
        var CHPW = request.body.CHPW;
        var TP = request.body.TP;
        var FD = request.body.FD;
        var OP = request.body.OP;
        var key = request.body.key;
        var keyPW = request.body.keyPW;
        if(CHPW)
            irC.sendCmd("join #"+MCHname+" "+CHPW, IRCsock);
        else
            irC.sendCmd("join #"+MCHname+" "+CHPW, IRCsock);
        if (TP){
            irC.sendCmd("chanserv op #"+MCHname+" "+nick, IRCsock);
            sleep(2000).then(() => {
                irC.sendCmd("topic #"+MCHname+" "+TP, IRCsock);
            });
        }
        if (OP){
            irC.sendCmd("chanserv op #"+MCHname+" "+nick, IRCsock);
            sleep(2000).then(() => {
                irC.sendCmd("mode #"+MCHname+" +o "+OP, IRCsock);
            });
        }
        if (FD) 
            irC.sendCmd("chanserv set #"+MCHname+" founder "+FD, IRCsock);
        //irC.sendCmd("chanserv REGISTER #"+CHname+" "+PW+" "+DS, IRCsock);
        if (key="yes" && keyPW){
            irC.sendCmd("chanserv set #"+MCHname+" mlock +k "+keyPW, IRCsock);
        }
        response.redirect('/create');
    });

};

//Temporary solution to send cached list as fetching takes time.

/* Table rows
#minio 7 :http://minio.io - Object storage inspired by Amazon S3 and Facebook Haystack.
<tr><td>#minio</td><td>http://minio.io - Object storage inspired by Amazon S3 and Facebook Haystack.</td></tr>
*/