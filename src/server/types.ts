/**
 * @fileOverview Shared types for the CodeXarena server.
 */

export type Language = "javascript" | "python" | "java" | "cpp";

export type StarterCode = {
    [key in Language]: string;
}

export type Problem = {
    title: string;
    description: string;
    starterCode: StarterCode;
    solutionChecker: (code: string, lang: Language) => { name: string; passed: boolean }[];
};

export type PlayerState = {
    name: string;
    score: number;
    testCases: { name: string; passed: boolean | null }[];
};

export type GameState = {
    matchId: string;
    players: PlayerState[];
    problem: {
        title: string;
        description: string;
        starterCode: StarterCode;
    };
    status: 'waiting' | 'in-progress' | 'finished';
};
