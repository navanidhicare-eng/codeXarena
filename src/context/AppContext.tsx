"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import mockSocketService from '@/services/mockSocketService';

// Define types for the state
type PlayerState = {
    name: string;
    score: number;
    testCases: { name: string; passed: boolean | null }[];
};

type ProblemState = {
    title: string;
    description: string;
    starterCode: string;
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
    connectAndJoin: (name: string) => void;
    emitRunCode: (code: string) => void;
    emitGetHint: () => void;
    clearHint: () => void;
}

export const AppContext = createContext<AppContextType>({
    playerName: '',
    gameState: null,
    winner: null,
    hint: null,
    isHintLoading: false,
    connectAndJoin: () => {},
    emitRunCode: () => {},
    emitGetHint: () => {},
    clearHint: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [playerName, setPlayerName] = useState<string>('');
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const router = useRouter();

    const connectAndJoin = (name: string) => {
        setPlayerName(name);
        mockSocketService.connect(name);
        mockSocketService.joinMatchmaking();
    };
    
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

    useEffect(() => {
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

    }, [router]);

    return (
        <AppContext.Provider value={{ 
            playerName, 
            gameState, 
            winner,
            hint,
            isHintLoading,
            connectAndJoin,
            emitRunCode,
            emitGetHint,
            clearHint,
        }}>
            {children}
        </AppContext.Provider>
    );
};
