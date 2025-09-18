
import { io, Socket } from 'socket.io-client';
import { toast } from '@/hooks/use-toast';

class SocketService {
  socket!: Socket;

  connect(url: string) {
    if (this.socket && this.socket.connected) {
      return;
    }
    
    this.socket = io(url, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      if (reason !== 'io client disconnect') {
         toast({
          variant: 'destructive',
          title: 'Disconnected',
          description: 'Connection to the server was lost. Please refresh.',
        });
      }
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: `Could not connect to the server. Is it running?`,
      })
    });
  }

  disconnect() {
      if (this.socket) {
          this.socket.disconnect();
      }
  }

  isConnected() {
      return this.socket && this.socket.connected;
  }

  emitUpdatePlayerName(name: string) {
      if (!this.socket) return;
      this.socket.emit('player:updateName', { playerName: name });
  }

  joinMatchmaking() {
      if (!this.socket) return;
      this.socket.emit('matchmaking:join');
  }

  emitRunCode(code: string) {
      if (!this.socket) return;
      this.socket.emit('battle:runCode', { code });
  }

  emitGetHint() {
      if (!this.socket) return;
      this.socket.emit('battle:getHint');
  }

  emitSendEmoji(emoji: string) {
      if (!this.socket) return;
      this.socket.emit('battle:sendEmoji', { emoji });
  }

  emitCreateRoom() {
      if (!this.socket) return;
      this.socket.emit('room:create');
  }

  emitJoinRoom(roomId: string) {
      if (!this.socket) return;
      this.socket.emit('room:join', { roomId });
  }

  emitStartBattle(roomId: string) {
      if (!this.socket) return;
      this.socket.emit('room:start_battle', { roomId });
  }

  // --- LISTENERS ---
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event).on(event, callback);
  }

  onNameUpdated(callback: () => void) {
      this.on('player:nameUpdated', callback);
  };

  onMatchFound(callback: (data: any) => void) {
    this.on('matchmaking:success', callback);
  };

  onMatchFoundForRoom(callback: (data: any) => void) {
    this.on('room:match_found', callback);
  }

  onStateUpdate(callback: (data: any) => void) {
    this.on('battle:stateUpdate', callback);
  };

  onGameOver(callback: (data: any) => void) {
    this.on('battle:gameOver', callback);
  }

  onHintResult(callback: (data: any) => void) {
    this.on('battle:hintResult', callback);
  }

  onHintError(callback: (data: any) => void) {
    this.on('battle:hintError', callback);
  }

  onEmojiReceive(callback: (data: any) => void) {
    this.on('battle:emojiReceive', callback);
  }

  onRoomCreated(callback: (data: any) => void) {
    this.on('room:created', callback);
  }

  onRoomUpdated(callback: (data: any) => void) {
    this.on('room:updated', callback);
  }

  onRoomJoinFailed(callback: (data: { error: string }) => void) {
    this.on('room:join_failed', callback);
  }
}

const socketService = new SocketService();
export default socketService;

    