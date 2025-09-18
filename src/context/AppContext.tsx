
"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import socketService from '@/services/socketService';
import { useToast } from '@/hooks/use-toast';

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
    roomPlayers: string[];
    isRoomAdmin: boolean;
    connectAndJoin: (name: string) => void;
    createRoom: (playerName: string) => void;
    joinRoom: (playerName: string, roomId: string) => void;
    emitRunCode: (code: string) => void;
    emitGetHint: () => void;
    clearHint: () => void;
    sendEmoji: (emoji: string) => void;
    startBattle: (roomId: string) => void;
}

export const AppContext = createContext<AppContextType>({
    playerName: '',
    gameState: null,
    winner: null,
    hint: null,
    isHintLoading: false,
    opponentEmoji: null,
    roomPlayers: [],
    isRoomAdmin: false,
    connectAndJoin: () => {},
    createRoom: () => {},
    joinRoom: () => {},
    emitRunCode: () => {},
    emitGetHint: () => {},
    clearHint: () => {},
    sendEmoji: () => {},
    startBattle: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [playerName, setPlayerName] = useState<string>('');
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [opponentEmoji, setOpponentEmoji] = useState<string | null>(null);
    const [roomPlayers, setRoomPlayers] = useState<string[]>([]);
    const [isRoomAdmin, setIsRoomAdmin] = useState(false);
    const [actionQueue, setActionQueue] = useState<(() => void)[]>([]);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const socketUrl = window.location.origin;
        const socket = socketService.connect(socketUrl);

        socket.on('connect', () => {
            console.log('Socket.IO connected:', socket.id);
        });

        socketService.onMatchFound((newGameState: Omit<GameState, 'matchId'>) => {
            console.log("Match found, updating state:", newGameState);
            const fullGameState = { ...newGameState, matchId: (newGameState as any).id };
            setGameState(fullGameState);
            router.push(`/arena/${fullGameState.matchId}`);
        });

        socketService.onMatchFoundForRoom((newGameState: GameState) => {
            console.log("Room match found, updating state:", newGameState);
            setGameState(newGameState);
            setRoomPlayers([]);
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
            setIsHintLoading(false);
        });

        socketService.onEmojiReceive((data: { emoji: string }) => {
            setOpponentEmoji(data.emoji);
            setTimeout(() => setOpponentEmoji(null), 2000);
        });

        socketService.onRoomCreated(({ roomId }) => {
            console.log('Room created, navigating to:', roomId);
            setIsRoomAdmin(true);
            router.push(`/room/${roomId}`);
        });

        socketService.onRoomUpdated(({ players }) => {
            console.log('Room updated with players:', players);
            setRoomPlayers(players);
        });

        socketService.onRoomJoinFailed(({ error }) => {
            console.error('Room join failed:', error);
            toast({
                variant: 'destructive',
                title: 'Could Not Join Room',
                description: error,
            });
            router.push('/');
        });
        
        socketService.onNameUpdated(() => {
            actionQueue.forEach(action => action());
            setActionQueue([]);
        });

        return () => {
            socketService.disconnect();
        };
    }, [router, toast, actionQueue]); 

    const performWhenConnected = (name: string, action: () => void) => {
        setPlayerName(name);
        setActionQueue(prev => [...prev, action]);
        if (socketService.isConnected()) {
            socketService.emitUpdatePlayerName(name);
        } else {
             // The on('connect') listener will handle updating the name
        }
    };

    const connectAndJoin = (name: string) => {
        performWhenConnected(name, () => {
            socketService.joinMatchmaking();
        });
        router.push('/matchmaking');
    };

    const createRoom = (name: string) => {
        performWhenConnected(name, () => {
             socketService.emitCreateRoom();
        });
    }

    const joinRoom = (name: string, roomId: string) => {
        performWhenConnected(name, () => {
            socketService.emitJoinRoom(roomId);
        });
    }

    const startBattle = (roomId: string) => {
        socketService.emitStartBattle(roomId);
    };
    
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
            roomPlayers,
            isRoomAdmin,
            connectAndJoin,
            createRoom,
            joinRoom,
            emitRunCode,
            emitGetHint,
            clearHint,
            sendEmoji,
            startBattle,
        }}>
            {children}
        </AppContext.Provider>
    );
};
