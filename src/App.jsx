/* import React from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./components/Background";
import { OrbitControls } from "@react-three/drei";
import { Cubes } from "./components/Cubes";

function App() {
  return (
    <>
      <Canvas camera={{ fov: 45, position: [-10, 10, 10] }}>
        <color attach="background" args={["#white"]} />

        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.15} />

        <Background />
        <Cubes />

      </Canvas>
    </>
  );
}

export default App;

v2 below

import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./components/Background";
import { OrbitControls } from "@react-three/drei";
import { Cubes } from "./components/Cubes";

function App() {
  useEffect(() => {
    const socket = new WebSocket('wss://foobotgame.glitch.me');  // Update with your server URL

    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      // Handle messages received from the server
    });

    return () => {
      // Clean up websocket on component unmount
      socket.close();
    };
  }, []);

  return (
    <>
      <Canvas camera={{ fov: 45, position: [-10, 10, 10] }}>
        {function App() {
  return (
    <>
      <Canvas camera={{ fov: 45, position: [-10, 10, 10] }}>
        <color attach="background" args={["#white"]} />

        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.15} />

        <Background />
        <Cubes />

      </Canvas>
    </>
  );
}}
      </Canvas>
    </>
  );
}

export default App;
*/

import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./components/Background";
import { OrbitControls } from "@react-three/drei";
import { Cubes } from "./components/Cubes";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('wss://foobotgame.glitch.me'); // Replace with your server URL
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);


  return (
    <Canvas camera={{ fov: 45, position: [-10, 10, 10] }}>
      <color attach="background" args={["white"]} />
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.15} />
      <Background />
      <Cubes />
    </Canvas>
  );
}

export default App;
