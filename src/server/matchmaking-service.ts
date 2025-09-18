/**
 * @fileOverview In-memory matchmaking service for CodeXarena.
 * This service manages a queue of players waiting for a random match.
 */
import type { Socket } from 'socket.io';
import { createInitialGameState } from './game-state';
import { battleService } from './battle-service';

type WaitingPlayer = {
    socket: Socket;
    name: string;
};

class MatchmakingService {
    private waitingQueue: WaitingPlayer[] = [];

    /**
     * Adds a player to the matchmaking queue.
     * If there are enough players, starts a match.
     * @param socket The player's socket.
     * @param name The player's name.
     */
    addPlayer(socket: Socket, name: string) {
        // Prevent adding the same player twice
        if (this.waitingQueue.some(p => p.socket.id === socket.id)) {
            console.log(`Player ${name} (${socket.id}) is already in the queue.`);
            return;
        }

        console.log(`Player ${name} (${socket.id}) joined matchmaking.`);
        this.waitingQueue.push({ socket, name });
        this.tryToStartMatch();
    }

    /**
     * Removes a player from the matchmaking queue.
     * @param socket The player's socket to remove.
     */
    removePlayer(socket: Socket) {
        const index = this.waitingQueue.findIndex(p => p.socket.id === socket.id);
        if (index !== -1) {
            const player = this.waitingQueue[index];
            this.waitingQueue.splice(index, 1);
            console.log(`Player ${player.name} (${player.socket.id}) left matchmaking.`);
        }
    }

    /**
     * Checks if there are enough players to start a match and starts one if possible.
     */
    private tryToStartMatch() {
        if (this.waitingQueue.length < 2) {
            console.log('Not enough players to start a match. Waiting for more.');
            return;
        }

        console.log('Two players found, starting a match...');
        const player1 = this.waitingQueue.shift()!;
        const player2 = this.waitingQueue.shift()!;

        const gameState = createInitialGameState([player1.name, player2.name]);
        gameState.status = 'in-progress';
        
        battleService.addBattle(gameState.matchId, gameState, [player1.socket, player2.socket]);

        // Notify both players that a match has been found
        const matchData = { ...gameState };
        player1.socket.emit('matchmaking:success', matchData);
        player2.socket.emit('matchmaking:success', matchData);
        
        console.log(`Match ${gameState.matchId} started between ${player1.name} and ${player2.name}.`);
    }
}

export const matchmakingService = new MatchmakingService();
