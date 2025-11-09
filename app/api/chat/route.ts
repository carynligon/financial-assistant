import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "../../generated/prisma";
import { getChatCompletion } from "../../lib/ai/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        content: message,
        role: "user",
      },
    });

    // Get chat history (last 20 messages for context)
    const chatHistory = await prisma.chatMessage.findMany({
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    // Convert to Anthropic message format
    const messages = chatHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await getChatCompletion(
      messages,
      "You are a helpful financial assistant. Provide clear, accurate, and practical financial advice. Keep responses concise and actionable.",
    );

    // Save assistant response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        content: aiResponse.content,
        role: "assistant",
        metadata: JSON.stringify({
          model: "claude-3-5-sonnet",
          tokens: aiResponse.usage,
        }),
      },
    });

    return NextResponse.json({
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get("limit");
    const limitNum = limit ? parseInt(limit, 10) : 50;

    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: "asc" }, // Changed to asc for chronological order
      take: limitNum,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get chat history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 },
    );
  }
}
