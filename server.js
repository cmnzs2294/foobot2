const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clientIdCounter = 0; // Initialize the client ID counter

wss.on('connection', (ws) => {
  // Increment the counter for each new connection to assign a unique client ID
  clientIdCounter++;

  // Assign the unique client ID to the connected client
  ws.clientId = clientIdCounter;

  // Handle new websocket connection and log the client ID
  console.log(`Client ${ws.clientId} connected`);

  // Broadcast incoming messages to all connected clients
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection and log the client ID
  ws.on('close', () => {
    console.log(`Client ${ws.clientId} disconnected`);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});




/* original 231018

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
}); */