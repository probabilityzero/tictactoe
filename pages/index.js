import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import GameBoard from '../components/GameBoard';

let socket;

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const [opponent, setOpponent] = useState(null);

  useEffect(() => {
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('opponentFound', (opponentName) => {
      setOpponent(opponentName);
      setIsInQueue(false);
    });

    socket.on('gameEnded', () => {
      setOpponent(null);
    });
  };

  const joinQueue = () => {
    socket.emit('joinQueue');
    setIsInQueue(true);
  };

  const leaveQueue = () => {
    socket.emit('leaveQueue');
    setIsInQueue(false);
  };

  const leaveGame = () => {
    socket.emit('leaveGame');
    setOpponent(null);
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.500, blue.500)"
        backgroundClip="text"
      >
        Tic-Tac-Toe
      </Heading>

      {isConnected ? (
        <>
          {opponent ? (
            <>
              <Text>Playing against: {opponent}</Text>
              <GameBoard socket={socket} />
              <Button colorScheme="red" onClick={leaveGame}>
                Leave Game
              </Button>
            </>
          ) : (
            <>
              {isInQueue ? (
                <>
                  <Text>Waiting in queue...</Text>
                  <Button colorScheme="red" onClick={leaveQueue}>
                    Leave Queue
                  </Button>
                </>
              ) : (
                <Button colorScheme="teal" onClick={joinQueue}>
                  Join Queue
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <Text>Connecting to server...</Text>
      )}
    </Box>
  );
}
