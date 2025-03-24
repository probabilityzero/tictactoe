import { Box, Button, Text, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const GameBoard = ({ socket }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMove', (newBoard) => {
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      playSound('move');
    });

    return () => {
      socket.off('receiveMove');
    };
  }, [socket, currentPlayer]);

  const handleMove = (index) => {
    if (board[index] ||winner || !socket) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    socket.emit('makeMove', newBoard);
    playSound('move');

    const winningPlayer = calculateWinner(newBoard);
    if (winningPlayer) {
      setWinner(winningPlayer);
      playSound('win');
    }
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(type === 'move' ? 440 : 880, audioContext.currentTime); // A4 or A5

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
        Current Player: {currentPlayer}
      </Text>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gridGap={2}
        maxWidth="300px"
        margin="0 auto"
      >
        {board.map((value, index) => (
          <Button
            key={index}
            height="80px"
            fontSize="4xl"
            onClick={() => handleMove(index)}
            disabled={value || winner}
            bg={value === 'X' ? 'blue.200' : value === 'O' ? 'red.200' : 'gray.100'}
            color="gray.800"
            _hover={{ bg: 'gray.300' }}
          >
            {value}
          </Button>
        ))}
      </Box>
      {winner && (
        <Box mt={4} textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">
            Winner: {winner}
          </Text>
          <Button colorScheme="green" onClick={resetGame}>
            Reset Game
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GameBoard;
