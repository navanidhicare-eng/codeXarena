/**
 * @fileOverview Service for managing active battle state in CodeXarena.
 */
import type { Socket } from 'socket.io';
import type { GameState, Problem } from './types';
import { problems } from './game-state';

// In-memory store for active battles
const activeBattles: { [matchId: string]: { gameState: GameState, sockets: Socket[], problem: Problem } } = {};


class BattleService {
    /**
     * Adds a new battle to the active battles store.
     * @param matchId The ID of the match.
     * @param gameState The initial state of the game.
     * @param sockets The sockets of the players in the battle.
     */
    addBattle(matchId: string, gameState: GameState, sockets: Socket[]) {
        const problem = problems.find(p => p.title === gameState.problem.title);
        if (!problem) throw new Error(`Problem "${gameState.problem.title}" not found!`);

        activeBattles[matchId] = { gameState, sockets, problem };

        sockets.forEach(socket => {
            socket.join(matchId);
            // Store matchId on socket for easy lookup
            (socket as any).matchId = matchId;
        });
    }
    
    /**
     * Handles a player's request to run their code.
     * @param socket The player's socket.
     * @param code The code to run.
     */
    handleRunCode(socket: Socket, code: string) {
        const matchId = (socket as any).matchId;
        const battle = activeBattles[matchId];
        if (!battle) return;

        const playerState = battle.gameState.players.find(p => p.name === (socket as any).playerName);
        if (!playerState) return;
        
        // In a real app, this would use a secure code execution sandbox
        const results = battle.problem.solutionChecker(code, 'javascript'); // Mock language
        let score = 0;
        results.forEach((res, index) => {
            if (playerState.testCases[index]) {
                playerState.testCases[index].passed = res.passed;
                if(res.passed) score++;
            }
        });
        playerState.score = score;
        
        // Check for winner
        if (playerState.score === playerState.testCases.length) {
            battle.gameState.status = 'finished';
            const winner = playerState.name;
            socket.server.to(matchId).emit('battle:gameOver', { winner });
            delete activeBattles[matchId];
            return;
        }

        socket.server.to(matchId).emit('battle:stateUpdate', battle.gameState);
    }
    
    /**
     * Handles a player's request for an AI hint.
     * @param socket The player's socket.
     * @param getAiHint The Genkit flow to get the hint.
     */
    async handleGetHint(socket: Socket, getAiHint: Function) {
        const matchId = (socket as any).matchId;
        const battle = activeBattles[matchId];
        if (!battle) return;

        try {
            const result = await getAiHint({
                problemTitle: battle.gameState.problem.title,
                problemDescription: battle.gameState.problem.description,
                code: '', // In a real app, you'd pass the player's current code
            });
            socket.emit('battle:hintResult', { hint: result.text });
        } catch (error) {
            console.error('AI Hint Error:', error);
            socket.emit('battle:hintError', { message: 'Could not generate hint.' });
        }
    }
    
    /**
     * Relays an emoji from one player to their opponent.
     * @param socket The sender's socket.
     * @param emoji The emoji to send.
     */
    handleSendEmoji(socket: Socket, emoji: string) {
        const matchId = (socket as any).matchId;
        if (matchId) {
            socket.to(matchId).emit('battle:emojiReceive', { emoji });
        }
    }
}

export const battleService = new BattleService();
