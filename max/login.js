//var mysql = require('mysql');
const fs = require('fs');
const irC = require("../customModules/IRCClient");

//Global array to store sockets allocated to clients
//Should ultimately be moved to IRCClient.js
let socketArray = {};
exports.sockArray = socketArray;


exports.login =(app) =>{

	app.get('/create', function (req, res) {
		fs.readFile('./pages/create_account.xhtml', function (err, data) {
			res.writeHead(200, {'Content-Type':'text/html'});
			res.write(data);
			res.end();
		})
	});


	app.post('/auth', function(request, response) {
		let username = request.body.username;
		let password = request.body.password;
		if (username && password) {
			//TODO: Database Request
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
		let username = request.body.username;
		let password = request.body.password;
		let confirmpassword = request.body.confirmpassword;
		let email = request.body.email;
		if (username && password && confirmpassword && email) {
			if (password === confirmpassword){
				//connection.query('INSERT INTO user (pseudo, password) VALUES (?, ?)', [username, password], function(error, results, fields) {		
			 	request.session.loggedin = true;
				request.session.username = username;

				//Registration sequence
				socketArray[username] = irC.connectIRC("irc.freenode.net", 6667);
				irC.sendCmd("NICK " + request.session.username , socketArray[username]);
    			irC.sendCmd("USER guest tolmoon tolsun :Ronnie Reagan", socketArray[username]);

    			//Add ping management to the socket by specifying username
				irC.setPONG(socketArray[username], username);

				//Redirect to homepage
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
};

