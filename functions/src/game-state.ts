/**
 * @fileOverview Defines the problems for the judge. This file should be kept in sync with the frontend version.
 */

 export type Language = "javascript" | "python" | "java" | "cpp";

export type TestCase = {
    input: string;
    expected: string;
};

export type Problem = {
    title: string;
    functionName: string;
    testCases: TestCase[];
};


// --- Problem Bank ---
export const problems: Problem[] = [
    {
        title: 'Two Sum',
        functionName: 'twoSum',
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
        testCases: [
            { input: `3`, expected: '["1","2","Fizz"]' },
            { input: `5`, expected: '["1","2","Fizz","4","Buzz"]' },
            { input: `15`, expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
        ],
    },
    {
        title: 'Is Palindrome',
        functionName: 'isPalindrome',
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
         testCases: [
            { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
            { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' },
            { input: '["a"]', expected: '["a"]' },
        ],
    },
    {
        title: 'Valid Parentheses',
        functionName: 'isValid',
        testCases: [
            { input: '"()"', expected: 'true' },
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' },
            { input: '"{[()]}"', expected: 'true' },
            { input: '"("', expected: 'false' },
        ],
    }
];
