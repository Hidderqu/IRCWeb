var dateMod = require('../customModules/dateModule');
dateMod.connect();
console.log("js called");
function sendMsg()
{
    alert("Hi");
    var msg = document.getElementById('message');
    console.log(msg);
    socket.write(msg);
    document.getElementById('chatbox').value += "\n" + msg;
}
