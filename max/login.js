var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var irC = require("../customModules/IRCClient")
var path = require('path');

/*
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'chat'
});
*/

exports.login =(app) =>{

/*	app.get('/', function(request, response) {
		response.sendFile(path.join(__dirname + '../pages/chatDir/login.html'));
	});*/

	app.get('/create', function (req, res) {
    fs.readFile('./pages/create_account.xhtml', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
});
	app.post('/auth', function(request, response) {
		var username = request.body.username;
		var password = request.body.password;
		if (username && password) {
			connection.query('SELECT * FROM user WHERE pseudo = ? AND password = ?', [username, password], function(error, results, fields) {
				if (results.length > 0) {
					request.session.loggedin = true;
					request.session.username = username;
					
					response.redirect('/');
				} else {
					response.send('Incorrect Username and/or Password!');
				}			
				response.end();
			});
		} else {
			response.send('Please enter Username and Password!');
			response.end();
		}
	});

	app.post('/account', function(request, response) {
		var username = request.body.username;
		var password = request.body.password;
		var confirmpassword = request.body.confirmpassword;
		var email = request.body.email;
		if (username && password && confirmpassword && email) {
			if (password == confirmpassword){
				//connection.query('INSERT INTO user (pseudo, password) VALUES (?, ?)', [username, password], function(error, results, fields) {		
			 	request.session.loggedin = true;
				request.session.username = username;
				//Registration sequence
    			request.session.socket = irC.connectIRC("irc.freenode.net", 6667);
				irC.sendCmd("NICK " + request.session.username , request.session.socket);
    			irC.sendCmd("USER guest tolmoon tolsun :Ronnie Reagan", request.session.socket);
				response.redirect('/');
				}
			else {
				response.send('The two passwords are not the same');
			}
			response.end();
			}
		else {
			response.send('Please enter all the detail to register');
			console.log(username, password, confirmpassword, email);
		}
		response.end();
	});

	app.get('/home', function(request, response) {
		if (request.session.loggedin) {
			response.send('Welcome back, ' + request.session.username + '!');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});
}

