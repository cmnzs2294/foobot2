import * as THREE from "three"
import { useRef, useCallback, useState, useEffect } from "react"
import { Edges, Text } from "@react-three/drei"
import { socketRef } from '../App.jsx'
import { WebGLUtils } from "three";


// Sides of Cube
const faceDirection = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
]

// Access the WebSocket reference
const socket = socketRef.current;

export const Cubes = () => {

    const [hover, setHover] = useState(null)
    const [cubes, setCubes] = useState([]);
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    const [gameState, setGameState] = useState(initialGameState); // Define initialGameState

    //keep track of players + block count
    const [currentPlayer, setCurrentPlayer] = useState(1); // Set player 1 as the initial player

    /*const [playerBlockCount, setPlayerBlockCount] = useState(0);*/

    const [playerNames] = useState(['Player 1', 'Player 2']);
    const [movesRemaining, setMovesRemaining] = useState(3); // Set the initial number of moves


    const playerTurnText = `Current Turn: ${playerNames[currentPlayer - 1]}`;

    // An array to store cube data
    const initialGameState = {
        cubes: [], 
      };

    //update GameState  
    const updateGameState = (newState) => {
        setGameState((prevState) => ({
          ...prevState,
          ...newState,
        }));
      };
    
     // Check if it's the current player's turn and if they have moves remaining
    const isMyTurn = () => {
        return currentPlayer === 1 && movesRemaining > 0;

      };

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
            if (movesRemaining > 0) {
              setCubes((prevCubes) => {
                const updatedCubes = [...prevCubes];
                updatedCubes.splice(index, 1);
                return updatedCubes;
              });
              setMovesRemaining((prevMovesRemaining) => prevMovesRemaining - 1);

               // Construct the message
        const message = {
            type: 'updateGameState',
            blocks: cubes, // Updated cubes array
            movesRemaining: movesRemaining - 1, // Updated moves remaining
        };

        // Send the message to the server using the WebSocket connection
        socket.send(JSON.stringify(message)); // Serialize the message as a JSON string


            
            } else {
              togglePlayer();
            }
          }
        }, [cubes, isShiftPressed, isMyTurn, movesRemaining, currentPlayer]);


    // When pointer is out of screen
    const onOut = useCallback(() => setHover(null), [])


    // Add cube on click
    const addCube = useCallback((e) => {
        
        e.stopPropagation()

        if (!hover || isShiftPressed || e.delta > 10) return;

        if (!isMyTurn()) {
            console.log("It's not your turn or you've used all your moves!");
            return;
        }    

        if (movesRemaining > 0) {
            const voxel = new THREE.Mesh(new THREE.BoxGeometry, new THREE.MeshStandardMaterial({ color: 'white' }));
            voxel.position.copy(hover)

            //Add to array
            setCubes((prevCubes) => [...prevCubes, { mesh: voxel }]);

            //Decrement movesRemaining
            setMovesRemaining((prevMovesRemaining) => prevMovesRemaining - 1);

             // Construct the message
        const message = {
            type: 'updateGameState',
            blocks: cubes, // Updated cubes array
            movesRemaining: movesRemaining - 1, // Updated moves remaining
        };

        // Send the message to the server using the WebSocket connection
        socket.send(JSON.stringify(message)); // Serialize the message as a JSON string

        } else {
            togglePlayer();
        }
    }, [hover, cubes, isShiftPressed, isMyTurn, movesRemaining])


    //player control
    const togglePlayer = () => {
        setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
        setMovesRemaining(3);
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