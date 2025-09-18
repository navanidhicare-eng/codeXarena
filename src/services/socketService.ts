
import { io, Socket } from 'socket.io-client';
import { toast } from '@/hooks/use-toast';

let socket: Socket;

const connect = (url: string) => {
  if (socket) {
    return socket;
  }
  
  socket = io(url, {
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket.IO connection error:', err.message);
    toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: `Could not connect to the server. Is it running?`,
    })
  });

  return socket;
};

const isConnected = () => {
    return socket && socket.connected;
}

const emitUpdatePlayerName = (name: string) => {
    if (!socket) return;
    socket.emit('player:updateName', { playerName: name });
}

// Quick Match
const joinMatchmaking = () => {
    if (!socket) return;
    socket.emit('matchmaking:join');
}

// In-Game
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

// Rooms
const emitCreateRoom = () => {
    if (!socket) return;
    socket.emit('room:create');
}

const emitJoinRoom = (roomId: string) => {
    if (!socket) return;
    socket.emit('room:join', { roomId });
}

const emitStartBattle = (roomId: string) => {
    if (!socket) return;
    socket.emit('room:start_battle', { roomId });
}


// --- LISTENERS ---

const onMatchFound = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.off('matchmaking:success').on('matchmaking:success', callback);
};

const onMatchFoundForRoom = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.off('room:match_found').on('room:match_found', callback);
}

const onStateUpdate = (callback: (data: any) => void) => {
  if (!socket) return;
  socket.off('battle:stateUpdate').on('battle:stateUpdate', callback);
};

const onGameOver = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.off('battle:gameOver').on('battle:gameOver', callback);
}

const onHintResult = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.off('battle:hintResult').on('battle:hintResult', callback);
}

const onHintError = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.off('battle:hintError').on('battle:hintError', callback);
}

const onEmojiReceive = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.off('battle:emojiReceive').on('battle:emojiReceive', callback);
}

const onRoomCreated = (callback: (data: any) => void) => {
    if (!socket) return;
    socket.off('room:created').on('room:created', callback);
}

const onRoomUpdated = (callback: (data: any) => void) => {
    if(!socket) return;
    socket.off('room:updated').on('room:updated', callback);
}

const onRoomJoinFailed = (callback: (data: { error: string }) => void) => {
    if(!socket) return;
    socket.off('room:join_failed').on('room:join_failed', callback);
}


const socketService = {
  connect,
  isConnected,
  // Emitters
  emitUpdatePlayerName,
  joinMatchmaking,
  emitRunCode,
  emitGetHint,
  emitSendEmoji,
  emitCreateRoom,
  emitJoinRoom,
  emitStartBattle,
  // Listeners
  onMatchFound,
  onMatchFoundForRoom,
  onStateUpdate,
  onGameOver,
  onHintResult,
  onHintError,
  onEmojiReceive,
  onRoomCreated,
  onRoomUpdated,
  onRoomJoinFailed,
};

export default socketService;
