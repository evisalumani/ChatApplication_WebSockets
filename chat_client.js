$(document).ready(function() {
    var username = window.location.href.split("username=").pop();
    var wsUri = "ws://127.0.0.1:8000";
    websocket = new WebSocket(wsUri, "echo-protocol");
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };

    var messageInput = $("#message");
    var chatHistoryDiv = $("#chatHistory");

    function onOpen(evt) { 
        console.log('Opened Connection');
        // send message to establish username
        websocket.send(JSON.stringify({"messageType": "send_username", "message": username}));
    }

    function onClose(evt) { 
        console.log('Closed Connection');
    }

    function onMessage(evt) { 
        console.log('Received Message');
        console.log(evt.data);
        try {
            var jsonData = JSON.parse(evt.data);

            var msgDateTime = new Date(jsonData.datetime);
            var datetimeStr = `${msgDateTime.toLocaleDateString('de')} ${msgDateTime.toLocaleTimeString('de')}`;
            var leftOrRightText = username == jsonData.from ? "col-md-6 col-md-offset-6" : "col-md-6";
            var labelColor = username == jsonData.from ? "label-primary" : "label-info";
            var messageSection = `
                                <div class="container">
                                <div class="row" >
                                <div class="${leftOrRightText}">
                                    <h4>${jsonData.from} <small>${datetimeStr}</small></h4>
                                    <p><span class="label ${labelColor}">${jsonData.message}</span></p>
                                </div>
                                </div>
                                </div>
                            `;
            chatHistoryDiv.append(messageSection);
        } catch (e) {
          console.log('Invalid JSON: ', evt.data);
          return;
        }
    }

    function onError(evt) { 
        console.log('Error: ' + evt);
    }

    $("#form").submit(function(event) {
        var messageToSend = messageInput.val();
        messageInput.val(""); //clear input
        websocket.send(JSON.stringify({
            "messageType": "send_chatMessage", 
            "from": username,
            "message": messageToSend,
            "datetime": new Date()
        }));
        event.preventDefault();
    });
});