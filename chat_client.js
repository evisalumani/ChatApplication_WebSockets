$(document).ready(function() {
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
    }

    function onClose(evt) { 
        console.log('Closed Connection');
    }

    function onMessage(evt) { 
        console.log('Received Message: ' + evt.data);
        chatHistoryDiv.append(`<p>${evt.data}</p>`);
    }

    function onError(evt) { 
        console.log('Error: ' + evt);
    }

    $("#form").submit(function( event ) {
        var messageToSend = messageInput.val();
        messageInput.val(""); //clear input
        websocket.send(messageToSend);
        event.preventDefault();
    });
});