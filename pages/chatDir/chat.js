

let socket = null;
let started = false;
let channel_name = "Unknown";
let nick_name = "";
let chatlog = document.getElementById('chatbox');
let sendBtn = document.getElementById('sendBtn');
let welcome = document.getElementById("welcomeMSG");


function startChatting() {
    socket.emit('chat started');
    started = true;
    chatlog.disabled = true;
    sendBtn.disabled = true;


}

function connect()
{
    console.log("connected");
    socket = io('http://localhost:4343');
    socket = socket.connect("http://localhost:4343/chatDir/chat",{reconnect: true});
    console.log(socket);
    if(!started)
    {
        startChatting();

    }
        socket.on('message', function(msg) {
            console.log("INSIDE ON");
            chatlog.innerHTML += "\n" +nick_name +" > "+ msg;
            chatlog.scrollTop = chatlog.scrollHeight;
        });

        socket.on('conv', function(sender,msg) {
            console.log("INSIDE ON");
            chatlog.innerHTML += "\n" +sender +" > "+ msg;
            chatlog.scrollTop = chatlog.scrollHeight;
        });

        socket.on('systemNotification', function(msg) {
            alert("IRCWeb is trying to connect you to the channel");
            console.log(msg);
        });
        socket.on('socketUndefined', function(msg) {
           alert("Oops "+msg);
        });

        socket.on('joinChannel', function(channel,nickname) {
            chatlog.disabled = false;
            sendBtn.disabled = false;
            channel_name = channel;
            chatlog.innerHTML += "\n " +nickname+ " joined the channel ";
        });
}
function post()
{

    // var user = document.getElementById('nickname').value;
    var message = document.getElementById('message').value;
    document.getElementById('message').value = "";
    socket.emit('message', message);
}

