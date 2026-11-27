// Size limits of the public chat, shared by the chat window and /api/chat.

/** Messages of context the chat window sends and the endpoint accepts */
export const CHAT_MAX_MESSAGES = 20;
/** Length of one visitor message */
export const CHAT_MAX_USER_CHARS = 1000;
/** An answer is capped at 500 tokens, far below this */
export const CHAT_MAX_ASSISTANT_CHARS = 4000;
export const CHAT_MAX_BODY_CHARS = 100_000;
