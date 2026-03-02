---
title: "From 50 to 98: How I Optimized rcweb.dev for Near-Perfect PageSpeed Scores"
description: "A detailed walkthrough of the performance optimizations that took rcweb.dev from a 50 to a 98 PageSpeed score. Learn about LCP optimization, lazy loading, font strategies, and more."
date: "2026-03-01"
author: "Randy Caballero"
image: "/og-image.jpg"
tags: ["Performance", "Web Development", "PageSpeed", "Next.js", "Optimization"]
---

# From 50 to 98: How I Optimized rcweb.dev for Near-Perfect PageSpeed Scores

Web performance isn't just a technical metric—it's the difference between a customer who stays and one who bounces. Studies show that **53% of mobile users abandon sites that take longer than 3 seconds to load**.

Recently, I undertook a comprehensive performance optimization of rcweb.dev. The results? A jump from **50 to 98** on Google PageSpeed Insights, with perfect scores in Accessibility, Best Practices, and SEO.

Here's exactly how I did it.

---

## The Starting Point: Score of 50

Before optimization, rcweb.dev had significant performance issues:

| Metric | Before | Status |
|--------|--------|--------|
| **Performance** | 50 | Poor |
| **LCP** | 9.9s | Critical |
| **TBT** | 1,070ms | Poor |
| **FCP** | 3.2s | Needs Improvement |
| **CLS** | 0.1 | Needs Improvement |

The main culprits were:
- Heavy video background in the hero section
- Render-blocking JavaScript (reCAPTCHA loading immediately)
- Framer Motion animations blocking LCP
- Cookie consent banner appearing during LCP measurement
- Unoptimized font loading

---

## The Final Results: Score of 98

After optimization:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Performance** | 50 | 98 | +96% |
| **LCP** | 9.9s | 2.1s | -79% |
| **TBT** | 1,070ms | 70ms | -93% |
| **FCP** | 3.2s | 1.0s | -69% |
| **CLS** | 0.1 | 0 | Perfect |
| **Accessibility** | 99 | 100 | Perfect |
| **Best Practices** | 100 | 100 | Perfect |
| **SEO** | 100 | 100 | Perfect |

---

## Optimization 1: Replace Video with Optimized Image

The hero section originally used a looping video background. While visually appealing, videos are performance killers:

**Problem:**
```tsx
// Before: Video element competing with LCP
<video autoPlay loop muted playsInline preload="none">
  <source src="/hero.webm" type="video/webm" />
</video>
```

**Solution:**
```tsx
// After: Optimized image with priority loading
import Image from "next/image";
import heroImage from "../../../public/hero.webp";

<Image
  src={heroImage}
  alt=""
  fill
  priority
  sizes="100vw"
  className="object-cover opacity-35"
  aria-hidden="true"
/>
```

**Impact:** LCP reduced by ~3 seconds. The `priority` attribute tells Next.js to preload this image, and using a static import enables build-time optimization.

---

## Optimization 2: Lazy Load reCAPTCHA

reCAPTCHA v3 loads a significant JavaScript bundle (~150KB). Loading it immediately blocks the main thread.

**Problem:**
```tsx
// Before: reCAPTCHA loads on page load
<Script
  src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
  strategy="afterInteractive"
/>
```

**Solution:**
```tsx
// After: reCAPTCHA loads only when user interacts with form
const [loadRecaptcha, setLoadRecaptcha] = useState(false);

const handleFormInteraction = useCallback(() => {
  if (!loadRecaptcha) setLoadRecaptcha(true);
}, [loadRecaptcha]);

// Only render Script when needed
{loadRecaptcha && (
  <Script
    src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
    strategy="afterInteractive"
  />
)}

// Trigger on form focus
<form onFocus={handleFormInteraction}>
```

**Impact:** TBT reduced from 1,070ms to ~120ms. The reCAPTCHA script only loads when users actually interact with the contact form.

---

## Optimization 3: Fix Framer Motion LCP Blocking

Framer Motion animations that start with `opacity: 0` block LCP because the browser waits for the animation to complete before considering the element "visible."

**Problem:**
```tsx
// Before: h1 wrapped in motion.div with opacity: 0
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <h1>RC Web Solutions</h1>
</motion.div>
```

**Solution:**
```tsx
// After: h1 outside motion.div, uses CSS animation
<h1 className="animate-hero-title">
  RC Web Solutions
</h1>

// CSS animation that doesn't affect LCP
@keyframes hero-title {
  from {
    transform: scale(0.96) translateY(12px);
  }
  to {
    transform: scale(1) translateY(0);
  }
}
```

