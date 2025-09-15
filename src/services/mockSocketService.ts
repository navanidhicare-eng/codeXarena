
type GameState = {
    matchId: string;
    players: {
        name: string;
        score: number;
        testCases: { name: string; passed: boolean | null }[];
    }[];
    problem: {
        title: string;
        description: string;
        starterCode: string;
    };
    status: 'waiting' | 'in-progress' | 'finished';
};

let onMatchFoundCallback: (gameState: Omit<GameState, 'matchId'>) => void;
let onStateUpdateCallback: (gameState: GameState) => void;
let onGameOverCallback: (data: { winner: string }) => void;
let onHintResultCallback: (data: { hint: string }) => void;
let onHintErrorCallback: (data: { error: string }) => void;

let mockGameState: GameState;

const connect = (playerName: string) => {
    console.log(`Mock socket connected for player: ${playerName}`);
    // Reset state on new connection
    mockGameState = {
        matchId: '', // This will be set on the client
        status: 'waiting',
        problem: {
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            starterCode: `function twoSum(nums, target) {\n  // Write your code here\n};`
        },
        players: [
            {
                name: playerName,
                score: 0,
                testCases: [
                    { name: 'Test Case 1', passed: null },
                    { name: 'Test Case 2', passed: null },
                    { name: 'Test Case 3', passed: null },
                    { name: 'Test Case 4', passed: null },
                ]
            },
            {
                name: 'Opponent',
                score: 0,
                testCases: [
                    { name: 'Test Case 1', passed: null },
                    { name: 'Test Case 2', passed: null },
                    { name: 'Test Case 3', passed: null },
                    { name: 'Test Case 4', passed: null },
                ]
            }
        ],
    };
};

const joinMatchmaking = () => {
    console.log('Player joined matchmaking. Simulating delay...');
    setTimeout(() => {
        mockGameState.status = 'in-progress';
        if (onMatchFoundCallback) {
            console.log('Simulating match found. Firing callback.');
            const { matchId, ...rest } = mockGameState;
            onMatchFoundCallback(rest);
        }
    }, 2000);
};

const emitRunCode = (code: string) => {
    console.log(`Received code to run: ${code}`);
    setTimeout(() => {
        const player1 = mockGameState.players[0];
        const firstUnsolvedIndex = player1.testCases.findIndex(tc => tc.passed !== true);
        
        if (firstUnsolvedIndex !== -1) {
            player1.testCases[firstUnsolvedIndex].passed = Math.random() > 0.3; // 70% chance to pass
            player1.score = player1.testCases.filter(tc => tc.passed === true).length;
        }
        
        if (onStateUpdateCallback) {
            console.log('Simulating state update after code run.');
            onStateUpdateCallback({ ...mockGameState });
        }

        const allPassed = player1.testCases.every(tc => tc.passed === true);
        if (allPassed && onGameOverCallback) {
            mockGameState.status = 'finished';
            console.log('Simulating game over.');
            onGameOverCallback({ winner: player1.name });
        }
    }, 1000);
};

const emitGetHint = () => {
    console.log('Hint requested. Simulating delay...');
    setTimeout(() => {
        if (onHintResultCallback) {
            onHintResultCallback({ hint: 'This is a mock hint. Try using a hash map for O(n) complexity.' });
        }
    }, 1500);
};


const onMatchFound = (callback: (gameState: Omit<GameState, 'matchId'>) => void) => {
    onMatchFoundCallback = callback;
};

const onStateUpdate = (callback: (gameState: GameState) => void) => {
    onStateUpdateCallback = callback;
};

const onGameOver = (callback: (data: { winner: string }) => void) => {
    onGameOverCallback = callback;
};

const onHintResult = (callback: (data: { hint: string }) => void) => {
    onHintResultCallback = callback;
};

const onHintError = (callback: (data: { error: string }) => void) => {
    onHintErrorCallback = callback;
};


const mockSocketService = {
  connect,
  joinMatchmaking,
  emitRunCode,
  emitGetHint,
  onMatchFound,
  onStateUpdate,
  onGameOver,
  onHintResult,
  onHintError,
};

export default mockSocketService;
