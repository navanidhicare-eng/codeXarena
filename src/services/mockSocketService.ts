
type Language = "javascript" | "python" | "java" | "cpp";

type StarterCode = {
    [key in Language]: string;
}

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
        starterCode: StarterCode;
    };
    status: 'waiting' | 'in-progress' | 'finished';
};

const starterCodes: StarterCode = {
    javascript: `function twoSum(nums, target) {\n  // Write your code here\n};`,
    python: `def two_sum(nums, target):\n  # Write your code here\n  pass`,
    java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n  }\n}`,
    cpp: `class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n  }\n};`
};

let onMatchFoundCallback: (gameState: Omit<GameState, 'matchId'>) => void;
let onStateUpdateCallback: (gameState: GameState) => void;
let onGameOverCallback: (data: { winner: string }) => void;
let onHintResultCallback: (data: { hint: string }) => void;
let onHintErrorCallback: (data: { error: string }) => void;
let onEmojiReceiveCallback: (data: { emoji: string }) => void;

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
            starterCode: starterCodes,
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
        // Simulate opponent activity
        simulateOpponent();
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

const emitSendEmoji = (emoji: string) => {
    console.log(`Player sent emoji: ${emoji}`);
    // In a real app, this would be sent over the socket.
    // For the mock, we'll just log it.
};

const simulateOpponent = () => {
    const opponent = mockGameState.players[1];
    
    const opponentActivityInterval = setInterval(() => {
        if (mockGameState.status !== 'in-progress') {
            clearInterval(opponentActivityInterval);
            return;
        }

        // Simulate test case pass
        const firstUnsolvedIndex = opponent.testCases.findIndex(tc => tc.passed !== true);
        if (firstUnsolvedIndex !== -1) {
            if (Math.random() > 0.7) { // 30% chance to pass a test case every interval
                 opponent.testCases[firstUnsolvedIndex].passed = true;
                 opponent.score = opponent.testCases.filter(tc => tc.passed === true).length;
                 if (onStateUpdateCallback) {
                    onStateUpdateCallback({ ...mockGameState });
                }
            }
        }

        // Simulate emoji send
        if (Math.random() > 0.9) { // 10% chance to send an emoji
            const emojis = ['👍', '😂', '🤔', '🔥', '🤯'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            if(onEmojiReceiveCallback) {
                onEmojiReceiveCallback({ emoji: randomEmoji });
            }
        }

        const allPassed = opponent.testCases.every(tc => tc.passed === true);
        if (allPassed) {
            mockGameState.status = 'finished';
            if (onGameOverCallback) {
                 onGameOverCallback({ winner: opponent.name });
            }
            clearInterval(opponentActivityInterval);
        }

    }, 4000); // Opponent action every 4 seconds
}


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

const onEmojiReceive = (callback: (data: { emoji: string }) => void) => {
    onEmojiReceiveCallback = callback;
};


const mockSocketService = {
  connect,
  joinMatchmaking,
  emitRunCode,
  emitGetHint,
  emitSendEmoji,
  onMatchFound,
  onStateUpdate,
  onGameOver,
  onHintResult,
  onHintError,
  onEmojiReceive,
};

export default mockSocketService;
