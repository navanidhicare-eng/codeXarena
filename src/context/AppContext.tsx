
"use client";

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import mockSocketService from '@/services/mockSocketService';
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
    emitGetHint: (code: string) => void;
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
    const [isConnected, setIsConnected] = useState(false);

    const router = useRouter();
    const { toast } = useToast();
    
    useEffect(() => {
        mockSocketService.onMatchFound((newGameState: GameState) => {
            console.log("Match found, updating state:", newGameState);
            setGameState(newGameState);
        });
        
        mockSocketService.onMatchFoundForRoom((newGameState: GameState) => {
            console.log("Room match found, updating state:", newGameState);
            setGameState(newGameState);
            setRoomPlayers([]);
            router.push(`/arena/${newGameState.matchId}`);
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

        mockSocketService.onHintError((error: { message: string }) => {
            toast({
                variant: "destructive",
                title: "AI Hint Error",
                description: "Could not generate a hint at this time.",
            });
            console.error(error.message);
            setIsHintLoading(false);
        });

        mockSocketService.onEmojiReceive((data: { emoji: string }) => {
            setOpponentEmoji(data.emoji);
            setTimeout(() => setOpponentEmoji(null), 2000);
        });

        mockSocketService.onRoomCreated(({ roomId }) => {
            console.log('Room created, navigating to:', roomId);
            setIsRoomAdmin(true);
            router.push(`/room/${roomId}`);
        });

        mockSocketService.onRoomUpdated(({ players }) => {
            console.log('Room updated with players:', players);
            setRoomPlayers(players);
        });

        mockSocketService.onRoomJoinFailed(({ error }) => {
            console.error('Room join failed:', error);
            toast({
                variant: 'destructive',
                title: 'Could Not Join Room',
                description: error,
            });
            router.push('/');
        });
        
    }, [router, toast]); 

    const performAction = (name: string, action: () => void) => {
        setPlayerName(name);
        mockSocketService.connect(name);
        action();
    };

    const connectAndJoin = (name: string) => {
        performAction(name, () => {
            mockSocketService.joinMatchmaking();
            router.push('/matchmaking');
        });
    };

    const createRoom = (name: string) => {
        performAction(name, () => {
             mockSocketService.emitCreateRoom({ playerName: name });
        });
    }

    const joinRoom = (name: string, roomId: string) => {
        performAction(name, () => {
            mockSocketService.emitJoinRoom(roomId);
        });
    }

    const startBattle = (roomId: string) => {
        mockSocketService.emitStartBattle(roomId);
    };
    
    const emitRunCode = (code: string) => {
        mockSocketService.emitRunCode(code);
    };

    const emitGetHint = (code: string) => {
        setIsHintLoading(true);
        mockSocketService.emitGetHint(code);
    };
    
    const clearHint = () => {
        setHint(null);
    };

    const sendEmoji = (emoji: string) => {
        mockSocketService.emitSendEmoji(emoji);
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
