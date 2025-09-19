


type Language = "javascript" | "python" | "java" | "cpp";

type StarterCode = {
    [key in Language]: string;
}

type Problem = {
    title: string;
    description: string;
    starterCode: StarterCode;
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
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Sample Input: nums = [2, 7, 11, 15], target = 9
Sample Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
        starterCode: {
            javascript: `function twoSum(nums, target) {\n  // Write your code here\n};`,
            python: `def two_sum(nums, target):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n  }\n};`
        },
        solutionChecker: (code, lang) => {
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
        description: `Write a program that prints the numbers from 1 to 100. For multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.

Sample Input: n = 15
Sample Output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]

Constraints:
- The input is the range, typically 1 to 100.`,
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
        description: `Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.

Sample Input: s = ["h","e","l","l","o"]
Sample Output: ["o","l","l","e","h"]

Constraints:
- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
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
        description: `Given an integer x, return true if x is a palindrome, and false otherwise.

Sample Input: x = 121
Sample Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

Sample Input: x = -121
Sample Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

Constraints:
- -2^31 <= x <= 2^31 - 1`,
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
let onMatchFoundForRoomCallback: (gameState: GameState) => void;
let onStateUpdateCallback: (gameState: GameState) => void;
let onGameOverCallback: (data: { winner: string }) => void;
let onHintResultCallback: (data: { hint: string }) => void;
let onHintErrorCallback: (data: { message: string }) => void;
let onEmojiReceiveCallback: (data: { emoji: string }) => void;
let onRoomCreatedCallback: (data: { roomId: string }) => void;
let onRoomUpdatedCallback: (data: { players: string[] }) => void;
let onRoomJoinFailedCallback: (data: { error: string }) => void;

// In-memory store for rooms
const rooms: { [key: string]: { players: string[], gameState?: GameState } } = {};
let currentProblem: Problem;
let connectedPlayerName: string;

const createInitialGameState = (players: string[]) => {
    currentProblem = problems[Math.floor(Math.random() * problems.length)];
    const initialTestCases = currentProblem.solutionChecker('', 'javascript').map(tc => ({ name: tc.name, passed: null }));

    return {
        matchId: `mock-match-${Date.now()}`,
        status: 'waiting',
        problem: {
            title: currentProblem.title,
            description: currentProblem.description,
            starterCode: currentProblem.starterCode,
        },
        players: players.map(name => ({
            name,
            score: 0,
            testCases: JSON.parse(JSON.stringify(initialTestCases))
        })),
    };
};

const connect = (playerName: string) => {
    console.log(`Mock socket connected for player: ${playerName}`);
    connectedPlayerName = playerName;
    return { on: () => {}, off: () => {} };
};

const joinMatchmaking = () => {
    console.log('Player joined quick-match. Simulating opponent...');
    setTimeout(() => {
        const gameState = createInitialGameState([connectedPlayerName, 'Opponent_Bot']);
        gameState.status = 'in-progress';
        if (onMatchFoundCallback) {
            const { matchId, ...rest } = gameState;
            onMatchFoundCallback(rest); 
        }
        // No opponent simulation needed for quick match mock
    }, 2000);
};

const emitCreateRoom = ({ playerName }: { playerName: string }) => {
    const roomId = `MOCK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    console.log(`${playerName} is creating room ${roomId}`);
    rooms[roomId] = { players: [playerName, 'Rival_Bot'] };
    
    setTimeout(() => {
        onRoomCreatedCallback?.({ roomId });
        onRoomUpdatedCallback?.({ players: rooms[roomId].players });
    }, 500);
};

const emitJoinRoom = (roomId: string) => {
    console.log(`${connectedPlayerName} is trying to join room ${roomId}`);
    setTimeout(() => {
        const room = rooms[roomId];
        if (!room) {
            onRoomJoinFailedCallback?.({ error: 'Room not found.' });
            return;
        }
        if (room.players.length >= 2) {
            onRoomJoinFailedCallback?.({ error: 'Room is full.' });
            return;
        }
        if (!room.players.includes(connectedPlayerName)) {
            room.players.push(connectedPlayerName);
        }
        onRoomUpdatedCallback?.({ players: room.players });
    }, 500);
};

const emitStartBattle = (roomId: string) => {
    console.log(`Starting battle for room ${roomId}`);
    const room = rooms[roomId];
    if (room && room.players.length === 2) {
        const gameState = createInitialGameState(room.players);
        gameState.status = 'in-progress';
        room.gameState = gameState;
        
        setTimeout(() => {
            onMatchFoundForRoomCallback?.(gameState);
            // In a real scenario, you'd emit to all players in the room.
            // Here, we just call the callback for the current client.
        }, 1000);
    }
};

const emitRunCode = (code: string) => {
    console.log(`Received code to run: ${code}`);
    // This part needs a valid game state to modify, which is complex in mock.
    // For now, this is a simplified mock.
};

const emitGetHint = () => {
    console.log('Hint requested. Simulating delay...');
    setTimeout(() => {
        onHintResultCallback?.({ hint: 'This is a mock hint. Have you considered the edge cases?' });
    }, 1500);
};

const emitSendEmoji = (emoji: string) => {
    console.log(`Player sent emoji: ${emoji}`);
};


// --- Callback setters ---
const on = (eventName: string, callback: (...args: any[]) => void) => {
    switch (eventName) {
        case 'matchmaking:success': onMatchFoundCallback = callback; break;
        case 'room:match_found': onMatchFoundForRoomCallback = callback; break;
        case 'battle:stateUpdate': onStateUpdateCallback = callback; break;
        case 'battle:gameOver': onGameOverCallback = callback; break;
        case 'battle:hintResult': onHintResultCallback = callback; break;
        case 'battle:hintError': onHintErrorCallback = callback; break;
        case 'battle:emojiReceive': onEmojiReceiveCallback = callback; break;
        case 'room:created': onRoomCreatedCallback = callback; break;
        case 'room:updated': onRoomUpdatedCallback = callback; break;
        case 'room:join_failed': onRoomJoinFailedCallback = callback; break;
    }
};

const off = (eventName: string) => {
    // Mock 'off' doesn't need to do much
};

const mockSocketService = {
  connect,
  joinMatchmaking,
  emitCreateRoom,
  emitJoinRoom,
  emitStartBattle,
  emitRunCode,
  emitGetHint,
  emitSendEmoji,
  on,
  off,
  onMatchFound: (cb: any) => on('matchmaking:success', cb),
  onMatchFoundForRoom: (cb: any) => on('room:match_found', cb),
  onStateUpdate: (cb: any) => on('battle:stateUpdate', cb),
  onGameOver: (cb: any) => on('battle:gameOver', cb),
  onHintResult: (cb: any) => on('battle:hintResult', cb),
  onHintError: (cb: any) => on('battle:hintError', cb),
  onEmojiReceive: (cb: any) => on('battle:emojiReceive', cb),
  onRoomCreated: (cb: any) => on('room:created', cb),
  onRoomUpdated: (cb: any) => on('room:updated', cb),
  onRoomJoinFailed: (cb: any) => on('room:join_failed', cb),
};

export default mockSocketService;
