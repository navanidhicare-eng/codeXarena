




import { getAiHint } from '@/ai/flows/ai-hint-system';


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
---
### Sample Input
\`\`\`
nums = [2, 7, 11, 15], target = 9
\`\`\`

### Sample Output
\`\`\`
[0, 1]
\`\`\`
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].
---
### Constraints
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
        starterCode: {
            javascript: `function twoSum(nums, target) {\n  // Write your code here\n};`,
            python: `def two_sum(nums, target):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n  }\n};`
        },
        solutionChecker: (code, lang) => {
            const usesMap = code.includes('Map') || code.includes('dict') || code.includes('unordered_map') || (code.includes('{') && code.includes('}'));
            const usesLoop = code.includes('for') || code.includes('while');
            const returnsArray = code.includes('return [') || code.includes('return {');

            return [
                { name: 'Test with positive numbers', passed: usesMap && usesLoop && returnsArray },
                { name: 'Test with negative numbers', passed: usesMap && usesLoop && returnsArray },
                { name: 'Test with zero', passed: usesMap && usesLoop },
                { name: 'Test with large numbers', passed: usesMap && usesLoop },
            ];
        }
    },
    {
        title: 'FizzBuzz',
        description: `Write a program that prints the numbers from 1 to 100. For multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.
---
### Sample Input
\`\`\`
n = 15
\`\`\`
### Sample Output
\`\`\`
["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
\`\`\`
---
### Constraints
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
            const hasMod3 = code.includes('% 3');
            const hasMod5 = code.includes('% 5');
            const hasMod15 = code.includes('% 15');

            return [
                { name: 'Prints Fizz for multiples of 3', passed: hasFizz && hasLoop && hasMod3 },
                { name: 'Prints Buzz for multiples of 5', passed: hasBuzz && hasLoop && hasMod5 },
                { name: 'Prints FizzBuzz for multiples of 15', passed: hasFizz && hasBuzz && hasLoop && (hasMod15 || (hasMod3 && hasMod5)) },
                { name: 'Handles numbers not divisible by 3 or 5', passed: hasLoop && code.includes('else') },
            ];
        }
    },
    {
        title: 'Reverse String',
        description: `Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.
---
### Sample Input
\`\`\`
s = ["h","e","l","l","o"]
\`\`\`
### Sample Output
\`\`\`
["o","l","l","e","h"]
\`\`\`
---
### Constraints
- \`1 <= s.length <= 10^5\`
- \`s[i]\` is a printable ascii character.`,
        starterCode: {
            javascript: `function reverseString(s) {\n  // Write your code here\n};`,
            python: `def reverse_string(s):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public void reverseString(char[] s) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  void reverseString(vector<char>& s) {\n    // Write your code here\n  }\n};`
        },
         solutionChecker: (code, lang) => {
            const usesLoop = code.includes('for') || code.includes('while');
            const usesPointers = code.includes('left') && code.includes('right');
            const usesSwap = code.includes('temp') || code.includes('swap') || (code.match(/s\[.*?\].*?=.*s\[/g) || []).length > 1;

            return [
                { name: 'Test with even length string', passed: usesLoop && usesPointers && usesSwap },
                { name: 'Test with odd length string', passed: usesLoop && usesPointers && usesSwap },
                { name: 'Test with empty string', passed: true }, // An empty string is its own reverse.
                { name: 'Test with palindrome', passed: usesLoop },
            ];
        }
    },
     {
        title: 'Is Palindrome',
        description: `Given an integer x, return true if x is a palindrome, and false otherwise.
---
### Sample Input
\`\`\`
x = 121
\`\`\`
### Sample Output
\`\`\`
true
\`\`\`
**Explanation:** 121 reads as 121 from left to right and from right to left.

### Sample Input
\`\`\`
x = -121
\`\`\`
### Sample Output
\`\`\`
false
\`\`\`
**Explanation:** From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
---
### Constraints
- \`-2^31 <= x <= 2^31 - 1\``,
        starterCode: {
            javascript: `function isPalindrome(x) {\n  // Write your code here\n};`,
            python: `def is_palindrome(x):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public boolean isPalindrome(int x) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  bool isPalindrome(int x) {\n    // Write your code here\n  }\n};`
        },
         solutionChecker: (code, lang) => {
            const handlesNegative = code.includes('x < 0');
            const convertsToString = code.includes('toString') || code.includes('str(');
            const reverses = code.includes('.reverse()') || code.includes('[::-1]');
            const compares = code.includes('===') || code.includes('==');
            
            return [
                { name: 'Test with positive palindrome', passed: convertsToString && reverses && compares },
                { name: 'Test with non-palindrome', passed: convertsToString && reverses && compares },
                { name: 'Test with single digit', passed: true }, // Single digits are always palindromes
                { name: 'Test with negative number', passed: handlesNegative },
            ];
        }
    }
];

// Store callbacks
let onMatchFoundCallback: (gameState: GameState) => void;
let onMatchFoundForRoomCallback: (gameState: GameState) => void;
let onStateUpdateCallback: (gameState: GameState) => void;
let onGameOverCallback: (data: { winner: string }) => void;
let onHintResultCallback: (data: { hint: string }) => void;
let onHintErrorCallback: (data: { message: string }) => void;
let onEmojiReceiveCallback: (data: { emoji: string }) => void;
let onRoomCreatedCallback: (data: { roomId: string; players: string[] }) => void;
let onRoomUpdatedCallback: (data: { players: string[] }) => void;
let onRoomJoinFailedCallback: (data: { error: string }) => void;

