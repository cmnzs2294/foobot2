import * as THREE from "three"
import { useRef, useCallback, useState, useEffect } from "react"
import { Edges, Text } from "@react-three/drei"

 

// Sides of Cube
const faceDirection = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];

export const Cubes = ({ socket }) => {
    const [hover, setHover] = useState(null);
    const [cubes, setCubes] = useState([]);
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    /// Listen for updates from the server
  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);

        if (message.action === 'addCube') {
          const newCube = new THREE.Mesh(new THREE.BoxGeometry, new THREE.MeshStandardMaterial({ color: 'white' }));
          newCube.position.copy(message.position);
          setCubes((prevCubes) => [...prevCubes, { mesh: newCube }]);
        }
        // Handle other actions as needed
      });
    }
  }, [socket]);

  return (
    // ...
  );
};
  


export const Cubes = () => {

    const [hover, setHover] = useState(null)
    const [cubes, setCubes] = useState([]);
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    //keep track of players + block count
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [playerBlockCount, setPlayerBlockCount] = useState(0);
    const [playerNames] = useState(['Player 1', 'Player 2']);

    const playerTurnText = `Current Turn: ${playerNames[currentPlayer - 1]}`;

    // event listeners
    const handleKeyDown = (e) => {
        if (e.key === 'Shift') {
            setIsShiftPressed(true);
        }
    };
    const handleKeyUp = (e) => {
        if (e.key === 'Shift') {
            setIsShiftPressed(false);
        }
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup 
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    // When pointer moves
    const onMove = useCallback((e, index) => {
        e.stopPropagation()

        if (isShiftPressed) return;

        let faceIndex = Math.floor(e.faceIndex / 2);

        if (faceIndex > 0.5) {
            //add block onto exisitng block
            const offset = faceDirection[faceIndex]
            let pos = cubes[index].mesh.position.clone().add(new THREE.Vector3(...offset))
            pos = pos.floor().addScalar(0.5)
            setHover(pos)
        } else {
            //add block to floor
            let pos = e.point.clone().add(new THREE.Vector3(0, 0.5, 0));
            pos = pos.floor().addScalar(0.5);
            setHover(pos);
        }
    }, [hover, cubes, isShiftPressed])


    // remove cube on click
    const removeCube = useCallback((e, index) => {

        if (currentPlayer == 2) {
            console.log("Player 2 cannot remove blocks")
            return;
        }

        if (isShiftPressed) {

            if (playerBlockCount <= 2) {
                setCubes((prevCubes) => {
                    const updatedCubes = [...prevCubes];

                    updatedCubes.splice(index, 1);
                    return updatedCubes;
                });

                setPlayerBlockCount((prevCount) => prevCount + 1);
            } else {
                togglePlayer();
            }
        }
    }, [cubes, isShiftPressed, playerBlockCount, currentPlayer])


    // When pointer is out of screen
    const onOut = useCallback(() => setHover(null), [])


    // Add cube on click
    const addCube = useCallback((e) => {
        e.stopPropagation()

        if (!hover || isShiftPressed || e.delta > 10) return;

        if (playerBlockCount <= 2) {
            const voxel = new THREE.Mesh(new THREE.BoxGeometry, new THREE.MeshStandardMaterial({ color: 'white' }));
            voxel.position.copy(hover)

            // Create a message object with cube placement info
    const message = {
        action: 'addCube',     // A string to describe the action
        position: voxel.position, // The cube's position
      };
  
      // Convert the message object to a JSON string
      const messageString = JSON.stringify(message);
  
      // Send the message to the server
      socket.send(messageString);

            //Add to array
            setCubes((prevCubes) => [...prevCubes, { mesh: voxel }]);
            setPlayerBlockCount((prevCount) => prevCount + 1);

        } else {
            togglePlayer();
        }
    }, [hover, cubes, isShiftPressed, playerBlockCount]);


    //player control
    const togglePlayer = () => {
        setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
        setPlayerBlockCount(0);
        console.log(currentPlayer)
    };


    return (
        <>
            {/* UI */}
            <Text position={[0, 5, 0]} fontSize={1}>
                {playerTurnText}
            </Text>

            {/* cubes */}
            {cubes.map((cube, index) => (
                <mesh
                    key={index}
                    position={cube.mesh.position}
                    onPointerMove={(e) => onMove(e, index)}
                    onPointerOut={onOut}
                    onPointerDown={(e) => removeCube(e, index)}
                >
                    {[...Array(6)].map((_, index) => (
                        <meshStandardMaterial
                            key={index}
                            attach={`material-${index}`}
                            color={cube.faceIndex === index ? "#1069C4" : "#b1dce3"}
                        />
                    ))}
                    <boxGeometry />
                    <Edges visible={true} scale={1} threshold={15} renderOrder={1000}>
                        <meshBasicMaterial transparent color="#grey" side={THREE.DoubleSide} />
                    </Edges>
                </mesh>
            ))}


            {/* hover indicator */}
            {hover && (
                //box
                <mesh position={hover} onClick={addCube}>
                    <meshBasicMaterial color="#ff0000" opacity={0.1} transparent={true} />
                    <boxGeometry />
                    <Edges />
                </mesh>
            )}


            {/* ground */}
            <gridHelper />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onPointerMove={onMove} onPointerOut={onOut} >
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#white" />
            </mesh>

        </>
    )
}