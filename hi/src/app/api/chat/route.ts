import { NextResponse } from "next/server";
import { chatAboutRitesh } from "@/ai/flows/chatbot-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";

    const limited = checkRateLimit(`chat:${ip}`, MAX_PER_WINDOW, WINDOW_MS);
    if (!limited.ok) {
      return NextResponse.json(
        {
          error: `Too many requests. Try again in ${limited.retryAfterSec} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { question, portfolioData, history, visitorRole } = body as {
      question?: string;
      portfolioData?: unknown;
      history?: { role: "user" | "bot"; text: string }[];
      visitorRole?: "general" | "recruiter" | "engineer" | "student";
    };

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid question" },
        { status: 400 }
      );
    }

    if (!portfolioData || typeof portfolioData !== "object") {
      return NextResponse.json(
        { error: "Missing portfolio data" },
        { status: 400 }
      );
    }

    const result = await chatAboutRitesh({
      question: question.trim(),
      portfolioData,
      history: Array.isArray(history) ? history : [],
      visitorRole,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json({
      answer:
        "I'm having trouble reaching the AI service. If you're the site owner, add GEMINI_API_KEY (from Google AI Studio) to .env.local and restart the dev server.",
    });
  }
}
