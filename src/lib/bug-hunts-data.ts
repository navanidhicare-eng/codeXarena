import type { Problem } from '@/server/types';
import { problems } from '@/server/game-state';

export type BugHuntDifficulty = 'Easy' | 'Medium' | 'Hard';
export type BugHuntLanguage = 'javascript' | 'python' | 'java' | 'cpp';

export interface BugHuntChallenge {
  id: string;
  problemId: string;
  difficulty: BugHuntDifficulty;
  xpReward: number;
  availableLanguages: BugHuntLanguage[];
  buggyCode: {
    [key in BugHuntLanguage]?: string;
  };
}

const findProblemByTitle = (title: string): Problem | undefined => {
    return problems.find(p => p.title === title);
}

// Manually associate bug hunts with problems
const twoSumProblem = findProblemByTitle('Two Sum');
const fizzBuzzProblem = findProblemByTitle('FizzBuzz');
const isPalindromeProblem = findProblemByTitle('Is Palindrome');
const reverseStringProblem = findProblemByTitle('Reverse String');
const validParenthesesProblem = findProblemByTitle('Valid Parentheses');


export const bugHuntChallenges: BugHuntChallenge[] = [
  {
    id: 'bh-001',
    problemId: twoSumProblem?.title || 'Two Sum',
    difficulty: 'Easy',
    xpReward: 75,
    availableLanguages: ['javascript', 'python', 'cpp'],
    buggyCode: {
      javascript: `function twoSum(nums, target) {
  const numMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [complement, nums[i]];
    }
    numMap.set(nums[i], i);
  }
  return [];
};`,
      python: `def two_sum(nums, target):
  num_map = {}
  for i, num in enumerate(nums):
    complement = target - num
    if complement in num_map:
      return [i, i]
    num_map[num] = i
  return []`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> num_map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (num_map.find(complement) != num_map.end()) {
                return {i};
            }
            num_map[nums[i]] = i;
        }
        return {};
    }
};`
    },
  },
  {
    id: 'bh-002',
    problemId: fizzBuzzProblem?.title || 'FizzBuzz',
    difficulty: 'Easy',
    xpReward: 50,
    availableLanguages: ['javascript', 'java'],
    buggyCode: {
      javascript: `function fizzBuzz() {
  const result = [];
  for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else if (i % 15 === 0) {
      result.push("FizzBuzz");
    } else {
      result.push(i.toString());
    }
  }
  return result;
};`,
      java: `class Solution {
    public List<String> fizzBuzz(int n) {
        List<String> answer = new ArrayList<String>();
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0) {
                answer.add("Fizz");
            } else if (i % 5 == 0) {
                answer.add("Buzz");
            } else {
                answer.add(Integer.toString(i));
            }
        }
        return answer;
    }
}`
    },
  },
  {
    id: 'bh-003',
    problemId: isPalindromeProblem?.title || 'Is Palindrome',
    difficulty: 'Medium',
    xpReward: 100,
    availableLanguages: ['javascript', 'python'],
    buggyCode: {
        javascript: `function isPalindrome(x) {
  if (x < 0) return false;
  
  const s = x.toString();
  let reversed = "";
  for (let i = s.length; i >= 0; i--) {
    reversed += s[i];
  }
  return s === reversed;
};`,
        python: `def is_palindrome(x):
  if x < 0:
    return False
  
  s = str(x)
  return s == s[:-1]`
    },
  },
  {
    id: 'bh-004',
    problemId: reverseStringProblem?.title || 'Reverse String',
    difficulty: 'Easy',
    xpReward: 60,
    availableLanguages: ['javascript', 'java'],
    buggyCode: {
      javascript: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
  }
  return s;
};`,
      java: `class Solution {
    public void reverseString(char[] s) {
        int left = 1;
        int right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}`
    },
  },
  {
    id: 'bh-005',
    problemId: validParenthesesProblem?.title || 'Valid Parentheses',
    difficulty: 'Medium',
    xpReward: 120,
    availableLanguages: ['javascript', 'cpp'],
    buggyCode: {
      javascript: `function isValid(s) {
    const stack = [];
    const map = {
        "(": ")",
        "[": "]",
        "{": "}"
    };

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (map[char]) {
            stack.push(char);
        } else {
            const lastOpen = stack.pop();
            if (char !== map[lastOpen]) {
                return false;
            }
        }
    }
    return true;
};`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                if (c == ')' && st.top() == '(') st.pop();
                else if (c == '}' && st.top() == '{') st.pop();
                else if (c == ']' && st.top() == '[') st.pop();
            }
        }
        return st.empty();
    }
};`
    },
  }
];

export const getBugHuntById = (id: string): BugHuntChallenge | undefined => {
    return bugHuntChallenges.find(bh => bh.id === id);
};

export const getProblemForBugHunt = (hunt: BugHuntChallenge): Problem | undefined => {
    return findProblemByTitle(hunt.problemId);
}
