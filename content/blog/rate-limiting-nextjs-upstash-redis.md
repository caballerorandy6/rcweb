---
title: "Implementing Rate Limiting in Next.js with Upstash Redis"
description: "How we added rate limiting to our Next.js API routes using Upstash Redis to protect against abuse, control costs, and improve security."
date: "2025-12-22"
author: "Randy Caballero"
image: "/og-image.jpg"
tags: ["Rate Limiting", "Upstash", "Redis", "Next.js", "Security", "API Protection"]
---

# Implementing Rate Limiting in Next.js with Upstash Redis

When you expose API endpoints to the internet, you need to protect them. Without rate limiting, a malicious actor (or even a buggy script) could overwhelm your servers, rack up costs on paid APIs, or abuse your services. Here's how we implemented rate limiting using Upstash Redis.

---

## Why Upstash?

We chose Upstash for several reasons:

| Feature | Benefit |
|---------|---------|
| **Serverless-first** | Perfect for Vercel and edge functions |
| **Pay-per-request** | No cost when not in use |
| **Global replication** | Low latency worldwide |
| **Simple pricing** | Generous free tier (10,000 requests/day) |
| **Official SDK** | `@upstash/ratelimit` handles the complexity |

Since we deploy on Vercel, Upstash integrates seamlessly through the Vercel Marketplace.

---

## The Setup

### 1. Install Dependencies

```bash
npm install @upstash/ratelimit @upstash/redis
```

### 2. Configure Environment Variables

After connecting Upstash through Vercel Marketplace, you get these variables:

```env
KV_REST_API_URL="https://your-instance.upstash.io"
KV_REST_API_TOKEN="your-token-here"
```

### 3. Create the Rate Limiter Helper

```typescript
// src/lib/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const rateLimiters = {
  // Chat API: 10 requests per minute (protect OpenAI costs)
  chat: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "ratelimit:chat",
  }),

  // Contact form: 5 requests per minute (prevent spam)
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "ratelimit:contact",
  }),

  // General API: 60 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "ratelimit:api",
  }),
};
```

---

## How It Works

### Sliding Window Algorithm

The sliding window algorithm provides smooth rate limiting. Instead of hard resets at minute boundaries, it calculates a weighted average of the current and previous windows.

```
Time: |----minute 1----|----minute 2----|
       xxxxxxxx                  <- 8 requests in window 1
                        xxxxx    <- 5 requests in window 2
                    ^
                    At this point, the effective count considers
                    both windows proportionally
```

### Applying Rate Limits

Here's how we use it in our chat API:

```typescript
// src/app/api/chat/route.ts
import { rateLimiters } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // Get client IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";

  // Check rate limit
  const { success } = await rateLimiters.chat.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429 }
    );
  }

  // Process the request...
}
```

---

## A Reusable Helper Function

For convenience, we created a helper that returns proper headers:

```typescript
export async function checkRateLimit(
  request: NextRequest,
  limiter: Ratelimit
): Promise<{ success: boolean; response?: NextResponse }> {
  const ip = getClientIp(request);
  const { success, limit, reset, remaining } = await limiter.limit(ip);

  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}
```

Usage:

```typescript
const rateLimitResult = await checkRateLimit(request, rateLimiters.contact);
if (!rateLimitResult.success) {
  return rateLimitResult.response;
}
```

---

## Why Different Limits for Different Endpoints?

Not all endpoints have the same risk profile:

| Endpoint | Limit | Reasoning |
|----------|-------|-----------|
| `/api/chat` | 10/min | Each request costs money (OpenAI API) |
| `/api/receive-mail` | 5/min | Prevents contact form spam |
| General API | 60/min | Standard protection for other endpoints |

---

## What Redis Stores

Upstash stores minimal data for rate limiting:

```
Key: ratelimit:chat:192.168.1.1
Value: { count: 5, timestamp: 1703250000000 }
TTL: 60 seconds (auto-expires)
```

The data is ephemeral—it only exists long enough to track the rate limit window. No personal data is stored permanently.

---

## Cost Considerations

Upstash pricing is straightforward:

- **Free tier**: 10,000 requests/day
- **Pay as you go**: $0.2 per 100K requests

For most applications, the free tier is sufficient. Each API request triggers one Redis command, so your rate limit checks cost almost nothing.

---

## Monitoring

Upstash provides a dashboard showing:

- Total requests
- Commands by type
- Latency metrics
- Daily usage

This helps you understand traffic patterns and adjust limits accordingly.

---

## Conclusion

Rate limiting is essential security infrastructure. With Upstash Redis and the `@upstash/ratelimit` package, implementation takes minutes:

1. **Install the SDK** - Two npm packages
2. **Configure Redis** - Two environment variables
3. **Create limiters** - Define limits per endpoint
4. **Apply to routes** - One function call per endpoint

The result: protection against abuse, controlled costs, and peace of mind.

---

*Building an application that needs rate limiting or other security measures? [Let's talk](/contact).*
