import { OpenAI } from "openai";
import { getClientIp, rateLimiters } from "@/lib/rateLimit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const { success } = await rateLimiters.chat.limit(getClientIp(req));

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
- Location: based in Houston, TX; works remotely with clients anywhere (video calls, online staging site, Stripe payments)
- Specialties: React, Next.js, Full-Stack Development
- Services: Custom websites, web applications, e-commerce solutions
- Experience: 6+ years, 20+ production sites shipped
- Contact: contactus@rcweb.dev, 346-375-7534

Be professional, friendly, and helpful. Answer questions about web development, the services offered, pricing, and general inquiries.
If asked about specific pricing, mention our five services: Business Website (from $1,000; a landing page is $1,000 fixed), Website Redesign & Modernization (from $3,500), Admin Dashboard & Automation (from $7,500), Online Store & Custom Web Apps (from $8,000) and Monthly Maintenance & Support ($200/month). Only the landing page and the maintenance plan can be paid directly on the site; everything else is quoted after a short conversation. Encourage them to check the pricing section or contact directly for a quote.
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
