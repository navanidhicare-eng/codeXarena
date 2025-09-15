"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import mockSocketService from '@/services/mockSocketService';

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
    createRoom: (options: any) => void;
    joinRoom: (roomId: string) => void;
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

    const connectAndJoin = (name: string) => {
        setPlayerName(name);
        mockSocketService.connect(name);
        mockSocketService.joinMatchmaking();
    };

    const createRoom = (options: any) => {
        setPlayerName(options.playerName);
        mockSocketService.connect(options.playerName);
        mockSocketService.emitCreateRoom(options);
    }

    const joinRoom = (roomId: string) => {
        mockSocketService.emitJoinRoom(roomId);
    }
    
    const emitRunCode = (code: string) => {
        mockSocketService.emitRunCode(code);
    };

    const emitGetHint = () => {
        setIsHintLoading(true);
        mockSocketService.emitGetHint();
    };
    
    const clearHint = () => {
        setHint(null);
    };

    const sendEmoji = (emoji: string) => {
        mockSocketService.emitSendEmoji(emoji);
    };

    useEffect(() => {
        mockSocketService.onRoomCreated(({ roomId }) => {
            console.log('Room created, navigating to:', roomId);
            router.push(`/room/${roomId}`);
        });
        
        mockSocketService.onMatchFound((newGameState: Omit<GameState, 'matchId'>) => {
            console.log("Match found, updating state:", newGameState);
            const matchId = `mock-room-${Math.random().toString(36).substring(7)}`;
            const fullGameState = { ...newGameState, matchId };
            setGameState(fullGameState);
            router.push(`/arena/${matchId}`);
        });

        mockSocketService.onStateUpdate((updatedGameState: GameState) => {
            console.log("State updated:", updatedGameState);
            setGameState(updatedGameState);
        });

        mockSocketService.onGameOver((gameOverState: { winner: string }) => {
            console.log("Game over:", gameOverState);
            setWinner(gameOverState.winner);
        });

        mockSocketService.onHintResult((hintResult: { hint: string }) => {
            setHint(hintResult.hint);
            setIsHintLoading(false);
        });

        mockSocketService.onHintError((error: { error: string }) => {
            console.error(error.error);
            setIsHintLoading(false);
        });

        mockSocketService.onEmojiReceive((data: { emoji: string }) => {
            console.log('Emoji received:', data.emoji);
            setOpponentEmoji(data.emoji);
            setTimeout(() => setOpponentEmoji(null), 2000);
        });

    }, [router]);

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
