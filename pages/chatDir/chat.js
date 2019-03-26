


//ircC.connectIRC("chatDir.freenode.net","6667");
console.log("js called");
var socket = null;
var connected = false;

function startChatting() {
    
}



function connect()
{   console.log("connected");
  //  socket = io('http://localhost:4343/node_modules/socket.io/lib/socket.js');
   // var connection = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    socket = io('http://localhost:4343');

    socket = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    console.log(socket);
    connected = true;
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

