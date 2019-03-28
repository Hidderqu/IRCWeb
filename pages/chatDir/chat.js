
let socket = null;

let started = false;
let channel_name = "Unknown";
let nick_name = "";
let chatlog = document.getElementById('chatbox');
let sendBtn = document.getElementById('sendBtn');
let welcome = document.getElementById("welcomeMSG");
let users = document.getElementById("usersConnected");


function startChatting(socket) {
    socket.emit('chat started');
    started = true;
    chatlog.disabled = true;
    sendBtn.disabled = true;


}

function connect()
{
    console.log("connected");
    //"http://localhost:4343/chatDir/chat"
    if(!started)
    {
        socket = io.connect("http://localhost:4343");
        startChatting(socket);

    }
        socket.on('message', function(msg,sender) {
            console.log("INSIDE MESSAGE");
            chatlog.innerHTML += "\n" +sender +" > "+ msg;
            chatlog.scrollTop = chatlog.scrollHeight;
        });

        socket.on('conv', function(sender,msg) {
            console.log("INSIDE CONV");
            chatlog.innerHTML += "\n" +sender +" > "+ msg;
            chatlog.scrollTop = chatlog.scrollHeight;
        });

        socket.on('systemNotification', function(msg) {
           // alert("IRCWeb is trying to connect you to the channel");
            console.log(msg);
        });
        socket.on('socketUndefined', function(msg) {
           alert("Oops "+msg);
        });

        socket.on('joinChannel', function(channel,nickname) {
            chatlog.disabled = false;
            sendBtn.disabled = false;
            channel_name = channel;
            nick_name = nickname;
            welcome.innerHTML = "Welcome to #" + channel;
        });

        socket.on('usersList',function(usersList)
        {
            users.innerHTML = usersList;
        });
}
function post()
{

    // var user = document.getElementById('nickname').value;
    var message = document.getElementById('message').value;
    document.getElementById('message').value = "";
    socket.emit('message', message,nick_name);
}

