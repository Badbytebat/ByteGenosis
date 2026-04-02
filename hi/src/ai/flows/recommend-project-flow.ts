
'use server';
/**
 * @fileOverview A flow for recommending a project based on a user's skills.
 *
 * - recommendProject - A function that generates a project recommendation.
 * - RecommendProjectInput - The input type for the recommendProject function.
 * - RecommendProjectOutput - The return type for the recommendProject function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RecommendProjectInputSchema = z.object({
  skills: z.string().describe('A comma-separated list of technical skills.'),
});
export type RecommendProjectInput = z.infer<typeof RecommendProjectInputSchema>;

const RecommendProjectOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the project.'),
  description: z
    .string()
    .describe('A one-paragraph summary of the project idea.'),
  technologies: z
    .array(z.string())
    .describe('A list of recommended technologies or libraries to build the project.'),
  difficulty: z
    .enum(['Beginner', 'Intermediate', 'Advanced'])
    .describe('The estimated difficulty level of the project.'),
});
export type RecommendProjectOutput = z.infer<typeof RecommendProjectOutputSchema>;

export async function recommendProject(
  input: RecommendProjectInput
): Promise<RecommendProjectOutput> {
  return recommendProjectFlow(input);
}

const recommendProjectFlow = ai.defineFlow(
  {
    name: 'recommendProjectFlow',
    inputSchema: RecommendProjectInputSchema,
    outputSchema: RecommendProjectOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are an expert career coach for software developers.
        Based on the following skills, suggest a portfolio project that would be impressive.
        
        Skills: ${input.skills}
        
        Provide a creative project title, a short description, recommended technologies, and a difficulty rating.
        Make the project idea interesting and unique.
        For example, if the skills are "React, Firebase, Maps API", a good suggestion would be a real-time treasure hunt game, not just a simple CRUD app.`,
      output: {
        schema: RecommendProjectOutputSchema,
      },
    });

    return output!;
  }
);
