
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

export type TestCaseResult = {
    input: string;
    output: string;
    expected: string;
    passed: boolean;
}

export type CodeExecutionResult = {
    finalResult: 'Accepted' | 'Wrong Answer' | 'Error' | null;
    testCaseResults: TestCaseResult[];
    stdout: string | null;
    stderr: string | null;
    error: string | null;
}

interface AppContextType {
    playerName: string;
    gameState: GameState | null;
    winner: string | null;
    hint: string | null;
    isHintLoading: boolean;
    opponentEmoji: string | null;
    roomPlayers: string[];
    isRoomAdmin: boolean;
    codeOutput: CodeExecutionResult;
    connectAndJoin: (name: string) => void;
    createRoom: (playerName: string) => void;
    joinRoom: (playerName: string, roomId: string) => void;
    emitRunCode: (code: string, lang: Language, problemTitle: string) => Promise<void>;
    emitGetHint: (code: string) => void;
    clearHint: () => void;
    sendEmoji: (emoji: string) => void;
    startBattle: (roomId: string) => void;
    leaveGame: () => void;
}

const initialCodeOutput: CodeExecutionResult = {
    finalResult: null,
    testCaseResults: [],
    stdout: null,
    stderr: null,
    error: null,
};


export const AppContext = createContext<AppContextType>({
    playerName: '',
    gameState: null,
    winner: null,
    hint: null,
    isHintLoading: false,
    opponentEmoji: null,
    roomPlayers: [],
    isRoomAdmin: false,
    codeOutput: initialCodeOutput,
    connectAndJoin: () => {},
    createRoom: () => {},
    joinRoom: () => {},
    emitRunCode: async () => {},
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
    const [codeOutput, setCodeOutput] = useState<CodeExecutionResult>(initialCodeOutput);

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
            mockSocketService.emitJoinRoom(name, roomId);
            router.push(`/room/${roomId}`);
        });
    }

    const startBattle = (roomId: string) => {
        mockSocketService.emitStartBattle(roomId);
    };
    
    const emitRunCode = async (code: string, lang: Language, problemTitle: string) => {
        if (!playerName || !gameState) return;
        
        setCodeOutput(initialCodeOutput);

        const url = process.env.NEXT_PUBLIC_CODE_EXECUTION_URL;
        if (!url) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'The code execution URL is not configured.',
            });
            setCodeOutput({ ...initialCodeOutput, error: "Code execution service is not configured." });
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, lang, problemTitle }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to execute code.');
            }

            const result: CodeExecutionResult = await response.json();
            
            setCodeOutput(result);
            
            if (result && result.testCaseResults) {
                setGameState(prevState => {
                    if (!prevState) return null;
            
                    const newPlayers = prevState.players.map(p => {
                        if (p.name === playerName) {
                            const passedCount = result.testCaseResults.filter(tc => tc.passed).length;
                            const newTestCases = p.testCases.map((tc, index) => ({
                                ...tc,
                                passed: result.testCaseResults[index]?.passed ?? null,
                            }));
                            return { ...p, score: passedCount, testCases: newTestCases };
                        }
                        return p;
                    });

                    const userPlayer = newPlayers.find(p => p.name === playerName);
                    if (result.finalResult === 'Accepted' && userPlayer) {
                        setWinner(userPlayer.name);
                    }

                    return { ...prevState, players: newPlayers };
                });
            }

        } catch (error: any) {
            console.error("Error running code:", error);
            const errorMessage = error.message || 'An unknown error occurred.';
             setCodeOutput({ ...initialCodeOutput, finalResult: 'Error', error: errorMessage });
            toast({
                variant: 'destructive',
                title: 'Code Execution Failed',
                description: errorMessage,
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
        setCodeOutput(initialCodeOutput);
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
            codeOutput,
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

    
