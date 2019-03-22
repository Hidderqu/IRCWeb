const net = require('net');

exports.connectIRC = (host, port) => {
    //Opens TCP connection to IRC server <host> on port <port>
    console.log("Connecting to IRC server " + host + ":" + port);
    let socket = net.connect(port, host.toString(), () => {
        console.log("Connection established to IRC server");
    });

    //Triggers when data is received from the IRC server
    socket.on('data', (data) => {
        console.log(data.toString());
    });

    //Handles errors at the TCP-level
    socket.on('error', (error) => {
        console.log(error.toString());
    });

    return socket;
};

exports.closeIRC = (socket) => {
    //Closes socket when done using
    socket.end();
    console.log('Disconnected from IRC server');
};

exports.sendCmd = (cmd, socket) => {
    //Sends command <cmd> followed by CRLF
    socket.write(cmd + '\r\n', 'UTF8', () => {
        console.log('Sent ' + cmd + ' to IRC');
    });
};