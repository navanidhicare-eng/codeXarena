
export type Event = {
    id: string;
    title: string;
    date: string;
    registrationDeadline: string;
    location: string;
    prizePool?: string;
    description: string;
    tags: string[];
    headerImageUrl: string;
    type: 'Hackathon' | 'Competition' | 'Workshop';
    saved: boolean;
}

export const mockEventsData: Event[] = [
    {
        id: 'event-1',
        title: 'CodeCraft India 2025',
        date: 'Oct 12-14, 2025',
        registrationDeadline: 'Oct 1, 2025',
        location: 'Online',
        prizePool: '₹5,00,000',
        description: 'The biggest national-level hackathon is back! Build a team, create an amazing project in 48 hours, and compete for a massive prize pool.',
        tags: ['Web Dev', 'AI', 'Blockchain'],
        headerImageUrl: 'https://picsum.photos/seed/event1-banner/800/400',
        type: 'Hackathon',
        saved: false,
    },
    {
        id: 'event-2',
        title: "IIT Bombay's 'InnovateAI' Challenge",
        date: 'Sep 30, 2025',
        registrationDeadline: 'Sep 25, 2025',
        location: 'Mumbai (Offline)',
        prizePool: '₹1,00,000',
        description: 'A one-day competitive programming contest focused on artificial intelligence and machine learning problems. Open to all college students.',
        tags: ['AI', 'ML', 'Competition'],
        headerImageUrl: 'https://picsum.photos/seed/event2-banner/800/400',
        type: 'Competition',
        saved: true,
    },
    {
        id: 'event-3',
        title: 'Google DevFest',
        date: 'Nov 5, 2025',
        registrationDeadline: 'Nov 1, 2025',
        location: 'Online',
        prizePool: 'Goodies & Vouchers',
        description: 'Join Google Developer Groups for a day of tech talks, workshops, and coding challenges on the latest in Android, Cloud, and Web technologies.',
        tags: ['Workshop', 'Google', 'Cloud'],
        headerImageUrl: 'https://picsum.photos/seed/event3-banner/800/400',
        type: 'Workshop',
        saved: false,
    },
    {
        id: 'event-4',
        title: "CodeXarena's Python for Beginners",
        date: 'Every Saturday',
        registrationDeadline: 'Join anytime!',
        location: 'Online (via CodeXarena Forge)',
        description: 'New to coding? Join our free weekly workshop where we cover the fundamentals of Python in a fun, interactive, and collaborative environment.',
        tags: ['Beginner Friendly', 'Python', 'Workshop'],
        headerImageUrl: 'https://picsum.photos/seed/event4-banner/800/400',
        type: 'Workshop',
        saved: false,
    }
];
