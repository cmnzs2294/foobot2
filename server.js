const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const gameState = {
  currentPlayer: 1, // Initial player
  cubes: [], // Array to store cube pos
};


let connectedClients = 0;

// Broadcast the game state to all connected clients
function broadcastGameState() {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(gameState));
  });
}

// Example: When a player makes a move (e.g., adds a cube), you would update the gameState and then send it to clients
function playerMakesMove() {
  // Update gameState based on the move
  // For example, if a player adds a cube, push the cube's position to gameState.cubes

  // After updating gameState, send the updated state to all clients
  broadcastGameStateGameState();
}

wss.on('connection', (ws) => {
  if (connectedClients < 2) {
    // Assign player numbers
    connectedClients++;
    ws.playerNumber = connectedClients;

    // Log that a client has connected and their assigned player number
    console.log(`Client connected with player number ${ws.playerNumber}`);
  
    // Broadcast the player number to the connected client
    ws.send(JSON.stringify({ playerNumber: ws.playerNumber }));

    // Send the initial game state to the connected client
    ws.send(JSON.stringify(gameState));
    
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