
import { sub } from 'date-fns';

export type ClanMember = {
    name: string;
    role: 'Admin' | 'Moderator' | 'Member';
    avatarUrl: string;
};

export type Clan = {
    id: string;
    name: string;
    description: string;
    banner: {
        bgColor: string;
        symbolId: string;
    };
    isPublic: boolean;
    memberCount: number;
    members: ClanMember[];
};

export const myClans: Clan[] = [
    {
        id: 'clan-alpha-sentinels',
        name: 'Alpha Sentinels',
        description: 'A competitive clan focused on dominating the leaderboards and mastering algorithms.',
        banner: { bgColor: '#dc2626', symbolId: 'sword' },
        isPublic: false,
        memberCount: 24,
        members: [
            { name: 'SyntaxSleuth', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/player1/40/40' },
            { name: 'CodeNinja', role: 'Moderator', avatarUrl: 'https://picsum.photos/seed/player2/40/40' },
            { name: 'BitWizard', role: 'Member', avatarUrl: 'https://picsum.photos/seed/player3/40/40' },
        ],
    },
    {
        id: 'clan-bug-busters',
        name: 'Bug Busters',
        description: 'A friendly community dedicated to helping each other learn and squash bugs together.',
        banner: { bgColor: '#16a34a', symbolId: 'bug' },
        isPublic: true,
        memberCount: 52,
        members: [
            { name: 'DebugDiva', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/player4/40/40' },
            { name: 'SyntaxSleuth', role: 'Moderator', avatarUrl: 'https://picsum.photos/seed/player1/40/40' },
            { name: 'CacheKing', role: 'Member', avatarUrl: 'https://picsum.photos/seed/player5/40/40' },
        ],
    },
    {
        id: 'clan-void-voyagers',
        name: 'Void Voyagers',
        description: 'Exploring the depths of computer science and obscure programming languages.',
        banner: { bgColor: '#9333ea', symbolId: 'shield' },
        isPublic: true,
        memberCount: 12,
        members: [
            { name: 'NullPointer', role: 'Admin', avatarUrl: 'https://picsum.photos/seed/player6/40/40' },
            { name: 'SegFault', role: 'Member', avatarUrl: 'https://picsum.photos/seed/player7/40/40' },
        ],
    },
];


const allClans = [...myClans];
export const getClanById = (id: string) => allClans.find(c => c.id === id);


// Mock Chat Messages
const generateMessages = (clanId: string) => {
    const clan = getClanById(clanId);
    if (!clan) return [];
    
    return [
        {
            id: `msg-1-${clanId}`,
            clanId,
            author: clan.members[0],
            content: `Welcome to the ${clan.name} stronghold! Let's get coding.`,
            timestamp: sub(new Date(), { minutes: 30 }).toISOString(),
        },
        {
            id: `msg-2-${clanId}`,
            clanId,
            author: clan.members[1],
            content: `Ready when you are! I want to try the new bug hunt.`,
            timestamp: sub(new Date(), { minutes: 28 }).toISOString(),
        },
        {
            id: `msg-3-${clanId}`,
            clanId,
            author: { name: 'NewbieDev', role: 'Member', avatarUrl: 'https://picsum.photos/seed/player8/40/40' },
            content: `Hey everyone, glad to be here!`,
            timestamp: sub(new Date(), { minutes: 15 }).toISOString(),
        },
    ];
};

export const getClanMessages = (clanId: string) => generateMessages(clanId);
