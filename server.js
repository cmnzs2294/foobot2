const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const gameState = {
  currentPlayer: 1,
  cubes: [],
};


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

    // Handle client disconnection
    ws.on('close', () => {
      console.log(`Client ${ws.playerNumber} disconnected`);
      connectedClients--; // Decrement the player count when a player disconnects
      logCurrentNumberOfPlayers(); // Log the current number of connected players
    });

/*old    // Log the current number of connected players
    console.log(`Current number of players: ${connectedClients}`);
*/

    logCurrentNumberOfPlayers(); // Log the current number of connected players
    
  } else {

    // Log that a client attempted to connect when there are already two players
    console.log('Client attempted to connect, but two players are already in the game.');
    

    // Reject the connection if there are already two players
    ws.close();
  }

  // Function to log the current number of connected players
  function logCurrentNumberOfPlayers() {
    console.log(`Current number of players: ${connectedClients}`);
  }
});




server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});