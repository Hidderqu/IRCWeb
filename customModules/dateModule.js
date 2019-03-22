//Example custom for code splitting and management.
var net = require('net');
var socket;
exports.connect = function () {
    console.log("Connecting to the free node");
    socket = net.createConnection(6667,"chat.freenode.net",() => {
        // 'connect' listener
        console.log('connected to server!');
        socket.write('NICK ALAA');
    });

    socket.on('error', function (err) {
        console.log(err);
    });

    socket.on('data', (data) => {
        console.log(data.toString());
    });
    console.log(socket);
   // return Date();
}