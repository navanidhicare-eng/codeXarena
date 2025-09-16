type Language = "javascript" | "python" | "java" | "cpp";

type StarterCode = {
    [key in Language]: string;
}

type Problem = {
    title: string;
    description: string;
    starterCode: StarterCode;
    // This is a simplified solution checker for mock purposes.
    // In a real scenario, this would be a robust sandboxed code runner.
    solutionChecker: (code: string, lang: Language) => { name: string; passed: boolean }[];
};


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

// --- Problem Bank ---

const problems: Problem[] = [
    {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        starterCode: {
            javascript: `function twoSum(nums, target) {\n  // Write your code here\n};`,
            python: `def two_sum(nums, target):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n  }\n};`
        },
        solutionChecker: (code, lang) => {
             // Mock solution check. In a real app, this would execute the code safely.
            const passes = code.includes('Map') || code.includes('{');
            return [
                { name: 'Test with positive numbers', passed: passes },
                { name: 'Test with negative numbers', passed: passes },
                { name: 'Test with zero', passed: passes },
                { name: 'Test with large numbers', passed: code.includes('Map') },
            ];
        }
    },
    {
        title: 'FizzBuzz',
        description: 'Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.',
        starterCode: {
            javascript: `function fizzBuzz() {\n  // Write your code here\n};`,
            python: `def fizz_buzz():\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public void fizzBuzz() {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  void fizzBuzz() {\n    // Write your code here\n  }\n};`
        },
         solutionChecker: (code, lang) => {
            const hasFizz = code.includes('Fizz');
            const hasBuzz = code.includes('Buzz');
            const hasLoop = code.includes('for') || code.includes('while');
            return [
                { name: 'Prints Fizz for multiples of 3', passed: hasFizz && hasLoop },
                { name: 'Prints Buzz for multiples of 5', passed: hasBuzz && hasLoop },
                { name: 'Prints FizzBuzz for multiples of 15', passed: hasFizz && hasBuzz && hasLoop },
                { name: 'Handles numbers not divisible by 3 or 5', passed: hasLoop },
            ];
        }
    },
    {
        title: 'Reverse String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
        starterCode: {
            javascript: `function reverseString(s) {\n  // Write your code here\n};`,
            python: `def reverse_string(s):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public void reverseString(char[] s) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  void reverseString(vector<char>& s) {\n    // Write your code here\n  }\n};`
        },
         solutionChecker: (code, lang) => {
            const passes = code.includes('reverse') || code.includes('swap') || (code.includes('[') && code.includes(']'));
            return [
                { name: 'Test with even length string', passed: passes },
                { name: 'Test with odd length string', passed: passes },
                { name: 'Test with empty string', passed: true },
                { name: 'Test with palindrome', passed: passes },
            ];
        }
    },
     {
        title: 'Is Palindrome',
        description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
        starterCode: {
            javascript: `function isPalindrome(x) {\n  // Write your code here\n};`,
            python: `def is_palindrome(x):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public boolean isPalindrome(int x) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  bool isPalindrome(int x) {\n    // Write your code here\n  }\n};`
        },
         solutionChecker: (code, lang) => {
            const passes = code.includes('reverse') || code.toString().includes('x');
            return [
                { name: 'Test with positive palindrome', passed: passes },
                { name: 'Test with non-palindrome', passed: passes },
                { name: 'Test with single digit', passed: true },
                { name: 'Test with negative number', passed: passes },
            ];
        }
    }
];

// Store callbacks
let onMatchFoundCallback: (gameState: Omit<GameState, 'matchId'>) => void;
let onStateUpdateCallback: (gameState: GameState) => void;
let onGameOverCallback: (data: { winner: string }) => void;
let onHintResultCallback: (data: { hint: string }) => void;
let onHintErrorCallback: (data: { error: string }) => void;
let onEmojiReceiveCallback: (data: { emoji: string }) => void;
let onRoomCreatedCallback: (data: { roomId: string }) => void;
let onRoomUpdatedCallback: (data: { players: string[] }) => void;
let onRoomJoinFailedCallback: (data: { error: string }) => void;
let onRoomClosedCallback: () => void;


// In-memory store for rooms
const rooms: { [key: string]: any } = {};
let mockGameState: GameState; // Keep this for quick-match
let currentProblem: Problem;

