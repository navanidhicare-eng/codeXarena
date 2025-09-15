'use server';

/**
 * @fileOverview AI Hint System for providing coding assistance to players.
 *
 * - getAiHint - A function to retrieve an AI hint for a given problem and code.
 * - AIHintInput - The input type for the getAiHint function.
 * - AIHintOutput - The return type for the getAiHint function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AIHintInputSchema = z.object({
  problemTitle: z.string().describe('The title of the coding problem.'),
  problemDescription: z.string().describe('The description of the coding problem.'),
  code: z.string().describe('The current code written by the player.'),
});

export type AIHintInput = z.infer<typeof AIHintInputSchema>;

const AIHintOutputSchema = z.object({
  text: z.string().describe('The AI hint to display to the player.'),
});

export type AIHintOutput = z.infer<typeof AIHintOutputSchema>;

export async function getAiHint(input: AIHintInput): Promise<AIHintOutput> {
  return aiHintFlow(input);
}

const aiHintPrompt = ai.definePrompt({
  name: 'aiHintPrompt',
  input: { schema: AIHintInputSchema },
  output: { schema: AIHintOutputSchema },
  prompt: `You are an AI coding assistant helping a player solve a coding problem.

Problem Title: {{{problemTitle}}}
Problem Description: {{{problemDescription}}}

Player's Code:
{{#if code}}{{{code}}}{{else}}No code yet.{{/if}}

Provide a helpful hint to guide the player towards a solution. The hint should be specific and actionable, but not directly give away the answer. Focus on suggesting improvements to their existing code or suggesting a strategy.
`,
});

const aiHintFlow = ai.defineFlow(
  {
    name: 'aiHintFlow',
    inputSchema: AIHintInputSchema,
    outputSchema: AIHintOutputSchema,
  },
  async input => {
    const { output } = await aiHintPrompt(input);
    return output!;
  }
);
