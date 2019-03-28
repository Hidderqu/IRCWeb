const net = require('net');
let IRCserver = "";
let serverSet = false;
let nickname = "";
let conv = "";
exports.connectIRC = (host, port) => {
    //Opens TCP connection to IRC server <host> on port <port>
    console.log("Connecting to IRC server " + host + ":" + port);
    let socket = net.connect(port, host.toString(), () => {
        socket.setEncoding('utf8'); //Converts received data to string
        console.log("Connection established to IRC server");
    },{reconnect: true});

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
        if(data.includes("PING") === true)
        {
            console.log("PONG IS SENTBACK");
            sendCmd("PONG "+nickname+" "+IRCserver,socket);
        }
        if(data.includes("#leo2testing") ===true)
        {
            conv = data;
            console.log("RESPONSE " +conv);

        }

    });

    //Handles errors at the TCP-level
    socket.on('error', (error) => {
        console.log(error.toString());
    });

    return socket;
};

exports.closeIRC = (socket) => {
    if(!socket){
        console.log("Cannot close connection to IRC - No socket found");
        return false;
    };
    //Closes socket when done using
    socket.end();
    console.log('Disconnected socket from IRC server');
    return true;
};

function sendCmd(cmd, socket) {
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

exports.sendCmd = sendCmd;

exports.getServer = () => {
    return IRCserver;
};

exports.setNickname = (name) =>
{
    nickname = name ;
};

