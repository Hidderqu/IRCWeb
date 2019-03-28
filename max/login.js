let fs = require('fs');
let irC = require("../customModules/IRCClient");
//var mysql = require('mysql');
//var express = require('express');
//var path = require('path');

let socketArray = {};
exports.sockArray = socketArray;

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))}

exports.login = (app) => {

	/* ---------- Route Setup ---------- */
	/*app.get('/create_account', function (req, res) {
    	fs.readFile('./pages/create_account.xhtml', function (err, data) {
        	res.writeHead(200, {'Content-Type':'text/html'});
        	res.write(data);
        	res.end();
    	})
	});*/

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




	/* ---------- POST Form Management ---------- */
	app.post('/auth', function(request, response) {
		let username = request.body.username;
		let password = request.body.password;
		if (username && password) {
			request.session.loggedin = true;
			request.session.username = username;
			request.session.password = password;
			socketArray[username] = irC.connectIRC("irc.freenode.net", 6667);
			irC.sendCmd("NICK " + request.session.username, socketArray[username]);
			irC.sendCmd("USER guest tolmoon tolsun :HW Students", socketArray[username]);
			/*sleep(10000).then(() => {
			irC.sendCmd("NickServ identify "+ " " + request.session.password, socketArray[username]);
			});
			*/
			response.redirect('/');
				} else {
					response.send('Incorrect Username and/or Password!');
				}			
				response.end();
	});


	app.post('/account', function(request, response) {
		let username = request.body.username;
		let password = request.body.password;
		let confirmpassword = request.body.confirmpassword;
		let email = request.body.email;

		if (username && password && confirmpassword && email) {
			if (password === confirmpassword){
				request.session.loggedin = true;
				request.session.username = username;
				request.session.email = email;
				request.session.password = password;
				socketArray[username] = irC.connectIRC("irc.freenode.net", 6667);
				irC.sendCmd("NICK " + request.session.username , socketArray[username]);
				irC.sendCmd("USER guest tolmoon tolsun :Ronnie Reagan", socketArray[username]);
				/*sleep(10000).then(() => {
					 irC.sendCmd("NickServ register " + request.session.password + " " + request.session.email , socketArray[username]);
				 });*/
				response.redirect('/validate');
				}
			else {
				response.send('The two passwords are not the same');
			}
		}

		else {
			response.send('Please enter all the detail to register');
			console.log(username, password, confirmpassword, email);
		}

		response.end();
	});


	app.post('/validate', function(request, response) {
		var validate = request.body.validate;
		if (validate !== 0) {
			request.session.validate = validate;
			var username = request.session.username;
			socketArray[username] = irC.connectIRC("irc.freenode.net", 6667);
			sleep(10000).then(() => {
				 irC.sendCmd("NickServ VERIFY REGISTER " + request.session.username + " " + request.session.validate , socketArray[username]);
			 });
			response.redirect('/');
			}

	});
};

