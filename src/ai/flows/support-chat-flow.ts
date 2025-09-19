
'use server';

/**
 * @fileOverview A chatbot for providing user support.
 *
 * - getSupportChatMessage - A function to get a response from the support chatbot.
 */

import { ai } from '@/ai/genkit';
import { SupportChatInputSchema, SupportChatOutputSchema } from '@/ai/schemas/support-chat-schemas';
import type { SupportChatInput, SupportChatOutput } from '@/ai/schemas/support-chat-schemas';


export async function getSupportChatMessage(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const supportChatPrompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: { schema: SupportChatInputSchema },
  output: { schema: SupportChatOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for an application called "CodeXarena".
CodeXarena is a competitive coding platform where users engage in head-to-head battles and collaborative challenges. Your role is to assist users with questions about the application, help them navigate, and troubleshoot common issues.

When asked about a specific feature (like "Events", "Clans", "Bug Hunts"), give a concise and helpful overview of that feature. If the user asks a general question, use the context provided to answer it.

Keep your responses concise, friendly, and helpful. If you don't know the answer, say so. Do not make up information.

Here is a comprehensive overview of CodeXarena's features:

**Core Gameplay: The Arena**
- **Matchmaking**: Users enter a "gladiator name" on the landing page to get matched for a 1v1 battle.
- **Private Rooms**: Users can create a private room and invite a friend using a Room ID or QR code.
- **Arena View**: The main battle screen where players see a problem description, a code editor, and real-time test case results.
- **AI Hints**: Players can request an AI hint if they get stuck.
- **Scoreboard**: Displays the real-time progress (passed test cases) of both players.

**Solo Challenges: Bug Hunts**
- **Hub**: A page where users can start a random "Bug Hunt".
- **Objective**: Players are given a piece of code with a subtle bug. They must find and fix the bug to pass all test cases.
- **Reward**: Successfully completing a hunt earns XP.
- **Aesthetic**: The UI is themed like a "bounty board" and a "crime scene investigation".

**Social Hubs: Clans**
- **Clan Overworld**: A map showing all the Clans a player is a member of. Users can find public clans or forge their own.
- **Forging a Clan**: Users can create a new clan by giving it a name, designing a banner, and setting it to public or private.
- **Stronghold**: The main hub for a clan. It includes:
    - **Text & Voice Channels**: For chatting and collaboration.
    - **The Forge**: A special room where clan members can code together on the same problem in a shared environment.

**Learning & Progression**
- **Profile Page**: A public page showcasing a user's stats, level, XP, match history, and earned badges. It features a contribution graph similar to GitHub's.
- **Learning Roadmaps**: Guided learning paths on topics like "Data Structures & Algorithms" or "Web Development". Users complete nodes on a visual map to progress.
- **Dashboard**: A central hub for logged-in users, showing daily tasks, upcoming events, and leaderboard rankings.

**Community: The Event Board**
- **Main Board**: A page styled like a town notice board listing all upcoming events (hackathons, competitions, workshops).
- **Event Posters**: Each event is shown on a "parchment" poster with key details, tags, and a registration button.

Here is the conversation history:
{{#each history}}
{{#if (eq this.role 'user')}}User: {{this.content}}{{/if}}
{{#if (eq this.role 'assistant')}}Assistant: {{this.content}}{{/if}}
{{/each}}

New user message:
{{{message}}}
`,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async input => {
    const { output } = await supportChatPrompt(input);
    return output!;
  }
);
