
"use client";

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

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
    socket: Socket | null;
    isConnected: boolean;
    gameState: GameState | null;
    hint: string | null;
    isHintLoading: boolean;
    connect: (name: string) => void;
    joinMatchmaking: () => void;
    emitRunCode: (code: string) => void;
    emitGetHint: () => void;
    clearHint: () => void;
}

export const AppContext = createContext<AppContextType>({
    playerName: '',
    socket: null,
    isConnected: false,
    gameState: null,
    hint: null,
    isHintLoading: false,
    connect: () => {},
    joinMatchmaking: () => {},
    emitRunCode: () => {},
    emitGetHint: () => {},
    clearHint: () => {},
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [playerName, setPlayerName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);

    const onConnect = useCallback(() => {
        console.log('Socket connected!');
        setIsConnected(true);
    }, []);

    const onDisconnect = useCallback(() => {
        console.log('Socket disconnected!');
        setIsConnected(false);
    }, []);

    const onMatchFound = useCallback((data: { matchId: string }) => {
        console.log('Match found!', data);
        // The page will handle the redirect based on gameState update
    }, []);
    
    const onStateUpdate = useCallback((newState: GameState) => {
        console.log('Received state update:', newState);
        setGameState(newState);
    }, []);

    const onHintResult = useCallback((data: { hint: string }) => {
        console.log('Received hint:', data.hint);
        setHint(data.hint);
        setIsHintLoading(false);
    }, []);
    
    const onHintError = useCallback((data: { error: string }) => {
        console.error('Hint error:', data.error);
        // In a real app, show a toast notification
        setIsHintLoading(false);
    }, []);

    const onGameOver = useCallback((data: { winner: string }) => {
        console.log('Game over! Winner:', data.winner);
        // Handle game over logic, e.g., show a modal
    }, []);

    const connect = useCallback((name: string) => {
        if (socket) return;

        setPlayerName(name);
        const newSocket = io(SOCKET_URL, {
            query: { playerName: name },
            transports: ['websocket'] 
        });

        newSocket.on('connect', onConnect);
        newSocket.on('disconnect', onDisconnect);
        newSocket.on('matchmaking:success', onMatchFound);
        newSocket.on('battle:stateUpdate', onStateUpdate);
        newSocket.on('battle:hintResult', onHintResult);
        newSocket.on('battle:hintError', onHintError);
        newSocket.on('battle:gameOver', onGameOver);
        
        setSocket(newSocket);
    }, [socket, onConnect, onDisconnect, onMatchFound, onStateUpdate, onHintResult, onHintError, onGameOver]);

    const joinMatchmaking = useCallback(() => {
        socket?.emit('matchmaking:join');
    }, [socket]);

    const emitRunCode = useCallback((code: string) => {
        socket?.emit('battle:runCode', { code });
    }, [socket]);

    const emitGetHint = useCallback(() => {
        setIsHintLoading(true);
        socket?.emit('battle:getHint');
    }, [socket]);

    const clearHint = useCallback(() => {
        setHint(null);
    }, []);

    useEffect(() => {
        return () => {
            socket?.disconnect();
        };
    }, [socket]);
    
    return (
        <AppContext.Provider value={{ 
            playerName, 
            socket, 
            isConnected, 
            gameState, 
            hint,
            isHintLoading,
            connect, 
            joinMatchmaking,
            emitRunCode,
            emitGetHint,
            clearHint,
        }}>
            {children}
        </AppContext.Provider>
    );
};
