export type Language = "javascript" | "python" | "java" | "cpp";

export type StarterCode = {
    [key in Language]: string;
}

export type TestCase = {
    input: string;
    expected: string;
};

export type Problem = {
    title: string;
    functionName: string;
    description: string;
    starterCode: StarterCode;
    testCases: TestCase[];
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
