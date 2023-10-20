import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./components/Background";
import { OrbitControls } from "@react-three/drei";
import { Cubes } from "./components/Cubes";



function App() {
  
  const [message, setMessage] = useState(null);
 //old //  const [socket, setSocket] = useState(null);
  const [gameFull, setGameFull] = useState(false); // Track if the game is full
  const socketRef = useRef(null); // Create a ref to hold the socket


  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    socketRef.current = new WebSocket('wss://foobotgame.glitch.me'); // Replace with your server URL
    const newSocket = socketRef.current;

    // Set up event listeners for the WebSocket
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Player 1 or Player 2
      if (data.playerNumber === 1 || data.playerNumber === 2) {
        console.log(`You are Player ${data.playerNumber}`);
        


      // Third person 
      } else {
        console.log("There are two players in the game already. Please try again later");
        setGameFull(true); // Set gameFull to true
        newSocket.close();
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

  
    // Clean up the socket when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  return (

    <>
      {gameFull ? ( // If the game is full, display a message
        <div className="game-full-message">
          <p>Two players are already in the game. Please try again later.</p>
        </div>
      ) : (
      <Canvas camera={{ fov: 45, position: [-10, 10, 10] }}>
        <color attach="background" args={["#white"]} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.15} />
        <Background />
        <Cubes />
      </Canvas>
   )}
   </>
 );
}

//export default App;
export {App, socketRef};