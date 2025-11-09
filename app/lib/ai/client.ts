import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getChatCompletion(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt?: string,
) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // ✅ Fast and reliable
      max_tokens: 1024,
      system:
        systemPrompt ||
        "You are a helpful financial assistant. Provide clear, accurate, and practical financial advice.",
      messages: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    });

    // Extract text from response
    const textContent = response.content.find(
      (block) => block.type === "text",
    ) as { type: "text"; text: string } | undefined;

    return {
      content: textContent?.text || "",
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw error;
  }
}
