/**
 * @fileOverview Main socket server for CodeXarena.
 * This file initializes the socket.io server and handles all real-time communication
 * for matchmaking, room management, and battles.
 */
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import { matchmakingService } from './matchmaking-service';
import { roomService } from './room-service';
import { battleService } from './battle-service';
import { getAiHint } from '@/ai/flows/ai-hint-system';

// In-memory store for player data
const players: { [socketId: string]: { name: string; roomId?: string; matchId?: string } } = {};

export function attachSocketServer(server: any) {
  const io = new Server(server);
  console.log('Socket.IO server attached and running.');

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);
    players[socket.id] = { name: 'Anonymous' };

    // --- Player updates ---
    socket.on('player:updateName', ({ playerName }) => {
      console.log(`Player ${socket.id} updated name to ${playerName}`);
      players[socket.id].name = playerName;
      socket.emit('player:nameUpdated');
    });

    // --- Matchmaking ---
    socket.on('matchmaking:join', () => {
        matchmakingService.addPlayer(socket, players[socket.id].name);
    });

    // --- Room-based battles ---
    socket.on('room:create', () => roomService.createRoom(socket, players[socket.id].name));
    socket.on('room:join', ({ roomId }) => roomService.joinRoom(socket, roomId, players[socket.id].name));
    socket.on('room:start_battle', ({ roomId }) => roomService.startBattle(io, roomId));

    // --- In-battle actions ---
    socket.on('battle:runCode', ({ code }) => battleService.handleRunCode(socket, code));
    socket.on('battle:getHint', () => battleService.handleGetHint(socket, getAiHint));
    socket.on('battle:sendEmoji', ({ emoji }) => battleService.handleSendEmoji(socket, emoji));

    // --- Disconnection ---
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      matchmakingService.removePlayer(socket); // Remove from queue if they are in it
      // Note: Handling disconnection from a room or battle would be needed for a full implementation
      delete players[socket.id];
    });
  });

  return io;
}
