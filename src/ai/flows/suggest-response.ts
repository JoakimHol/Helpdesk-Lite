'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting responses to helpdesk tickets.
 *
 * - suggestResponse - A function that suggests a response to a helpdesk ticket.
 * - SuggestResponseInput - The input type for the suggestResponse function.
 * - SuggestResponseOutput - The return type for the suggestResponse function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestResponseInputSchema = z.object({
  ticketContent: z
    .string()
    .describe('The content of the helpdesk ticket, including the user\'s description and any attachments.'),
  priorResponses: z
    .string()
    .optional()
    .describe('The prior responses to the ticket.'),
});

export type SuggestResponseInput = z.infer<typeof SuggestResponseInputSchema>;

const SuggestResponseOutputSchema = z.object({
  suggestedResponse: z
    .string()
    .describe('A suggested response to the helpdesk ticket, that the agent can use directly or modify.'),
});

export type SuggestResponseOutput = z.infer<typeof SuggestResponseOutputSchema>;

export async function suggestResponse(input: SuggestResponseInput): Promise<SuggestResponseOutput> {
  return suggestResponseFlow(input);
}

const suggestResponsePrompt = ai.definePrompt({
  name: 'suggestResponsePrompt',
  input: {
    schema: z.object({
      ticketContent: z
        .string()
        .describe('The content of the helpdesk ticket, including the user\'s description and any attachments.'),
      priorResponses: z
        .string()
        .optional()
        .describe('The prior responses to the ticket.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedResponse: z
        .string()
        .describe('A suggested response to the helpdesk ticket, that the agent can use directly or modify.'),
    }),
  },
  prompt: `You are an AI assistant helping a helpdesk agent respond to a user ticket.  The agent will use your suggestion as a starting point, so it should be well-written and professional.

  Here is the content of the ticket:
  {{ticketContent}}

  {{#if priorResponses}}
  Here are the prior responses to the ticket:
  {{priorResponses}}
  {{/if}}

  Please provide a suggested response to the ticket.  The response should be helpful and address the user's issue, and also be concise and to the point.
  `,
});

const suggestResponseFlow = ai.defineFlow<
  typeof SuggestResponseInputSchema,
  typeof SuggestResponseOutputSchema
>({
  name: 'suggestResponseFlow',
  inputSchema: SuggestResponseInputSchema,
  outputSchema: SuggestResponseOutputSchema,
}, async input => {
  const {output} = await suggestResponsePrompt(input);
  return output!;
});

