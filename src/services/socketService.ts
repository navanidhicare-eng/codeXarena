
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const connect = (name: string, url: string) => {
  socket = io(url, {
    query: { playerName: name },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket.IO connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO disconnected');
  });

  return socket;
};

const onMatchFound = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.on('matchmaking:success', callback);
};

const onStateUpdate = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.on('battle:stateUpdate', callback);
};

const onGameOver = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('battle:gameOver', callback);
}

const emitRunCode = (code: string) => {
    if (!socket) return;
    socket.emit('battle:runCode', { code });
}

const emitGetHint = () => {
    if (!socket) return;
    socket.emit('battle:getHint');
}

const socketService = {
  connect,
  onMatchFound,
  onStateUpdate,
  onGameOver,
  emitRunCode,
  emitGetHint,
};

export default socketService;
