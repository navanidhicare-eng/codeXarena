'use server';

/**
 * @fileOverview AI Hint System for providing coding assistance to players.
 *
 * - getAiHint - A function to retrieve an AI hint for a given problem and code.
 */

import { ai } from '@/ai/genkit';
import { AIHintInputSchema, AIHintOutputSchema } from '@/ai/schemas/ai-hint-schemas';
import type { AIHintInput, AIHintOutput } from '@/ai/schemas/ai-hint-schemas';

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
