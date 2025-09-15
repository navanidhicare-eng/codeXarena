import { z } from 'zod';

export const AIHintInputSchema = z.object({
  problemTitle: z.string().describe('The title of the coding problem.'),
  problemDescription: z.string().describe('The description of the coding problem.'),
  code: z.string().describe('The current code written by the player.'),
});

export type AIHintInput = z.infer<typeof AIHintInputSchema>;

export const AIHintOutputSchema = z.object({
  text: z.string().describe('The AI hint to display to the player.'),
});

export type AIHintOutput = z.infer<typeof AIHintOutputSchema>;
