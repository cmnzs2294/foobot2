const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });



let connectedClients = 0;

wss.on('connection', (ws) => {
  if (connectedClients < 2) {
    // Assign player numbers
    connectedClients++;
    ws.playerNumber = connectedClients;

    // Log that a client has connected and their assigned player number
    console.log(`Client connected with player number ${ws.playerNumber}`);
  
    // Broadcast the player number to the connected client
    ws.send(JSON.stringify({ playerNumber: ws.playerNumber }));
    
    // Handle messages, game logic, and player interactions here
    
  } else {

    // Log that a client attempted to connect when there are already two players
    console.log('Client attempted to connect, but two players are already in the game.');
    

    // Reject the connection if there are already two players
    ws.close();
  }
});



/* player counter

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
}); */

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});