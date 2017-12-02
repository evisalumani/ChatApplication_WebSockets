// Package: https://www.npmjs.com/package/websocket
var WebSocketServer = require('websocket').server;

var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    // what is the purpose of this?
    response.writeHead(404);
    response.end();
});

server.listen(8000, function() {
    console.log((new Date()) + ' Server is listening on port 8000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

// latest 100 messages
var history = [];
// list of currently connected clients (users)
var clients = [];


function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function printClient(clientConnection) {
    console.log(`Client: ${clientConnection.remoteAddress}; Username: ${clientConnection.username}`);
}

function sendToAllClients(message) {
    clients.forEach(function(client) {
        client.sendUTF(JSON.stringify(message));
        // client.sendBytes(message.binaryData); // in case of binary data
    });
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    // console.log(request);
    console.log((new Date()) + ' Connection accepted.');

    // keep track of connections
    var newClientIndex = clients.push(connection) - 1;

    // TODO: fix code to send back chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify({ type: 'history', data: history} ));
    }

    // when client has sent a message
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);

            try {
                var data = JSON.parse(message.utf8Data);
                data = JSON.parse(message.utf8Data);
        
                if (data.messageType === "send_username") {
                    console.log("onmessage: send_username");
                    // save username for current client
                    current_client = clients[newClientIndex];
                    current_client.username = data.message; // add username field
                } else if (data.messageType === "send_chatMessage") {
                    console.log("onmessage: send_chatMessage");
                    sendToAllClients(data);
                } else {
                    console.log("undefined message type");
                }
            } catch (e) {
                console.log('Invalid JSON: ', message.utf8Data);
                return;
            }
            
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        }
        
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        // remove client from list
        clients.splice(newClientIndex, 1);

        // TODO: notify remaining clients
    });
});