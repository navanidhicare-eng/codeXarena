/**
 * @fileOverview Defines the problems and initial game state for CodeXarena.
 */
import type { GameState, Problem } from './types';

// --- Problem Bank ---
export const problems: Problem[] = [
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
];

/**
 * Creates the initial state for a new game.
 * @param players An array of player names.
 * @returns The initial GameState object.
 */
export const createInitialGameState = (players: string[]): GameState => {
    const currentProblem = problems[Math.floor(Math.random() * problems.length)];
    const initialTestCases = currentProblem.solutionChecker('', 'javascript').map(tc => ({ name: tc.name, passed: null }));

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
