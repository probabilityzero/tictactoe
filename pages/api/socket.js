import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket_io',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  const players = [];

  io.on('connection', (socket) => {
    console.log('New socket connected');

    socket.on('joinQueue', () => {
      console.log('Player joining queue');
      players.push(socket);

      if (players.length >= 2) {
        const player1 = players.shift();
        const player2 = players.shift();

        player1.emit('opponentFound', 'Player 2');
        player2.emit('opponentFound', 'Player 1');

        player1.on('makeMove', (newBoard) => {
          player2.emit('receiveMove', newBoard);
        });

        player2.on('makeMove', (newBoard) => {
          player1.emit('receiveMove', newBoard);
        });

        player1.on('leaveGame', () => {
          player2.emit('gameEnded');
        });

        player2.on('leaveGame', () => {
          player1.emit('gameEnded');
        });
      }
    });

    socket.on('leaveQueue', () => {
      const index = players.indexOf(socket);
      if (index > -1) {
        players.splice(index, 1);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      const index = players.indexOf(socket);
      if (index > -1) {
        players.splice(index, 1);
      }
    });
  });

  res.end();
};

export default SocketHandler;
