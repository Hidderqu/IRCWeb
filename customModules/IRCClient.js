/*IRC Client for node.js server*/

const net = require('net');
let IRCserver = "";
let serverSet = false;

//Opens TCP connection to IRC server <host> on port <port>
function connectIRC (host, port) {
    console.log("Connecting to IRC server " + host + ":" + port);
    let socket = net.connect(port, host.toString(), () => {
        socket.setEncoding('utf8'); //Converts received data to string
        console.log("Connection established to IRC server");

    //Triggers when data is received from the IRC server
    //Default print to console
    //If you see it in the console, it hasn't been handled by anyone
    socket.on('data', (data) => {
        console.log('>>> ' + data);
        if(!serverSet && data.includes(".freenode.net"))
        {
            IRCserver = data.slice(data.indexOf(":")+1,data.indexOf(" "));
            console.log("the server is "+IRCserver);
            serverSet = true;
        }
    });

        //Handles errors at the TCP-level
        socket.on('error', (error) => {
            console.log(error.toString());
        });
    });
    return socket;
}


//Closes the socket after sending an IRC QUIT
function closeIRC (socket) {
    if(!socket){
        console.log("Cannot close connection to IRC - No socket found");
        return false;
    }
    //Closes socket when done using
    socket.end();
    console.log('Disconnected socket from IRC server');
    return true;
}

//Sends command <cmd> followed by CRLF
function sendCmd (cmd, socket) {
    if(!socket){

        console.log("Cannot send command to IRC - No socket found");
        return false;
    }
    //Sends command <cmd> followed by CRLF
    socket.write(cmd + '\r\n', 'UTF8', () => {
        console.log('Wrote <' + cmd + '> to IRC');
    });
    return true;
}

exports.getServer = () => {
    return IRCserver;
};

//Sets the PONG reply to the IRC PING with the right nick
function setPONG (socket, nick) {
    socket.on('data', (data) => {
        if (data.includes('PING')){
            let servName = data.slice(6).replace(/[\r\n]/g, '');
            sendCmd('PONG '+nick+' '+servName, socket);
        }
    });
}

//Resets the data handler to console print
function resetHandler (socket) {
    socket._events.data = (data) => {
        console.log('>>> ' + data);
    };
    console.log('Reset socket data handler to console log')
}


/* ----------- EXPORTS ----------- */
exports.connectIRC = connectIRC;
exports.closeIRC = closeIRC;
exports.resetHandler = resetHandler;
exports.sendCmd = sendCmd ;
exports.setPONG = setPONG;

