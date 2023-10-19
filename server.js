const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  // Handle new websocket connection
  console.log('New client connected');

  // Broadcast incoming messages to all connected clients
  ws.on('message', (message) => {
    // Broadcast the message to all clients (excluding the sender)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});