**Key insight:** CSS animations using only `transform` properties don't block LCP because the element is visible from frame 1. Avoid `opacity` and `filter` in LCP element animations.

**Impact:** LCP element render delay eliminated (~2.5 seconds saved).

---

## Optimization 4: Delay Cookie Consent Banner

Cookie consent banners that appear during the first 2.5 seconds can become the LCP element, dramatically hurting scores.

**Problem:**
```tsx
// Before: Banner appears after 1 second
setTimeout(() => setIsVisible(true), 1000);
```

**Solution:**
```tsx
// After: Banner appears after 5 seconds (past LCP window)
setTimeout(() => setIsVisible(true), 5000);
```

**Impact:** Cookie banner no longer competes with actual content for LCP measurement.

---

## Optimization 5: Font Loading Strategy

Custom fonts can delay text rendering. The Iceland font used in headings needed special attention.

**Problem:** Font loading was blocking initial render.

**Solution:**
```tsx
const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-iceland",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: false,
});
```

**Key settings:**
- `display: "swap"` - Shows fallback font immediately
- `preload: true` - Prioritizes font loading
- `fallback` - Specifies similar system fonts
- `adjustFontFallback: false` - Faster initial render

---

## Optimization 6: Dynamic Imports for Non-Critical Components

Components that aren't needed for initial render should be lazy loaded.

**Solution:**
```tsx
import dynamic from "next/dynamic";

const DialogForm = dynamic(() => import("./DialogForm"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

**Impact:** Reduces initial JavaScript bundle, improving TBT and FCP.

---

## Optimization 7: Modern Browser Targeting

Legacy JavaScript polyfills add unnecessary bytes for modern browsers.

**Solution in package.json:**
```json
"browserslist": [
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Safari versions",
  "last 2 Edge versions"
]
```

**Impact:** Eliminates polyfills for features like `Array.prototype.at`, `Object.fromEntries`, etc. (~12KB saved).

---

## Optimization 8: Lazy Load Google Analytics

Analytics scripts don't need to load immediately.

**Before:**
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="afterInteractive"
/>
```

**After:**
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="lazyOnload"
/>
```

**Impact:** Analytics loads after everything else, not competing with critical resources.

---

## What Didn't Work: Lessons Learned

### 1. CSS Filter Animations

Using `filter: blur()` in animations caused TBT to spike from 70ms to 240ms:

```css
/* Don't do this on LCP elements */
@keyframes hero-title {
  from {
    filter: blur(3px); /* Expensive! */
  }
}
```

**Lesson:** `filter` properties are CPU-intensive. Stick to `transform` for animations.

### 2. Opacity in Initial State

Any animation starting with `opacity: 0` will block LCP:

```tsx
// This blocks LCP
initial={{ opacity: 0 }}
```

**Lesson:** LCP elements must be visible immediately. Use transform-only animations.

---

## Tools Used

- **Google PageSpeed Insights** - Primary testing tool
- **Chrome DevTools Performance Panel** - Detailed analysis
- **Next.js Bundle Analyzer** - JavaScript bundle optimization
- **WebPageTest** - Multi-location testing

---

## The Performance Checklist

Use this checklist for your own optimizations:

### Critical (LCP)
- [ ] Hero images use `priority` and `sizes` attributes
- [ ] No videos in above-the-fold content
- [ ] LCP element has no opacity animations
- [ ] Fonts use `display: swap` and `preload`

### Important (TBT)
- [ ] Third-party scripts lazy loaded
- [ ] reCAPTCHA loads on interaction only
- [ ] No `filter` animations on visible elements
- [ ] Dynamic imports for non-critical components

### Nice to Have
- [ ] Modern browserslist configuration
- [ ] Cookie banner delayed past 2.5s
- [ ] Analytics uses `lazyOnload` strategy

---

## Conclusion

Performance optimization is an iterative process. Each change needs testing, and sometimes optimizations that seem good (like blur animations) actually hurt performance.

The key takeaways:

1. **Measure first** - Use PageSpeed Insights to identify actual problems
2. **Focus on LCP** - It's usually the biggest opportunity
3. **Lazy load everything non-critical** - Scripts, images, components
4. **Test after every change** - Scores can vary; run multiple tests
5. **Don't over-optimize** - 98 is excellent; chasing 100 may require sacrificing UX

**Every second counts.** A faster website means more conversions, better SEO rankings, and happier users.

---

*Need help optimizing your website's performance? [Contact me](/contact) for a free performance audit.*