// In-memory store for rooms and game simulations
const rooms: { [key: string]: { players: string[], gameState?: GameState, simulationInterval?: NodeJS.Timeout } } = {};
let activeGameState: GameState | null = null;
let simulationInterval: NodeJS.Timeout | null = null;

const createInitialGameState = (players: string[]) => {
    const currentProblem = problems[Math.floor(Math.random() * problems.length)];
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

const startBotSimulation = (gameState: GameState, botName: string) => {
    if (simulationInterval) clearInterval(simulationInterval);

    activeGameState = gameState;
    const botPlayer = activeGameState.players.find(p => p.name === botName);
    if (!botPlayer) return;

    let testCaseIndex = 0;
    simulationInterval = setInterval(() => {
        if (!activeGameState || activeGameState.status === 'finished') {
            if (simulationInterval) clearInterval(simulationInterval);
            return;
        }

        // Pass a test case for the bot
        if (testCaseIndex < botPlayer.testCases.length) {
            botPlayer.testCases[testCaseIndex].passed = true;
            botPlayer.score++;
            testCaseIndex++;
            onStateUpdateCallback?.(activeGameState);
        }

        // Send a random emoji
        if (Math.random() < 0.2) { // 20% chance to send an emoji
            const emojis = ['👍', '😂', '🤔', '🔥', '🤯', '🎉'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            onEmojiReceiveCallback?.({ emoji: randomEmoji });
        }

        // Check for bot win
        if (botPlayer.score === botPlayer.testCases.length) {
            activeGameState.status = 'finished';
            onGameOverCallback?.({ winner: botPlayer.name });
            if (simulationInterval) clearInterval(simulationInterval);
        }

    }, 3000 + Math.random() * 2000); // Simulate bot action every 3-5 seconds
};

const joinMatchmaking = (playerName: string) => {
    console.log('Player joined quick-match. Simulating opponent...');
    setTimeout(() => {
        const gameState = createInitialGameState([playerName, 'Opponent_Bot']);
        gameState.status = 'in-progress';
        if (onMatchFoundCallback) {
            onMatchFoundCallback(gameState); 
            startBotSimulation(gameState, 'Opponent_Bot');
        }
    }, 2000);
};

const emitCreateRoom = ({ playerName }: { playerName: string }) => {
    const roomId = `MOCK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    console.log(`${playerName} is creating room ${roomId}`);
    rooms[roomId] = { players: [playerName] };
    
    setTimeout(() => {
        onRoomCreatedCallback?.({ roomId, players: rooms[roomId].players });
        
        // Auto-add bot
        setTimeout(() => {
            if (rooms[roomId] && rooms[roomId].players.length < 2) {
                rooms[roomId].players.push('Rival_Bot');
                onRoomUpdatedCallback?.({ players: rooms[roomId].players });
            }
        }, 1000);

    }, 500);
};


const emitJoinRoom = (playerName: string, roomId: string) => {
    console.log(`${playerName} is trying to join room ${roomId}`);
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
        if (!room.players.includes(playerName)) {
            room.players.push(playerName);
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
            const botPlayer = room.players.find(p => p.includes('_Bot'));
            if (botPlayer) {
                startBotSimulation(gameState, botPlayer);
            }
        }, 1000);
    }
};

const emitRunCode = (playerName: string, code: string) => {
    if (!activeGameState) return;
    const userPlayer = activeGameState.players.find(p => p.name === playerName);
    if (!userPlayer) return;

    const currentProblem = problems.find(p => p.title === activeGameState?.problem.title);
    if (!currentProblem) return;

    console.log(`Received code from ${playerName} to run: ${code}`);
    const results = currentProblem.solutionChecker(code, 'javascript'); // Mock language
    let score = 0;
    results.forEach((res, index) => {
        if (userPlayer.testCases[index]) {
            userPlayer.testCases[index].passed = res.passed;
            if(res.passed) score++;
        }
    });
    userPlayer.score = score;
    
    onStateUpdateCallback?.(activeGameState);

    if (userPlayer.score === userPlayer.testCases.length) {
        activeGameState.status = 'finished';
        onGameOverCallback?.({ winner: userPlayer.name });
        if (simulationInterval) clearInterval(simulationInterval);
    }
};

const emitGetHint = async (code: string) => {
    console.log('Hint requested with code. Calling Genkit flow...');
    if (!activeGameState) {
        onHintErrorCallback?.({ message: 'Game not started.' });
        return;
    }
    try {
        const result = await getAiHint({
            problemTitle: activeGameState.problem.title,
            problemDescription: activeGameState.problem.description,
            code: code,
        });
        onHintResultCallback?.({ hint: result.text });
    } catch (error) {
        console.error('AI Hint Error:', error);
        onHintErrorCallback?.({ message: 'Could not generate hint.' });
    }
};

const emitSendEmoji = (emoji: string) => {
    console.log(`Player sent emoji: ${emoji}`);
};

const endGameOnTimeUp = (winner: string) => {
    if (activeGameState) {
        activeGameState.status = 'finished';
        onGameOverCallback?.({ winner });
        if (simulationInterval) {
            clearInterval(simulationInterval);
        }
    }
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
  joinMatchmaking,
  emitCreateRoom,
  emitJoinRoom,
  emitStartBattle,
  emitRunCode,
  emitGetHint,
  emitSendEmoji,
  endGameOnTimeUp,
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

