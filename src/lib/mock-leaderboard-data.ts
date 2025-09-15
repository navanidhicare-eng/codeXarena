
export type LeaderboardPlayer = {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  xp: number;
  continent: 'Global' | 'North America' | 'Europe' | 'Asia';
  country: string;
};

export const mockLeaderboardData: LeaderboardPlayer[] = [
  { id: '1', rank: 1, username: 'CodeGod', avatarUrl: 'https://picsum.photos/seed/p1/40/40', xp: 50000, continent: 'North America', country: 'USA' },
  { id: '2', rank: 2, username: 'AlgoQueen', avatarUrl: 'https://picsum.photos/seed/p2/40/40', xp: 48500, continent: 'Europe', country: 'Germany' },
  { id: '3', rank: 3, username: 'ByteBard', avatarUrl: 'https://picsum.photos/seed/p3/40/40', xp: 47000, continent: 'Asia', country: 'South Korea' },
  { id: '4', rank: 4, username: 'LogicLord', avatarUrl: 'https://picsum.photos/seed/p4/40/40', xp: 46000, continent: 'North America', country: 'Canada' },
  { id: '5', rank: 5, username: 'SyntaxSlayer', avatarUrl: 'https://picsum.photos/seed/player1/40/40', xp: 45500, continent: 'North America', country: 'USA' },
  { id: '6', rank: 6, username: 'ScriptKid', avatarUrl: 'https://picsum.photos/seed/p6/40/40', xp: 44000, continent: 'Europe', country: 'France' },
  { id: '7', rank: 7, username: 'CodeCrusher', avatarUrl: 'https://picsum.photos/seed/p7/40/40', xp: 43000, continent: 'Asia', country: 'Japan' },
  { id: '8', rank: 8, username: 'BugBasher', avatarUrl: 'https://picsum.photos/seed/p8/40/40', xp: 42500, continent: 'North America', country: 'USA' },
  { id: '9', rank: 9, username: 'DataDuchess', avatarUrl: 'https://picsum.photos/seed/p9/40/40', xp: 41000, continent: 'Europe', country: 'UK' },
  { id: '10', rank: 10, username: 'KernelKing', avatarUrl: 'https://picsum.photos/seed/p10/40/40', xp: 40500, continent: 'Asia', country: 'India' },
  { id: '11', rank: 11, username: 'RefactorRex', avatarUrl: 'https://picsum.photos/seed/p11/40/40', xp: 39000, continent: 'North America', country: 'Canada' },
  { id: '12', rank: 12, username: 'AsyncAce', avatarUrl: 'https://picsum.photos/seed/p12/40/40', xp: 38500, continent: 'Europe', country: 'Germany' },
  { id: '13', rank: 13, username: 'PromisePrincess', avatarUrl: 'https://picsum.photos/seed/p13/40/40', xp: 38000, continent: 'North America', country: 'USA' },
  { id: '14', rank: 14, username: 'VectorVictor', avatarUrl: 'https://picsum.photos/seed/p14/40/40', xp: 37500, continent: 'Europe', country: 'France' },
  { id: '15', rank: 15, username: 'StackSorceress', avatarUrl: 'https://picsum.photos/seed/p15/40/40', xp: 37000, continent: 'Asia', country: 'Japan' },
];

export const regionData = {
    'Global': [],
    'North America': ['USA', 'Canada'],
    'Europe': ['Germany', 'France', 'UK'],
    'Asia': ['South Korea', 'Japan', 'India']
};

export const currentUser = {
    id: '5',
    username: 'SyntaxSlayer',
}
