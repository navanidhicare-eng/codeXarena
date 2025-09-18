import { sub, formatISO } from 'date-fns';

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
    title: 'Bugs Squashed',
    value: '17',
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
    id: 'bug-squasher',
    name: 'Bug Squasher',
    description: 'Complete your first Bug Hunt.',
    imageUrl: 'https://picsum.photos/seed/badge9/64/64',
    earned: true,
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
    id: 'exterminator',
    name: 'Exterminator',
    description: 'Complete 25 Bug Hunts.',
    imageUrl: 'https://picsum.photos/seed/badge10/64/64',
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
    id: 'syntax-surgeon',
    name: 'Syntax Surgeon',
    description: 'Complete a "Hard" difficulty Bug Hunt.',
    imageUrl: 'https://picsum.photos/seed/badge11/64/64',
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
    id: 'off-by-one-kenobi',
    name: 'Off-by-One Kenobi',
    description: 'Successfully fix 10 off-by-one errors.',
    imageUrl: 'https://picsum.photos/seed/badge12/64/64',
    earned: false,
  },
  {
    id: 'recursion-paramedic',
    name: 'Recursion Paramedic',
    description: 'Successfully fix 10 broken recursive functions.',
    imageUrl: 'https://picsum.photos/seed/badge13/64/64',
    earned: false,
  },
  {
    id: 'the-profiler',
    name: 'The Profiler',
    description: 'Complete a bug hunt that requires a performance optimization.',
    imageUrl: 'https://picsum.photos/seed/badge14/64/64',
    earned: false,
  },
];


export const mockMatchHistory = [
  {
    id: 'match1',
    outcome: 'Victory',
    problemTitle: 'Two Sum',
    opponent: 'CodeCrusher',
    timestamp: sub(new Date(), { hours: 3 }).toISOString(),
  },
  {
    id: 'match2',
    outcome: 'Victory',
    problemTitle: 'Valid Parentheses',
    opponent: 'LogicLord',
    timestamp: sub(new Date(), { days: 1 }).toISOString(),
  },
  {
    id: 'match3',
    outcome: 'Defeat',
    problemTitle: 'Merge K Sorted Lists',
    opponent: 'AlgoQueen',
    timestamp: sub(new Date(), { days: 2 }).toISOString(),
  },
  {
    id: 'match4',
    outcome: 'Victory',
    problemTitle: 'Reverse Linked List',
    opponent: 'ByteBard',
    timestamp: sub(new Date(), { days: 2, hours: 4 }).toISOString(),
  },
   {
    id: 'match5',
    outcome: 'Victory',
    problemTitle: 'FizzBuzz',
    opponent: 'ScriptKid',
    timestamp: sub(new Date(), { days: 4 }).toISOString(),
  },
   {
    id: 'match6',
    outcome: 'Victory',
    problemTitle: 'Is Palindrome',
    opponent: 'CodeCrusher',
    timestamp: sub(new Date(), { days: 5 }).toISOString(),
  },
];

// Generate mock activity data for the last 365 days
const generateActivityData = () => {
    const today = new Date();
    const data = [];
    for (let i = 0; i < 365; i++) {
        const date = sub(today, { days: i });
        if (Math.random() > 0.3) { // 70% chance of having activity
            const count = Math.floor(Math.random() * 15) + 1; // 1 to 15 contributions
            data.push({
                date: formatISO(date, { representation: 'date' }),
                count: count,
            });
        }
    }
    return data;
};

export const mockActivityData = generateActivityData();
