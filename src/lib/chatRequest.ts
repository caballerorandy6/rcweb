import { z } from "zod";
import {
  CHAT_MAX_ASSISTANT_CHARS,
  CHAT_MAX_BODY_CHARS,
  CHAT_MAX_MESSAGES,
  CHAT_MAX_USER_CHARS,
} from "./chatLimits";

// What /api/chat accepts from a browser. The endpoint is public and every
// request costs OpenAI tokens, so the body is checked before the model sees
// it: only the two roles the chat window produces (a "system" message would
// rewrite the assistant's instructions), plain text, and a bounded size.

const messageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z.string().trim().min(1).max(CHAT_MAX_USER_CHARS),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z.string().max(CHAT_MAX_ASSISTANT_CHARS),
  }),
]);

const chatRequestSchema = z.object({
  locale: z.enum(["en", "es"]).catch("en"),
  messages: z
    .array(messageSchema)
    .min(1)
    .max(CHAT_MAX_MESSAGES)
    .refine((messages) => messages.at(-1)?.role === "user"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** The validated request, or null when the body is not one the chat sends */
export function parseChatRequest(rawBody: string): ChatRequest | null {
  if (rawBody.length > CHAT_MAX_BODY_CHARS) return null;

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return null;
  }

  const parsed = chatRequestSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}
