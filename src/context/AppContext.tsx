
"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import socketService from '@/services/socketService';

type Language = "javascript" | "python" | "java" | "cpp";

type StarterCode = {
    [key in Language]: string;
}

// Define types for the state
type PlayerState = {
    name: string;
    score: number;
    testCases: { name: string; passed: boolean | null }[];
};

type ProblemState = {
    title: string;
    description: string;
    starterCode: StarterCode;
};

type GameState = {
    matchId: string;
    players: PlayerState[];
    problem: ProblemState;
    status: 'waiting' | 'in-progress' | 'finished';
};

interface AppContextType {
    playerName: string;
    gameState: GameState | null;
    winner: string | null;
    hint: string | null;
    isHintLoading: boolean;
    opponentEmoji: string | null;
    connectAndJoin: (name: string) => void;
    createRoom: (playerName: string) => void;
    joinRoom: (playerName: string, roomId: string) => void;
    emitRunCode: (code: string) => void;
    emitGetHint: () => void;
    clearHint: () => void;
    sendEmoji: (emoji: string) => void;
}

export const AppContext = createContext<AppContextType>({
    playerName: '',
    gameState: null,
    winner: null,
    hint: null,
    isHintLoading: false,
    opponentEmoji: null,
    connectAndJoin: () => {},
    createRoom: () => {},
    joinRoom: () => {},
    emitRunCode: () => {},
    emitGetHint: () => {},
    clearHint: () => {},
    sendEmoji: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [playerName, setPlayerName] = useState<string>('');
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [opponentEmoji, setOpponentEmoji] = useState<string | null>(null);
    const router = useRouter();

    const setupSocketListeners = (socket: any) => {
        socketService.onMatchFound((newGameState: Omit<GameState, 'matchId'>) => {
            console.log("Match found, updating state:", newGameState);
            // The server should provide the matchId now
            const fullGameState = { ...newGameState, matchId: (newGameState as any).id };
            setGameState(fullGameState);
            router.push(`/arena/${fullGameState.matchId}`);
        });

        socketService.onMatchFoundForRoom((newGameState: GameState) => {
            console.log("Room match found, updating state:", newGameState);
            setGameState(newGameState);
            router.push(`/arena/${newGameState.matchId}`);
        });

        socketService.onStateUpdate((updatedGameState: GameState) => {
            console.log("State updated:", updatedGameState);
            setGameState(updatedGameState);
        });

        socketService.onGameOver((gameOverState: { winner: string }) => {
            console.log("Game over:", gameOverState);
            setWinner(gameOverState.winner);
        });

        socketService.onHintResult((hintResult: { hint: string }) => {
            setHint(hintResult.hint);
            setIsHintLoading(false);
        });

        socketService.onHintError((error: { message: string }) => {
            console.error(error.message);
            // Optionally, show a toast to the user
            setIsHintLoading(false);
        });

        socketService.onEmojiReceive((data: { emoji: string }) => {
            console.log('Emoji received:', data.emoji);
            setOpponentEmoji(data.emoji);
            setTimeout(() => setOpponentEmoji(null), 2000);
        });
    }

    const connectAndJoin = (name: string) => {
        setPlayerName(name);
        const socket = socketService.connect(name, process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
        setupSocketListeners(socket);
        socketService.joinMatchmaking();
    };

    const createRoom = (playerName: string) => {
        setPlayerName(playerName);
        const socket = socketService.connect(playerName, process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
        setupSocketListeners(socket);

        socketService.onRoomCreated(({ roomId }) => {
            console.log('Room created, navigating to:', roomId);
            router.push(`/room/${roomId}`);
        });

        socketService.emitCreateRoom({ playerName });
    }

    const joinRoom = (playerName: string, roomId: string) => {
        setPlayerName(playerName);
        const socket = socketService.connect(playerName, process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
        setupSocketListeners(socket);
        socketService.emitJoinRoom(roomId);
    }
    
    const emitRunCode = (code: string) => {
        socketService.emitRunCode(code);
    };

    const emitGetHint = () => {
        setIsHintLoading(true);
        socketService.emitGetHint();
    };
    
    const clearHint = () => {
        setHint(null);
    };

    const sendEmoji = (emoji: string) => {
        socketService.emitSendEmoji(emoji);
    };


    return (
        <AppContext.Provider value={{ 
            playerName, 
            gameState, 
            winner,
            hint,
            isHintLoading,
            opponentEmoji,
            connectAndJoin,
            createRoom,
            joinRoom,
            emitRunCode,
            emitGetHint,
            clearHint,
            sendEmoji,
        }}>
            {children}
        </AppContext.Provider>
    );
};
