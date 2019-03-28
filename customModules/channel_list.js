const irC = require("./IRCClient");
const fs = require('fs');
const loginModule = require('../max/login');

let page = ''; //HTML Response, cached until refresh

exports.getList = (app) => {
    app.get('/channels', function (req, res) {

        //Get user's dedicated IRC socket
        let userSock = loginModule.sockArray[req.session.username];

        if (userSock) {
            //Ask list to the IRC
            irC.sendCmd("LIST", userSock);

            //Clean list and HTML buffer
            let IRClist = '';
            page = '';

            //Write beginning of HTML page to buffer
            fs.readFile('./pages/channel_list_start.xhtml', function (err, data) {
                page = data.toString();
            });

            //Reconfigure user socket to handle list parsing
            console.log("Setting up socket for list parsing");
            userSock._events.data = (data) => {
                //Build IRC list from received data
                IRClist += data;

                //Check if end of list has been reached
                if (IRClist.substr(IRClist.length - 14) === "End of /LIST\r\n"){

                    //Start parsing
                    let entries = IRClist.split('\r\n');
                    for (let i = 1; i < entries.length -2; i++){
                        let elts = entries[i].split(' ');
                        let chaname = elts[3];
                        let nbUsers = elts[4];
                        let desc = '';
                        try {
                            //Parse description to make sure nothing funny happens with html tag injection
                            desc = elts.slice(5).join(' ').substring(1).replace(/[<>]/g, '');
                        }
                        catch (e) {
                            console.log("ERROR >>> " + e);
                        }

                        //Fill HTML table if valid channel name
                        if (chaname[0] === '#'){
                            page += '\n<tr><td>'+chaname+'</td><td>'+nbUsers+'</td><td>'+desc+'</td></tr>\n';
                        }
                    }

                    //Write end of HTML page
                    fs.readFile('./pages/channel_list_end.xhtml', function (err, data) {
                        page += data;
                    });

                    //Send to browser
                    res.writeHead(200, {'Content-Type':'text/html'});
                    res.write(page);
                    res.end();

                    // Reset user socket handler to default
                    // (i.e received data printed out in the console)
                    console.log("Resetting Socket");
                    irC.resetHandler(userSock);
                    irC.setPONG(userSock, req.session.username);
                }
            };
        }

        else res.redirect('/login');

    });
};

//Temporary solution to send cached list as live-fetching takes time.
exports.cachedList = (app) => {
    app.get('/channels_cached', (req, res) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(page);
        res.end();
    });
};