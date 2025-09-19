/**
 * @fileOverview Firebase Cloud Function to securely run user code via the Piston API.
 */

import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";
import { problems } from "./game-state"; // Assuming game-state is compiled to the same dir

const allowedOrigins = [
    "https://code-x-arena.onrender.com",
    "http://localhost:3000",
    /https:\/\/.*cloudworkstations.dev/
];

const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
});


type TestCaseResult = {
    input: string;
    output: string;
    expected: string;
    passed: boolean;
}

type CodeExecutionResult = {
    finalResult: 'Accepted' | 'Wrong Answer' | 'Error';
    testCaseResults: TestCaseResult[];
    stdout: string | null;
    stderr: string | null;
    error: string | null;
}

export const runCode = functions.https.onRequest((request, response) => {
    corsMiddleware(request, response, async () => {
        if (request.method !== "POST") {
            response.status(405).send("Method Not Allowed");
            return;
        }

        const { code, lang, problemTitle } = request.body;

        if (!code || typeof code !== "string" || !lang || typeof lang !== "string" || !problemTitle) {
            response.status(400).send("Bad Request: 'code', 'lang', and 'problemTitle' are required.");
            return;
        }
        
        const problem = problems.find(p => p.title === problemTitle);
        if (!problem) {
            response.status(404).send({ message: `Problem '${problemTitle}' not found.` });
            return;
        }

        const languageMapping: { [key: string]: { language: string, version: string } } = {
            javascript: { language: "javascript", version: "18.15.0" },
            python: { language: "python", version: "3.10.0" },
            java: { language: "java", version: "15.0.2" },
            cpp: { language: "c++", version: "10.2.0" },
        };
        const pistonLang = languageMapping[lang];
        if (!pistonLang) {
            response.status(400).send(`Bad Request: Language '${lang}' is not supported.`);
            return;
        }

        const testCaseResults: TestCaseResult[] = [];
        let finalResult: CodeExecutionResult['finalResult'] = 'Accepted';

        for (const testCase of problem.testCases) {
            // Append a call to the function with the specific input for each test case
            const fullCode = `${code}\nconsole.log(JSON.stringify(${problem.functionName}(${testCase.input})));`;

            const payload = {
                language: pistonLang.language,
                version: pistonLang.version,
                files: [{ content: fullCode }],
            };

            try {
                const pistonResponse = await axios.post("https://emkc.org/api/v2/piston/execute", payload);
                const output = pistonResponse.data.run.stdout.trim();
                const passed = output === testCase.expected;

                testCaseResults.push({
                    input: testCase.input,
                    output: output,
                    expected: testCase.expected,
                    passed: passed,
                });

                if (!passed) {
                    finalResult = 'Wrong Answer';
                }

            } catch (error) {
                functions.logger.error("Error calling Piston API:", error);
                 if (axios.isAxiosError(error) && error.response) {
                    functions.logger.error("Piston API Response:", error.response.data);
                    response.status(error.response.status).send(error.response.data);
                } else {
                    response.status(500).send({ message: "An internal error occurred." });
                }
                return; // Stop on first error
            }
        }
        
        // This is a simplified stdout/stderr handling. A real implementation might combine them.
        const firstFailingCase = testCaseResults.find(r => !r.passed);

        response.status(200).json({
            finalResult: finalResult,
            testCaseResults: testCaseResults,
            stdout: firstFailingCase ? `Input: ${firstFailingCase.input}\nYour Output: ${firstFailingCase.output}` : 'All tests passed!',
            stderr: null, // Piston combines stderr into stdout, needs parsing if separated.
            error: null,
        });
    });
});
