# ChatApplication_WebSockets
A Chat application using WebSockets

## Setup:
- Start server: `node chat_server`
- Open `index.html` in the browser, as many times as clients are needed
- For each client, submit a username and try out chatting

## Details:
Messages sent through the web socket are of 3 types:
1. send_username: whenever a new client gets connected with the server (upon submitting a username)
2. send_chatMessage: whenever e client submits a new message
3. send_history: whenever a client gets connected with the server, and has not received previous chat history (e.g. if 2 clients have previously communicated, and a new 3rd one gets connected)  

Message Structure (Examples):
{
  "messageType": "send_username",
  "message": "testuser"
}

{
  "messageType": "send_chatMessage",
  "from": "testuser",
  "message": "test message",
  "datetime": "2017-12-03T02:08:04.740Z"
}

{
  "messageType": "send_history",
  "message": [
    {
      "messageType": "send_chatMessage",
      "from": "testuser",
      "message": "test message",
      "datetime": "2017-12-03T02:08:04.740Z"
    }
  ]
}
