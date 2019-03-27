const irC = require("./IRCClient");
const fs = require('fs');

let IRClist = ''; //IRC Response
let page = '';

exports.getList = (app) => {
    app.get('/channels', function (req, res) {

        irC.sendCmd("LIST", req.session.socket);

        fs.readFile('./pages/channel_list_start.xhtml', function (err, data) {
            page = data.toString();
        });

        //Reconfigure socket to handle list of channels
        req.session.socket._events.data = (data) => {
            //console.log("LISTER >>> " + data);
            IRClist += data;
            //console.log ("LAST 14: " + page.substr(page.length - 14));
            //console.log (page.substr(page.length - 14) === "End of /LIST\r\n");
            if (IRClist.substr(IRClist.length - 14) === "End of /LIST\r\n"){
                //console.log("Reached end of list");

                //Start parsing
                let entries = IRClist.split('\r\n');
                console.log(entries);

                for (let i = 1; i < entries.length -2; i++){
                    let elts = entries[i].split(' ');
                    let chaname = elts[3];
                    let desc = '';
                    try {
                        desc = elts.slice(5).join(' ').substring(1);
                    }
                    catch (e) {
                        console.log("ERROR >>> " + e);
                    }
                    //Fill table
                    page += '\n<tr><td>'+chaname+'</td><td>'+desc+'</td></tr>\n';
                    //console.log(chaname + ' ' +  desc);
                }

                //Write end of xhtml
                fs.readFile('./pages/channel_list_end.xhtml', function (err, data) {
                    page += data;
                });

                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(page);
                res.end();
            }
        };
    });
};

//Temporary solution to send cached list as fetching takes time.
exports.cachedList = (app) => {
    app.get('/channels_cached', (req, res) => {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(page);
        res.end();
    });
};