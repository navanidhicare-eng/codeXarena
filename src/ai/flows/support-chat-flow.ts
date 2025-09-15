'use server';

/**
 * @fileOverview A chatbot for providing user support.
 *
 * - getSupportChatMessage - A function to get a response from the support chatbot.
 * - SupportChatInput - The input type for the getSupportChatMessage function.
 * - SupportChatOutput - The return type for the getSupportChatMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SupportChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type SupportChatMessage = z.infer<typeof SupportChatMessageSchema>;

const SupportChatInputSchema = z.object({
  message: z.string().describe('The latest message from the user.'),
  history: z.array(SupportChatMessageSchema).describe('The conversation history.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function getSupportChatMessage(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const supportChatPrompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: { schema: SupportChatInputSchema },
  output: { schema: SupportChatOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for an application called "CodeVerse".
CodeVerse is a competitive coding platform where users engage in 1v1 battles to solve programming problems faster than their opponent.

Your role is to assist users with questions about the application, help them navigate, and troubleshoot common issues.

Key features of CodeVerse:
- Users enter a "gladiator name" on the landing page.
- They are then matched with an opponent to a coding "arena".
- In the arena, they see a problem description, a code editor, and test case results.
- They can run their code against test cases.
- They can ask for an AI hint if they are stuck.
- The scoreboard shows the progress of both players.

Keep your responses concise and helpful. If you don't know the answer, say so. Do not make up information.

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
