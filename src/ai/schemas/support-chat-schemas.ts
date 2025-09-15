import { z } from 'zod';

export const SupportChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type SupportChatMessage = z.infer<typeof SupportChatMessageSchema>;

export const SupportChatInputSchema = z.object({
  message: z.string().describe('The latest message from the user.'),
  history: z.array(SupportChatMessageSchema).describe('The conversation history.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

export const SupportChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user."),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;
