/**
 * @fileOverview Firebase Cloud Function to securely run user code via the Piston API.
 */

import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";
import { problems } from "./game-state"; // Assuming game-state is compiled to the same dir

// A mapping from your app's language names to Piston's runtime names.
const languageMapping: { [key: string]: { language: string, version: string } } = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
    cpp: { language: "c++", version: "10.2.0" },
};

const allowedOrigins = [
    "https://code-x-arena.onrender.com",
    "http://localhost:3000",
];
const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || /https:\/\/.*cloudworkstations\.dev/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200 // Add this line to handle pre-flight requests
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

        const pistonLang = languageMapping[lang];
        if (!pistonLang) {
            response.status(400).send(`Bad Request: Language '${lang}' is not supported.`);
            return;
        }

        const testCaseResults: TestCaseResult[] = [];
        let finalResult: CodeExecutionResult['finalResult'] = 'Accepted';
        const allOutputs: string[] = [];
        const allErrors: string[] = [];

        for (const testCase of problem.testCases) {
            // Append a call to the function with the specific input for each test case
            // This is a simplified approach; more complex languages might need different scaffolding.
            const fullCode = `${code}\nconsole.log(JSON.stringify(${problem.functionName}(${testCase.input})));`;

            const payload = {
                language: pistonLang.language,
                version: pistonLang.version,
                files: [{ content: fullCode }],
            };

            try {
                const pistonResponse = await axios.post("https://emkc.org/api/v2/piston/execute", payload);
                
                const runData = pistonResponse.data.run;
                const output = (runData.stdout || "").trim();
                const error = (runData.stderr || "").trim();
                
                if (error) {
                    allErrors.push(`Test Case ${testCaseResults.length + 1}:\n${error}`);
                }
                 if (output) {
                    allOutputs.push(output);
                }

                // Clean the output for comparison.
                const cleanedOutput = output.replace(/"/g, "'");
                const cleanedExpected = testCase.expected.replace(/"/g, "'");
                const passed = cleanedOutput === cleanedExpected;

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
                    // Return the error from Piston if available
                    response.status(500).json({ 
                        finalResult: 'Error',
                        testCaseResults: [],
                        stdout: null,
                        stderr: error.response.data?.message || "An error occurred with the Piston API.",
                        error: "Piston API Error"
                    });
                } else {
                    response.status(500).json({ 
                         finalResult: 'Error',
                        testCaseResults: [],
                        stdout: null,
                        stderr: "An internal server error occurred.",
                        error: "Internal Server Error"
                     });
                }
                return; // Stop on first Piston error
            }
        }
        
        response.status(200).json({
            finalResult: finalResult,
            testCaseResults: testCaseResults,
            stdout: allOutputs.join('\n---\n') || null,
            stderr: allErrors.join('\n---\n') || null,
            error: null,
        });
    });
});
