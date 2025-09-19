/**
 * @fileOverview Defines the problems and initial game state for CodeXarena.
 */
import type { GameState, Problem } from './types';

// --- Problem Bank ---
export const problems: Problem[] = [
    {
        title: 'Two Sum',
        functionName: 'twoSum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        starterCode: {
            javascript: `function twoSum(nums, target) {\n  // Write your code here\n};`,
            python: `def two_sum(nums, target):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n  }\n};`
        },
        testCases: [
            { input: `[2, 7, 11, 15], 9`, expected: '[0,1]' },
            { input: `[3, 2, 4], 6`, expected: '[1,2]' },
            { input: `[3, 3], 6`, expected: '[0,1]' },
            { input: `[-1, -3, 5, 90], 4`, expected: '[2,0]' },
        ],
    },
    {
        title: 'FizzBuzz',
        functionName: 'fizzBuzz',
        description: 'Write a program that returns an array of strings. For multiples of three return “Fizz” instead of the number and for the multiples of five return “Buzz”. For numbers which are multiples of both three and five return “FizzBuzz”.',
        starterCode: {
            javascript: `function fizzBuzz(n) {\n  // Write your code here\n};`,
            python: `def fizz_buzz(n):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public List<String> fizzBuzz(int n) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  vector<string> fizzBuzz(int n) {\n    // Write your code here\n  }\n};`
        },
        testCases: [
            { input: `3`, expected: '["1","2","Fizz"]' },
            { input: `5`, expected: '["1","2","Fizz","4","Buzz"]' },
            { input: `15`, expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
        ],
    },
    {
        title: 'Is Palindrome',
        functionName: 'isPalindrome',
        description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
        starterCode: {
            javascript: `function isPalindrome(x) {\n  // Write your code here\n};`,
            python: `def is_palindrome(x):\n  # Write your code here\n  pass`,
            java: `class Solution {\n  public boolean isPalindrome(int x) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  bool isPalindrome(int x) {\n    // Write your code here\n  }\n};`
        },
         testCases: [
            { input: '121', expected: 'true' },
            { input: '-121', expected: 'false' },
            { input: '10', expected: 'false' },
            { input: '12321', expected: 'true' },
        ],
    },
    {
        title: 'Reverse String',
        functionName: 'reverseString',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place.',
        starterCode: {
            javascript: `function reverseString(s) {\n  // Write your code here. Return the modified array.\n return s; \n};`,
            python: `def reverse_string(s):\n  # Write your code here. Return the modified list.\n  return s`,
            java: `class Solution {\n  public void reverseString(char[] s) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n  void reverseString(vector<char>& s) {\n    // Write your code here\n  }\n};`
        },
         testCases: [
            { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
            { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' },
            { input: '["a"]', expected: '["a"]' },
        ],
    },
    {
        title: 'Valid Parentheses',
        functionName: 'isValid',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        starterCode: {
            javascript: `function isValid(s) {\n  // Write your code here\n};`,
            python: `def is_valid(s):\n  # Write your code here\n  pass`,
            java: `class Solution {\n    public boolean isValid(String s) {\n    // Write your code here\n  }\n}`,
            cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n    // Write your code here\n  }\n};`
        },
        testCases: [
            { input: '"()"', expected: 'true' },
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' },
            { input: '"{[()]}"', expected: 'true' },
            { input: '"("', expected: 'false' },
        ],
    }
];

/**
 * Creates the initial state for a new game.
 * @param players An array of player names.
 * @returns The initial GameState object.
 */
export const createInitialGameState = (players: string[]): GameState => {
    const currentProblem = problems[Math.floor(Math.random() * problems.length)];
    const initialTestCases = currentProblem.testCases.map((tc, i) => ({ name: `Test Case ${i+1}`, passed: null }));

    return {
        matchId: `match-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
