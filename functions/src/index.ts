/**
 * @fileOverview Firebase Cloud Function to securely run user code via the Piston API.
 */

import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";

// IMPORTANT: Using "*" is for development. For production, you should restrict this
// to your actual frontend's domain, e.g., "https://your-app-name.web.app"
const corsMiddleware = cors({ origin: true });


export const runCode = functions.https.onRequest((request, response) => {
  // Wrap the entire function logic in the corsMiddleware
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
      const pistonResponse = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          payload,
          {
              headers: { "Content-Type": "application/json" },
          }
      );
      
      response.status(200).json(pistonResponse.data);

    } catch (error) {
        functions.logger.error("Error calling Piston API:", error);
        if (axios.isAxiosError(error) && error.response) {
            functions.logger.error("Piston API Response:", error.response.data);
            response.status(error.response.status).send(error.response.data);
        } else {
            response.status(500).send({ message: "An internal error occurred while trying to execute the code." });
        }
    }
  });
});
