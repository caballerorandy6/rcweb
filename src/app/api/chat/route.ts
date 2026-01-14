import { OpenAI } from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Permitir streaming
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiter: 10 requests per minute per IP
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "ratelimit:chat",
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

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
If asked about specific pricing, mention our services: Landing Page ($800), Business Website ($2,500), Website Redesign ($3,000), Admin Dashboard ($5,000), E-Commerce ($6,000), and Custom Web Applications ($8,000+). We also offer Monthly Maintenance ($200/mo). Encourage them to check the pricing section or contact directly for a custom quote.
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
