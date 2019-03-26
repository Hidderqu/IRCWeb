


//ircC.connectIRC("chatDir.freenode.net","6667");
console.log("js called");


var socket = null;




function connect()
{   console.log("connected");
  //  socket = io('http://localhost:4343/node_modules/socket.io/lib/socket.js');
    socket = io('http://localhost:4343');
   // var connection = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    socket = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    console.log(socket);

    var chatlog = document.getElementById('chatbox');
    socket.on('message', function(msg) {
        console.log("INSIDE ON");

        chatlog.innerHTML += "\n" + msg;
        chatlog.scrollTop = chatlog.scrollHeight;
    });
}
function post()
{

    // var user = document.getElementById('nickname').value;
    var user = "ALAA";
    var message = document.getElementById('message').value;
    document.getElementById('message').value = "";
    socket.emit('message', user + "> " + message);
}

