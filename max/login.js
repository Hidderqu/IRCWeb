//var mysql = require('mysql');
const fs = require('fs');
const irC = require("../customModules/IRCClient");

//Global array to store sockets allocated to clients
let socketArray = {};
exports.sockArray = socketArray;


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


	/*
	app.get('/home', function(request, response) {
		if (request.session.loggedin) {
			response.send('Welcome back, ' + request.session.username + '!');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});
	*/
};

