/**
 * Chatbot flow: answers questions about the portfolio using Gemini via Genkit.
 * Called from POST /api/chat (see app/api/chat/route.ts).
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import type { PortfolioData } from "@/lib/types";
import { DEFAULT_AI_CHAT_INSTRUCTIONS } from "@/lib/ai-defaults";

const ChatMessageSchema = z.object({
  role: z.enum(["user", "bot"]),
  text: z.string(),
});

const ChatbotInputSchema = z.object({
  question: z.string().describe("The user's current question about Ritesh Manandhar."),
  portfolioData: z.any().describe("The portfolio data object."),
  history: z.array(ChatMessageSchema).describe("The conversation history."),
  /** Tailor tone when the visitor picks a role in the UI. */
  visitorRole: z
    .enum(["general", "recruiter", "engineer", "student"])
    .optional(),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe("The chatbot's answer to the question."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

function buildPortfolioContext(data: PortfolioData): string {
  const education = data.qualifications.filter((q) => q.type === "education");
  const certs = data.qualifications.filter((q) => q.type === "certification");

  const eduLines = education
    .map((edu) => {
      const extra = [edu.description?.trim(), edu.link?.trim()].filter(Boolean).join(" | ");
      return `- ${edu.title} at ${edu.institution} (${edu.duration})${extra ? `\n  Details: ${extra}` : ""}`;
    })
    .join("\n");

  const certLines = certs
    .map((c) => {
      const extra = [c.description?.trim(), c.link?.trim()].filter(Boolean).join(" | ");
      return `- ${c.title} — ${c.institution} (${c.duration})${extra ? `\n  Details: ${extra}` : ""}`;
    })
    .join("\n");

  const contactLines = data.contact
    .map((c) => `- ${c.label}: ${c.value} (href: ${c.href})`)
    .join("\n");

  const notes = data.notes ?? [];
  const noteLines =
    notes.length > 0
      ? notes
          .map(
            (n) =>
              `- ${n.title} (${n.publishedAt}, slug: ${n.slug})\n  Excerpt: ${n.excerpt}\n  Body: ${n.body}`
          )
          .join("\n\n")
      : "(none)";

  const assets = data.downloadableAssets ?? [];
  const assetLines =
    assets.length > 0
      ? assets
          .map((a) => `- ${a.label}: ${a.url}`)
          .join("\n")
      : "(none)";

  const projectDetailLines = data.projects
    .map((proj) => {
      const extra = proj.caseStudyBody?.trim()
        ? `\n  Case study (longer write-up): ${proj.caseStudyBody.trim()}`
        : "";
      const slug = proj.slug?.trim() || "";
      return `- ${proj.title}${slug ? ` (page: /projects/${slugifyForContext(proj.title, slug)})` : ""}\n  Summary: ${proj.description}\n  Technologies: ${proj.tags.join(", ")}\n  Project link: ${proj.link}${extra}`;
    })
    .join("\n\n");

  function slugifyForContext(title: string, slug: string): string {
    const s = slug.trim();
    if (s) return s;
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project";
  }

  return `
--- Full portfolio site content (cards and sections — use this for factual answers) ---

Header / branding:
- Logo text: ${data.header.logoText}

Hero section:
- Name / headline: ${data.hero.title}
- Subtitle: ${data.hero.subtitle}

About section:
- Section heading: ${data.about.title}
- Body copy:\n  ${data.about.description1}\n  ${data.about.description2}\n  ${data.about.description3}

Experience (timeline cards):
${data.experience.map((exp) => `- ${exp.role} at ${exp.company} (${exp.duration})\n  ${exp.description}`).join("\n\n")}

Skills (levels 0–100):
${data.skills.map((skill) => `- ${skill.name}: ${skill.level}/100`).join("\n")}

Projects (portfolio project cards):
${projectDetailLines || "(none listed)"}

Notes / blog posts (if any):
${noteLines}

Downloadable files (resume PDFs, decks, etc.):
${assetLines}

Education (qualification cards):
${eduLines || "(none listed)"}

Certifications:
${certLines || "(none listed)"}

Resume:
- File / URL shown on site: ${data.resumeUrl}

Contact (use only these; do not invent addresses):
${contactLines}
--- End portfolio content ---
`;
}

export async function chatAboutRitesh(input: ChatbotInput): Promise<ChatbotOutput> {
  const data = input.portfolioData as PortfolioData;
  const portfolioContext = buildPortfolioContext(data);

  const instructions =
    data.aiAssistant?.instructions?.trim() || DEFAULT_AI_CHAT_INSTRUCTIONS;
  const extraDetails = data.aiAssistant?.extraDetails?.trim();

  const role = input.visitorRole ?? "general";
  const roleHint =
    role === "recruiter"
      ? "The visitor identified as a recruiter or hiring manager — be concise, impact-focused, and professional."
      : role === "engineer"
        ? "The visitor identified as an engineer or technical peer — you may use appropriate technical vocabulary when relevant."
        : role === "student"
          ? "The visitor identified as a student or learner — be encouraging and clear, and explain concepts when helpful."
          : "The visitor is a general audience — stay clear and approachable.";

  const historyContext = input.history
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.text}`)
    .join("\n");

  const extraBlock = extraDetails
    ? `\nAdditional notes from the site owner (use as extra context, do not contradict structured data unless clarifying tone):\n${extraDetails}\n`
    : "\n";

  const response = await ai.generate({
    prompt: `${instructions}

Audience context: ${roleHint}

You have the full portfolio below (hero, about, experience cards, skills, project cards with links, notes, downloadable assets, education & certification cards including descriptions, resume link, and contact links). Answer using this data when the question relates to the person's background, projects, or how to reach them.

${portfolioContext}
${extraBlock}
Conversation History:
${historyContext}

Current User's Question: "${input.question}"

Your Answer:`,
    output: {
      schema: ChatbotOutputSchema,
    },
    config: {
      temperature: 0.5,
    },
  });

  const structured = response.output;
  if (structured?.answer?.trim()) {
    return { answer: structured.answer.trim() };
  }

  const text = response.text?.trim();
  if (text) {
    return { answer: text };
  }

  return {
    answer:
      "I'm sorry, I couldn't generate a response. Please try again or ask something else about the portfolio.",
  };
}

ai.defineFlow(
  {
    name: "chatbotFlow",
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => chatAboutRitesh(input)
);
