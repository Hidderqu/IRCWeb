


//ircC.connectIRC("chatDir.freenode.net","6667");
console.log("js called");
var socket = null;
var started = false;

function startChatting() {
    socket.emit('chat started');
    console.log("chat started");
    started = true;

}

function connect()
{
    console.log("connected");
  //  socket = io('http://localhost:4343/node_modules/socket.io/lib/socket.js');
   // var connection = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    socket = io('http://localhost:4343');
    socket = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    console.log(socket);
    if(!started)
    {
        startChatting();

    }
    var chatlog = document.getElementById('chatbox');
        socket.on('message', function(msg) {
            console.log("INSIDE ON");
            var user = "ALAA";
            chatlog.innerHTML += "\n" +user +" > "+ msg;
            chatlog.scrollTop = chatlog.scrollHeight;
    });
}
function post()
{

    // var user = document.getElementById('nickname').value;
    var message = document.getElementById('message').value;
    document.getElementById('message').value = "";
    socket.emit('message', message);
}

