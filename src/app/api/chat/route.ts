import { OpenAI } from "openai";

// Permitir streaming
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // System prompt personalizado para tu negocio
    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful AI assistant for RC Web Solutions LLC, a web development company specializing in Next.js applications.

Company Info:
- Owner: Randy Caballero
- Location: Houston, TX
- Specialties: React, Next.js, Full-Stack Development
- Services: Custom websites, web applications, e-commerce solutions
- Experience: 5+ years
- Contact: contactus@rcweb.dev, 346-375-7534

Be professional, friendly, and helpful. Answer questions about web development, the services offered, pricing, and general inquiries.
If asked about specific pricing, mention that there are different plans (Basic, Professional, Premium) and encourage them to check the pricing section or contact directly.
Keep responses concise but informative.`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // Crear un stream manualmente usando OpenAI
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response(
      JSON.stringify({ error: "Error processing chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
