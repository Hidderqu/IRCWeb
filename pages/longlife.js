var stage = 0;
function longlife(op) {
    var type = "get", xhr;
    try {
        xhr = new XMLHttpRequest();
    } catch(e) { alert("AJAX: " + e.name + ":" + e.message); return; }
    xhr.onreadystatechange = function() {
        if ( xhr.readyState == 4 ) {
            var reply = xhr.responseText;
            if ( reply != undefined && reply != null ) {
                var n = reply.indexOf("*");
                if ( n != -1 ) {
                    type = reply.substring(0, n);
                    reply = reply.substring(n + 1);
                    n = reply.indexOf("*");
                    stage = reply.substring(0, n);
                    reply = reply.substring(n + 1);
                }
                document.getElementById("show").value = reply;
            }
            if ( type == "get" )
                longlife("get");
        }
    };
    try {
       // var url = "http://www2.macs.hw.ac.uk:8080/demo/longlife";
        var url = "http://localhost:4242/chatDir";

        url += "?stage=" + stage;
        if ( op == "put" ) {
            var user = document.getElementById("user").value;
            var message = document.getElementById("message").value;
            if ( user == "" || message == "" ) {
                alert("Please supply a user name and a message");
                return;
            }
            url += "&message=" + user + ": " + message;
            document.getElementById("message").value = "";
        }
        xhr.open('GET', encodeURI(url));
        xhr.send(null);
    } catch(e) { alert("AJAX: " + e.name + ":" + e.message); }
}