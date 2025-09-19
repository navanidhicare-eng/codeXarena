
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
    emitRunCode: (code: string, lang: Language) => void;
    emitGetHint: (code: string) => void;
    clearHint: () => void;
    sendEmoji: (emoji: string) => void;
    startBattle: (roomId: string) => void;
    leaveGame: () => void;
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
    leaveGame: () => {},
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

    const router = useRouter();
    const { toast } = useToast();
    
    useEffect(() => {
        mockSocketService.onMatchFound((newGameState: GameState) => {
            console.log("Match found, updating state:", newGameState);
            setGameState(newGameState);
            router.push(`/arena/${newGameState.matchId}`);
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

        mockSocketService.onRoomCreated(({ roomId, players }) => {
            console.log('Room created, navigating to:', roomId, 'with players:', players);
            setPlayerName(players[0]);
            setRoomPlayers(players);
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
        // In a real scenario, you'd connect to a server here.
        // For mock, we just set the name and proceed.
        action();
    };

    const connectAndJoin = (name: string) => {
        performAction(name, () => {
            mockSocketService.joinMatchmaking(name);
        });
    };

    const createRoom = (name: string) => {
        performAction(name, () => {
             mockSocketService.emitCreateRoom({ playerName: name });
        });
    }

    const joinRoom = (name: string, roomId: string) => {
        performAction(name, () => {
            mockSocket_service.emitJoinRoom(name, roomId);
            router.push(`/room/${roomId}`);
        });
    }

    const startBattle = (roomId: string) => {
        mockSocketService.emitStartBattle(roomId);
    };
    
    const emitRunCode = async (code: string, lang: Language) => {
        if (!playerName || !gameState) return;

        const url = process.env.NEXT_PUBLIC_CODE_EXECUTION_URL;
        if (!url) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'The code execution URL is not configured.',
            });
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, lang }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to execute code.');
            }

            const result = await response.json();
            
            // This is a mock update based on the piston response.
            // In a real app, the backend would manage state and broadcast it.
            setGameState(prevState => {
                if (!prevState) return null;
                const userPlayer = prevState.players.find(p => p.name === playerName);
                if (!userPlayer) return prevState;

                const allPassed = result.run.stdout.trim() === 'All tests passed!'; // Example check
                let score = 0;
                
                const newTestCases = userPlayer.testCases.map(tc => {
                    const passed = Math.random() > 0.3; // Simulate some tests passing
                    if (passed) score++;
                    return {...tc, passed};
                });
                
                // If stdout is clean, let's assume all tests passed
                 if (result.run.code === 0 && !result.run.stderr) {
                     score = userPlayer.testCases.length;
                     newTestCases.forEach(tc => tc.passed = true);
                 }


                userPlayer.score = score;
                userPlayer.testCases = newTestCases;

                if (score === userPlayer.testCases.length) {
                    setWinner(userPlayer.name);
                }

                return { ...prevState, players: [...prevState.players] };
            });


        } catch (error: any) {
            console.error("Error running code:", error);
            toast({
                variant: 'destructive',
                title: 'Code Execution Failed',
                description: error.message || 'An unknown error occurred.',
            });
        }
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

    const leaveGame = () => {
        setGameState(null);
        setWinner(null);
        setRoomPlayers([]);
        setIsRoomAdmin(false);
        router.push('/');
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
            leaveGame,
        }}>
            {children}
        </AppContext.Provider>
    );
};
