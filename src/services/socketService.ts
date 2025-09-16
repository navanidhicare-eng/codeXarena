
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const connect = (name: string, url: string) => {
  if (socket) {
    return socket;
  }
  
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

const joinMatchmaking = () => {
    if (!socket) return;
    socket.emit('matchmaking:join');
}

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

const emitSendEmoji = (emoji: string) => {
    if (!socket) return;
    socket.emit('battle:sendEmoji', { emoji });
}

const onHintResult = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.on('battle:hintResult', callback);
}

const onHintError = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.on('battle:hintError', callback);
}

const onEmojiReceive = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.on('battle:emojiReceive', callback);
}

const emitCreateRoom = (options: any) => {
    if (!socket) return;
    socket.emit('room:create', options);
}

const emitJoinRoom = (roomId: string) => {
    if (!socket) return;
    socket.emit('room:join', { roomId });
}

const onRoomCreated = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on('room:created', callback);
}

const onRoomUpdated = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.on('room:updated', callback);
}


const socketService = {
  connect,
  joinMatchmaking,
  onMatchFound,
  onStateUpdate,
  onGameOver,
  emitRunCode,
  emitGetHint,
  emitSendEmoji,
  onHintResult,
  onHintError,
  onEmojiReceive,
  emitCreateRoom,
  emitJoinRoom,
  onRoomCreated,
  onRoomUpdated,
};

export default socketService;
