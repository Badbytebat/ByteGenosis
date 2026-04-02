
'use server';
/**
 * @fileOverview A flow for a chatbot that can answer questions about Ritesh Manandhar.
 *
 * - chatAboutRitesh - A function that takes a question and returns an answer.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { PortfolioData } from '@/lib/types';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  text: z.string(),
});

const ChatbotInputSchema = z.object({
  question: z.string().describe("The user's current question about Ritesh Manandhar."),
  portfolioData: z.any().describe("The portfolio data object."),
  history: z.array(ChatMessageSchema).describe("The conversation history."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe("The chatbot's answer to the question."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatAboutRitesh(
  input: ChatbotInput
): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const data = input.portfolioData as PortfolioData;

    // Convert the live portfolio data into a string context for the LLM
    const portfolioContext = `
      About Ritesh Manandhar:
      - Title: ${data.hero.title}
      - Subtitle: ${data.hero.subtitle}
      - Bio: ${data.about.description1} ${data.about.description2} ${data.about.description3}

      Experience:
      ${data.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

      Skills:
      ${data.skills.map(skill => `- ${skill.name} (Proficiency: ${skill.level}/100)`).join('\n')}

      Projects:
      ${data.projects.map(proj => `- ${proj.title}: ${proj.description} (Technologies: ${proj.tags.join(', ')})`).join('\n')}

      Education:
      ${data.qualifications.filter(q => q.type === 'education').map(edu => `- ${edu.title} from ${edu.institution} (${edu.duration})`).join('\n')}
    `;
    
    const historyContext = input.history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`).join('\n');

    const { output } = await ai.generate({
      prompt: `You are a friendly and helpful chatbot on Ritesh Manandhar's personal portfolio website.
        Your goal is to answer questions about Ritesh based on the context provided below.
        Use the conversation history to understand follow-up questions.
        Keep your answers concise and conversational. If you don't know the answer from the context,
        politely say that you don't have that information. Do not make things up.

        Context about Ritesh:
        ${portfolioContext}
        
        Conversation History:
        ${historyContext}

        Current User's Question: "${input.question}"

        Your Answer:`,
      output: {
        schema: ChatbotOutputSchema,
      },
      config: {
        temperature: 0.5, // Make the responses a bit more focused
      }
    });

    return output ?? { answer: "I'm sorry, I couldn't come up with a response. Please try asking in a different way." };
  }
);
