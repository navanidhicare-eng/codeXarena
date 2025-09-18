/**
 * @fileOverview Service for managing private rooms in CodeXarena.
 */
import type { Socket, Server } from 'socket.io';
import { createInitialGameState } from './game-state';
import { battleService } from './battle-service';
import type { GameState } from './types';

// In-memory store for rooms
const rooms: { [roomId: string]: { players: { socketId: string, name: string }[], gameState?: GameState } } = {};

class RoomService {
    /**
     * Creates a new private room for a player.
     * @param socket The creator's socket.
     * @param playerName The creator's name.
     */
    createRoom(socket: Socket, playerName: string) {
        const roomId = `room-${Math.random().toString(36).substr(2, 6)}`;
        rooms[roomId] = { players: [{ socketId: socket.id, name: playerName }] };
        socket.join(roomId);
        console.log(`Player ${playerName} (${socket.id}) created and joined room ${roomId}`);
        
        socket.emit('room:created', { roomId });
        this.emitRoomUpdate(socket.server, roomId);
    }

    /**
     * Allows a player to join an existing room.
     * @param socket The joining player's socket.
     * @param roomId The ID of the room to join.
     * @param playerName The joining player's name.
     */
    joinRoom(socket: Socket, roomId: string, playerName: string) {
        const room = rooms[roomId];
        if (!room) {
            socket.emit('room:join_failed', { error: 'Room not found.' });
            return;
        }
        if (room.players.length >= 2) {
            socket.emit('room:join_failed', { error: 'Room is full.' });
            return;
        }
        if (room.players.some(p => p.socketId === socket.id)) {
            console.log(`Player ${playerName} is already in room ${roomId}.`);
            socket.join(roomId); // Re-join on reconnect
            return;
        }

        room.players.push({ socketId: socket.id, name: playerName });
        socket.join(roomId);
        console.log(`Player ${playerName} (${socket.id}) joined room ${roomId}`);
        
        this.emitRoomUpdate(socket.server, roomId);
    }
    
    /**
     * Starts the battle for all players in a room.
     * @param io The socket.io server instance.
     * @param roomId The room where the battle is starting.
     */
    startBattle(io: Server, roomId: string) {
        const room = rooms[roomId];
        if (room && room.players.length === 2) {
            console.log(`Starting battle for room ${roomId}`);
            const playerNames = room.players.map(p => p.name);
            const gameState = createInitialGameState(playerNames);
            gameState.status = 'in-progress';
            room.gameState = gameState;
            
            const playerSockets = room.players.map(p => io.sockets.sockets.get(p.socketId)).filter(s => s) as Socket[];
            battleService.addBattle(gameState.matchId, gameState, playerSockets);

            io.to(roomId).emit('room:match_found', gameState);
        }
    }

    /**
     * Emits the current state of the room to all its members.
     * @param io The socket.io server instance.
     * @param roomId The room to update.
     */
    private emitRoomUpdate(io: Server, roomId: string) {
        const room = rooms[roomId];
        if (room) {
            const playerNames = room.players.map(p => p.name);
            io.to(roomId).emit('room:updated', { players: playerNames });
        }
    }
}

export const roomService = new RoomService();
