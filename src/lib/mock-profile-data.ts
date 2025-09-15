import { Percent, Swords, Flame, Code } from 'lucide-react';

export const mockProfileData = {
  avatarUrl: 'https://picsum.photos/seed/player1/200/200',
  username: 'SyntaxSlayer',
  title: 'Algorithm Archer',
  level: 12,
  currentXp: 450,
  xpForNextLevel: 1000,
  xpCoins: 2350,
};

export const mockStatsData = [
  {
    title: 'Win Rate',
    value: '68%',
    icon: 'Percent',
  },
  {
    title: 'Total Battles',
    value: '142',
    icon: 'Swords',
  },
  {
    title: 'Current Streak',
    value: '5',
    icon: 'Flame',
  },
  {
    title: 'Preferred Language',
    value: 'JS',
    icon: 'Code',
  },
];

export const mockBadgeData = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Win your first 1v1 battle.',
    imageUrl: 'https://picsum.photos/seed/badge1/64/64',
    earned: true,
  },
  {
    id: 'hat-trick',
    name: 'Hat-trick',
    description: 'Win 3 battles in a row.',
    imageUrl: 'https://picsum.photos/seed/badge2/64/64',
    earned: true,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Win 10 battles in a row.',
    imageUrl: 'https://picsum.photos/seed/badge3/64/64',
    earned: false,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Win a battle with 3 different languages.',
    imageUrl: 'https://picsum.photos/seed/badge4/64/64',
    earned: true,
  },
    {
    id: 'centurion',
    name: 'Centurion',
    description: 'Compete in 100 battles.',
    imageUrl: 'https://picsum.photos/seed/badge5/64/64',
    earned: true,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Solve a problem in under 2 minutes.',
    imageUrl: 'https://picsum.photos/seed/badge6/64/64',
    earned: false,
  },
    {
    id: 'flawless-victory',
    name: 'Flawless Victory',
    description: 'Win a battle without failing a single test case.',
    imageUrl: 'https://picsum.photos/seed/badge7/64/64',
    earned: true,
  },
  {
    id: 'legend',
    name: 'CodeVerse Legend',
    description: 'Reach level 50.',
    imageUrl: 'https://picsum.photos/seed/badge8/64/64',
    earned: false,
  },
];


export const mockMatchHistory = [
  {
    id: 'match1',
    outcome: 'Victory',
    problemTitle: 'Two Sum',
    opponent: 'CodeCrusher',
    timestamp: '3 hours ago',
  },
  {
    id: 'match2',
    outcome: 'Victory',
    problemTitle: 'Valid Parentheses',
    opponent: 'LogicLord',
    timestamp: '1 day ago',
  },
  {
    id: 'match3',
    outcome: 'Defeat',
    problemTitle: 'Merge K Sorted Lists',
    opponent: 'AlgoQueen',
    timestamp: '2 days ago',
  },
  {
    id: 'match4',
    outcome: 'Victory',
    problemTitle: 'Reverse Linked List',
    opponent: 'ByteBard',
    timestamp: '2 days ago',
  },
   {
    id: 'match5',
    outcome: 'Victory',
    problemTitle: 'FizzBuzz',
    opponent: 'ScriptKid',
    timestamp: '4 days ago',
  },
   {
    id: 'match6',
    outcome: 'Victory',
    problemTitle: 'Is Palindrome',
    opponent: 'CodeCrusher',
    timestamp: '5 days ago',
  },
];
