"use strict";
/**
 * @fileOverview Firebase Cloud Function to securely run user code via the Piston API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = void 0;
const functions = require("firebase-functions");
const axios_1 = require("axios");
const cors = require("cors");
// IMPORTANT: Replace this with your deployed website's URL for production security.
const allowedOrigins = ["https://code-x-arena.onrender.com", "http://localhost:3000"];
const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
});
exports.runCode = functions.https.onRequest((request, response) => {
    // Handle CORS pre-flight request and then the actual request
    corsMiddleware(request, response, async () => {
        if (request.method !== "POST") {
            response.status(405).send("Method Not Allowed");
            return;
        }
        const { code, lang } = request.body;
        if (!code || typeof code !== "string" || !lang || typeof lang !== "string") {
            response.status(400).send("Bad Request: 'code' and 'lang' are required.");
            return;
        }
        // A mapping from your app's language names to Piston's runtime names.
        const languageMapping = {
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
        const payload = {
            language: pistonLang.language,
            version: pistonLang.version,
            files: [
                {
                    content: code,
                },
            ],
        };
        try {
            const pistonResponse = await axios_1.default.post("https://emkc.org/api/v2/piston/execute", payload, {
                headers: { "Content-Type": "application/json" },
            });
            response.status(200).json(pistonResponse.data);
        }
        catch (error) {
            functions.logger.error("Error calling Piston API:", error);
            if (axios_1.default.isAxiosError(error) && error.response) {
                functions.logger.error("Piston API Response:", error.response.data);
                response.status(error.response.status).send(error.response.data);
            }
            else {
                response.status(500).send({ message: "An internal error occurred while trying to execute the code." });
            }
        }
    });
});
//# sourceMappingURL=index.js.map