const connect = (playerName: string) => {
    console.log(`Mock socket connected for player: ${playerName}`);
    
    // Select a problem for this session
    currentProblem = problems[Math.floor(Math.random() * problems.length)];
    const initialTestCases = currentProblem.solutionChecker('', 'javascript').map(tc => ({ name: tc.name, passed: null }));

    mockGameState = {
        matchId: '', // This will be set on the client
        status: 'waiting',
        problem: {
            title: currentProblem.title,
            description: currentProblem.description,
            starterCode: currentProblem.starterCode,
        },
        players: [
            {
                name: playerName,
                score: 0,
                testCases: JSON.parse(JSON.stringify(initialTestCases)) // Deep copy
            },
            {
                name: 'Opponent',
                score: 0,
                testCases: JSON.parse(JSON.stringify(initialTestCases)) // Deep copy
            }
        ],
    };
};

const joinMatchmaking = () => {
    console.log('Player joined quick-match matchmaking. Simulating delay...');
    setTimeout(() => {
        mockGameState.status = 'in-progress';
        if (onMatchFoundCallback) {
            console.log('Simulating match found for quick-match.');
            const { matchId, ...rest } = mockGameState;
            onMatchFoundCallback(rest);
        }
        simulateOpponent();
    }, 2000);
};

const emitCreateRoom = (options: any) => {
    console.log('emitCreateRoom called with options:', options);
    setTimeout(() => {
        if(onRoomCreatedCallback) {
            onRoomCreatedCallback({ roomId: 'AX-7B-WQ' });
        }
    }, 1000);
}

const emitJoinRoom = (roomId: string) => {
    console.log('emitJoinRoom called for room:', roomId);
     setTimeout(() => {
        mockGameState.players.push({
            name: 'BotFriend',
            score: 0,
            testCases: currentProblem.solutionChecker('', 'javascript').map(tc => ({ name: tc.name, passed: null }))
        });
        if (onStateUpdateCallback) {
            onStateUpdateCallback({ ...mockGameState });
        }
    }, 2000);
}


const emitRunCode = (code: string) => {
    console.log(`Received code to run: ${code}`);
    setTimeout(() => {
        const player1 = mockGameState.players[0];
        
        // Use the problem's specific solution checker
        const results = currentProblem.solutionChecker(code, 'javascript'); // Assuming JS for mock
        player1.testCases = results;
        player1.score = player1.testCases.filter(tc => tc.passed === true).length;
        
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
            onHintResultCallback({ hint: 'This is a mock hint. Have you considered the edge cases?' });
        }
    }, 1500);
};

const emitSendEmoji = (emoji: string) => {
    console.log(`Player sent emoji: ${emoji}`);
};

const simulateOpponent = () => {
    const opponent = mockGameState.players[1];
    
    const opponentActivityInterval = setInterval(() => {
        if (mockGameState.status !== 'in-progress') {
            clearInterval(opponentActivityInterval);
            return;
        }

        const firstUnsolvedIndex = opponent.testCases.findIndex(tc => tc.passed !== true);
        if (firstUnsolvedIndex !== -1) {
            if (Math.random() > 0.7) { 
                 opponent.testCases[firstUnsolvedIndex].passed = true;
                 opponent.score = opponent.testCases.filter(tc => tc.passed === true).length;
                 if (onStateUpdateCallback) {
                    onStateUpdateCallback({ ...mockGameState });
                }
            }
        }

        if (Math.random() > 0.9) { 
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
    }, 4000); 
}


// --- Callback setters ---
const onMatchFound = (callback: (gameState: Omit<GameState, 'matchId'>) => void) => onMatchFoundCallback = callback;
const onStateUpdate = (callback: (gameState: GameState) => void) => onStateUpdateCallback = callback;
const onGameOver = (callback: (data: { winner: string }) => void) => onGameOverCallback = callback;
const onHintResult = (callback: (data: { hint: string }) => void) => onHintResultCallback = callback;
const onHintError = (callback: (data: { error: string }) => void) => onHintErrorCallback = callback;
const onEmojiReceive = (callback: (data: { emoji: string }) => void) => onEmojiReceiveCallback = callback;
const onRoomCreated = (callback: (data: { roomId: string }) => void) => onRoomCreatedCallback = callback;
const onRoomUpdated = (callback: (data: { players: string[] }) => void) => onRoomUpdatedCallback = callback;
const onRoomJoinFailed = (callback: (data: { error: string }) => void) => onRoomJoinFailedCallback = callback;
const onRoomClosed = (callback: () => void) => onRoomClosedCallback = callback;


const mockSocketService = {
  connect,
  // Quick Match
  joinMatchmaking,
  // Custom Rooms
  emitCreateRoom,
  emitJoinRoom,
  // In-Game
  emitRunCode,
  emitGetHint,
  emitSendEmoji,
  // Listeners
  onMatchFound,
  onStateUpdate,
  onGameOver,
  onHintResult,
  onHintError,
  onEmojiReceive,
  onRoomCreated,
  onRoomUpdated,
  onRoomJoinFailed,
  onRoomClosed,
};

export default mockSocketService;
