const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

// Create an HTTP server using Express
const app = express();
const server = http.createServer(app);

// Create a Socket.IO instance and attach it to the server
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Log the number of clients connected
    console.log(`Number of clients connected: ${io.engine.clientsCount}`);
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });