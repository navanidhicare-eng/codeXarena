
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
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (isLocalhost ? 'http://localhost:3001' : window.location.origin);

        socketService.connect(socketUrl);

        socketService.on('connect', () => {
            console.log('Socket.IO connected:', socketService.socket.id);
            // On re-connect, if there's a player name from a previous state, update it.
             const currentPN = (AppContext as any)._currentValue.playerName;
            if (currentPN) {
                socketService.emitUpdatePlayerName(currentPN);
            }
        });

        socketService.onMatchFound((newGameState: GameState) => {
            console.log("Match found, updating state:", newGameState);
            setGameState(newGameState);
            router.push(`/arena/${newGameState.matchId}`);
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
            toast({
                variant: "destructive",
                title: "AI Hint Error",
                description: "Could not generate a hint at this time.",
            });
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
            // Once name is confirmed by server, process the action queue
            console.log("Player name confirmed by server. Processing action queue.");
            actionQueue.forEach(action => action());
            setActionQueue([]);
        });

        return () => {
            socketService.disconnect();
        };
    }, [router, toast, actionQueue]); 

    const performWhenConnected = (name: string, action: () => void) => {
        setPlayerName(name);
        
        if (socketService.isConnected()) {
            socketService.emitUpdatePlayerName(name);
            setActionQueue(prev => [...prev, action]);
        } else {
            // Queue the name update itself if not connected, then the action.
            console.log("Socket not connected. Queuing name update and action.");
            toast({
                title: "Connecting...",
                description: "Trying to establish connection with the server."
            });
        }
    };

    const connectAndJoin = (name: string) => {
        performWhenConnected(name, () => {
            socketService.joinMatchmaking();
            router.push('/matchmaking');
        });
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
