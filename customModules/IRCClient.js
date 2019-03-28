/*IRC Client for node.js server*/

const net = require('net');

//Opens TCP connection to IRC server <host> on port <port>
function connectIRC (host, port) {
    console.log("Connecting to IRC server " + host + ":" + port);
    let socket = net.connect(port, host.toString(), () => {
        socket.setEncoding('utf8'); //Converts received data to string
        console.log("Connection established to IRC server");
    });

    resetHandler(socket);

    //Handles errors at the TCP-level
    socket.on('error', (error) => {
        console.log(error.toString());
    });

    return socket;
};


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
    socket.write(cmd + '\r\n', 'UTF8', () => {
        console.log('Wrote <' + cmd + '> to IRC');
    });
    return true;
}


//Sets the PONG reply to the IRC PING with the right nick
function setPONG (socket, nick) {
    socket.on('data', (data) => {
        if (data.includes('PING')){
            let servName = data.slice(6);
            sendCmd('PONG '+nick+' '+servName, socket);
        }
    });
}


//Resets the data handler to console print
function resetHandler (socket) {
    socket._events.data = (data) => {
        console.log('>>> ' + data);
    };
}


/* ----------- EXPORTS ----------- */
exports.connectIRC = connectIRC;
exports.closeIRC = closeIRC;
exports.resetHandler = resetHandler;
exports.sendCmd = sendCmd ;
exports.setPONG = setPONG;

