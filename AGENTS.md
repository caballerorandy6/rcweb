# React & Next.js Best Practices

> Based on Vercel's React Best Practices - 45 rules across 8 categories, ordered by impact.
> Source: https://vercel.com/blog/introducing-react-best-practices

This document guides AI coding agents (Claude Code, Cursor, Copilot, etc.) when working with React/Next.js code in this repository.

---

## When to Apply These Rules

- Writing new React components
- Implementing data fetching
- Reviewing code for performance
- Refactoring existing code
- Optimizing bundle size and load times

---

## Category 1: Eliminating Waterfalls (CRITICAL)

**Impact: CRITICAL** - Waterfalls can add 600ms+ of waiting time. Fix these first.

### async-defer-await
Move `await` into branches where actually used.

```typescript
// ❌ BAD - Blocks even when not needed
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);

  if (skipProcessing) {
    return { skipped: true };
  }
  return processUserData(userData);
}

// ✅ GOOD - Only fetches when needed
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true };
  }

  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

### async-parallel
Use `Promise.all()` for independent operations.

```typescript
// ❌ BAD - Sequential fetches (waterfall)
async function getPageData(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const posts = await prisma.post.findMany({ where: { authorId: userId } });
  const comments = await prisma.comment.findMany({ where: { userId } });
  return { user, posts, comments };
}

// ✅ GOOD - Parallel fetches
async function getPageData(userId: string) {
  const [user, posts, comments] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.post.findMany({ where: { authorId: userId } }),
    prisma.comment.findMany({ where: { userId } }),
  ]);
  return { user, posts, comments };
}
```

### async-dependencies
Use partial dependencies pattern when some operations depend on others.

```typescript
// ❌ BAD - Full waterfall
async function getData() {
  const user = await getUser();
  const profile = await getProfile(user.id);
  const settings = await getSettings(); // Independent!
  return { user, profile, settings };
}

// ✅ GOOD - Parallelize independent operations
async function getData() {
  const [user, settings] = await Promise.all([
    getUser(),
    getSettings(),
  ]);
  const profile = await getProfile(user.id);
  return { user, profile, settings };
}
```

### async-api-routes
Start promises early, await late in API routes.

```typescript
// ❌ BAD - Late start
export async function GET(request: Request) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const data = await fetchData(); // Starts here
  return Response.json(data);
}

// ✅ GOOD - Early start, late await
export async function GET(request: Request) {
  const dataPromise = fetchData(); // Start immediately

  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const data = await dataPromise; // Await when needed
  return Response.json(data);
}
```

### async-suspense-boundaries
Use Suspense to stream content progressively.

```typescript
// ❌ BAD - All or nothing loading
export default async function Page() {
  const data = await fetchSlowData();
  return <Dashboard data={data} />;
}

// ✅ GOOD - Stream with Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header /> {/* Renders immediately */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent /> {/* Streams when ready */}
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const data = await fetchSlowData();
  return <Dashboard data={data} />;
}
```

---

## Category 2: Bundle Size Optimization (CRITICAL)

**Impact: CRITICAL** - Bundle size directly affects load time and user experience.

### bundle-barrel-imports
Import directly from source, avoid barrel files (index.ts re-exports).

```typescript
// ❌ BAD - Barrel import pulls entire package
import { Button } from '@/components';
import { formatDate } from '@/utils';

// ✅ GOOD - Direct imports
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/date';
```

### bundle-dynamic-imports
Use `next/dynamic` for heavy components not needed on initial load.

```typescript
// ❌ BAD - Heavy component in main bundle
import { HeavyChart } from '@/components/HeavyChart';

export default function Dashboard() {
  return <HeavyChart data={data} />;
}

// ✅ GOOD - Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

export default function Dashboard() {
  return <HeavyChart data={data} />;
}
```

### bundle-defer-third-party
Load analytics and logging after hydration.

```typescript
// ❌ BAD - Blocks initial render
import { Analytics } from '@vercel/analytics/react';

// ✅ GOOD - Load after hydration
import dynamic from 'next/dynamic';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(mod => mod.Analytics),
  { ssr: false }
);
```

### bundle-conditional
Load modules only when feature is activated.

```typescript
// ❌ BAD - Always loads PDF library
import { generatePDF } from 'heavy-pdf-lib';

function ExportButton({ format }: { format: 'csv' | 'pdf' }) {
  const handleExport = () => {
    if (format === 'pdf') generatePDF();
  };
  return <button onClick={handleExport}>Export</button>;
}

// ✅ GOOD - Conditional import
function ExportButton({ format }: { format: 'csv' | 'pdf' }) {
  const handleExport = async () => {
    if (format === 'pdf') {
      const { generatePDF } = await import('heavy-pdf-lib');
      generatePDF();
    }
  };
  return <button onClick={handleExport}>Export</button>;
}
```

### bundle-preload
Preload on hover/focus for perceived speed.

```typescript
// ❌ BAD - Load on click (feels slow)
function SettingsLink() {
  return <Link href="/settings">Settings</Link>;
}

// ✅ GOOD - Preload on hover
import { useRouter } from 'next/navigation';

function SettingsLink() {
  const router = useRouter();

  return (
    <Link
      href="/settings"
      onMouseEnter={() => router.prefetch('/settings')}
    >
      Settings
    </Link>
  );
}
```

---

## Category 3: Server-Side Performance (HIGH)

**Impact: HIGH** - Server optimizations reduce TTFB and database load.

### server-cache-react
Use `React.cache()` for per-request deduplication.

```typescript
// ❌ BAD - Multiple calls hit database multiple times
async function getUser(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// Component A calls getUser('1')
// Component B calls getUser('1') <- Duplicate query!

// ✅ GOOD - Deduplicated within request
import { cache } from 'react';

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
});

// Component A calls getUser('1')
// Component B calls getUser('1') <- Returns cached result
```

### server-cache-lru
Use LRU cache for cross-request caching of expensive operations.

```typescript
// ❌ BAD - Recomputes on every request
async function getExpensiveData() {
  return await computeExpensiveOperation();
}

// ✅ GOOD - Cache across requests
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, unknown>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

async function getExpensiveData(key: string) {
  const cached = cache.get(key);
  if (cached) return cached;

  const result = await computeExpensiveOperation();
  cache.set(key, result);
  return result;
}
```

### server-serialization
Minimize data passed to client components.

```typescript
// ❌ BAD - Sends entire user object to client
async function Page() {
  const user = await getUser(); // { id, name, email, password, tokens, logs... }
  return <ClientProfile user={user} />;
}

// ✅ GOOD - Send only needed data
async function Page() {
  const user = await getUser();
  return (
    <ClientProfile
      user={{
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }}
    />
  );
}
```

### server-parallel-fetching
Restructure components to parallelize server fetches.

```typescript
// ❌ BAD - Sequential in single component
async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const posts = await getPosts(params.id);
  const comments = await getComments(params.id);

  return <Dashboard user={user} posts={posts} comments={comments} />;
}

// ✅ GOOD - Parallel with component structure
async function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection userId={params.id} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection userId={params.id} />
      </Suspense>
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsSection userId={params.id} />
      </Suspense>
    </div>
  );
}
```

### server-after-nonblocking
Use `after()` for non-blocking operations (logging, analytics).

```typescript
// ❌ BAD - Logging blocks response
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const result = await processData(data);

  await prisma.log.create({ data: { action: 'process', ... } }); // Blocks!

  return Response.json(result);
}

// ✅ GOOD - Non-blocking with after()
import { after } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const result = await processData(data);

  after(async () => {
    await prisma.log.create({ data: { action: 'process', ... } });
  });

  return Response.json(result); // Returns immediately
}
```

---

## Category 4: Client-Side Data Fetching (MEDIUM-HIGH)

**Impact: MEDIUM-HIGH** - Affects perceived performance and data freshness.

### client-swr-dedup
Use SWR for automatic request deduplication.

```typescript
// ❌ BAD - Multiple components fetch same data
function ComponentA() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
}

function ComponentB() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData); // Duplicate!
  }, []);
}

// ✅ GOOD - SWR deduplicates automatically
import useSWR from 'swr';

function ComponentA() {
  const { data } = useSWR('/api/data', fetcher);
}

function ComponentB() {
  const { data } = useSWR('/api/data', fetcher); // Same cache key = no duplicate request
}
```

### client-event-listeners
Deduplicate global event listeners.

```typescript
// ❌ BAD - Each instance adds listener
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}

// ✅ GOOD - Single shared listener
import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
let windowSize = { width: 0, height: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    windowSize = { width: window.innerWidth, height: window.innerHeight };
    listeners.forEach(l => l());
  });
}

function useWindowSize() {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => windowSize
  );
}
```

---

## Category 5: Re-render Optimization (MEDIUM)

**Impact: MEDIUM** - Reduces unnecessary component updates.

### rerender-defer-reads
Don't subscribe to state only used in callbacks.

```typescript
// ❌ BAD - Re-renders on every count change
function Counter() {
  const [count, setCount] = useState(0);

  const handleSubmit = () => {
    sendAnalytics(count); // Only used here
  };

  return <button onClick={handleSubmit}>Submit</button>;
}

// ✅ GOOD - Use ref for callback-only values
function Counter() {
  const countRef = useRef(0);

  const increment = () => { countRef.current++; };
  const handleSubmit = () => {
    sendAnalytics(countRef.current);
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### rerender-memo
Extract expensive work into memoized components.

```typescript
// ❌ BAD - ExpensiveList re-renders on every parent update
function Parent() {
  const [name, setName] = useState('');
  const items = useItems();

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <ExpensiveList items={items} /> {/* Re-renders on every keystroke */}
    </div>
  );
}

// ✅ GOOD - Memoize expensive component
const MemoizedExpensiveList = React.memo(ExpensiveList);

function Parent() {
  const [name, setName] = useState('');
  const items = useItems();

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <MemoizedExpensiveList items={items} />
    </div>
  );
}
```

### rerender-dependencies
Use primitive dependencies in effects/callbacks.

```typescript
// ❌ BAD - Object reference changes every render
function UserCard({ user }: { user: User }) {
  useEffect(() => {
    trackView(user);
  }, [user]); // New object reference = runs every render
}

// ✅ GOOD - Primitive dependency
function UserCard({ user }: { user: User }) {
  useEffect(() => {
    trackView(user);
  }, [user.id]); // Stable primitive
}
```

### rerender-derived-state
Subscribe to derived booleans, not raw values.

```typescript
// ❌ BAD - Re-renders on every items change
function ItemList({ items }: { items: Item[] }) {
  const isEmpty = items.length === 0;

  if (isEmpty) return <Empty />;
  return <List items={items} />;
}

// ✅ GOOD - Derive in selector (with Zustand)
const useIsEmpty = () => useStore(state => state.items.length === 0);

function ItemList() {
  const isEmpty = useIsEmpty(); // Only re-renders when boolean changes
  const items = useStore(state => state.items);

  if (isEmpty) return <Empty />;
  return <List items={items} />;
}
```

### rerender-functional-setstate
Use functional setState for stable callbacks.

```typescript
// ❌ BAD - Callback recreated on every count change
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]); // Dependency on count

  return <ExpensiveChild onClick={increment} />;
}

// ✅ GOOD - Stable callback with functional update
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(c => c + 1); // No external dependency
  }, []); // Empty deps = stable reference

  return <ExpensiveChild onClick={increment} />;
}
```

### rerender-lazy-state-init
Pass function to useState for expensive initial values.

```typescript
// ❌ BAD - Expensive computation runs every render
function Editor() {
  const [content, setContent] = useState(parseMarkdown(initialContent));
}

// ✅ GOOD - Lazy initialization
function Editor() {
  const [content, setContent] = useState(() => parseMarkdown(initialContent));
}
```

### rerender-transitions
Use `startTransition` for non-urgent updates.

```typescript
// ❌ BAD - Search blocks UI
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setResults(filterItems(e.target.value)); // Expensive, blocks typing
  };
}

// ✅ GOOD - Non-urgent update in transition
import { startTransition } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value); // Urgent: update input immediately
    startTransition(() => {
      setResults(filterItems(e.target.value)); // Non-urgent: can be interrupted
    });
  };
}
```

---

## Category 6: Rendering Performance (MEDIUM)

**Impact: MEDIUM** - Visual performance and paint optimization.

### rendering-animate-svg-wrapper
Animate a div wrapper, not the SVG element directly.

```typescript
// ❌ BAD - Animating SVG triggers expensive repaints
<motion.svg animate={{ rotate: 360 }}>
  <path d="..." />
</motion.svg>

// ✅ GOOD - Animate wrapper div
<motion.div animate={{ rotate: 360 }}>
  <svg>
    <path d="..." />
  </svg>
</motion.div>
```

### rendering-content-visibility
Use `content-visibility: auto` for long lists.

```typescript
// ❌ BAD - All items rendered in DOM
function LongList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// ✅ GOOD - Skip rendering off-screen content
function LongList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li
          key={item.id}
          style={{ contentVisibility: 'auto', containIntrinsicSize: '50px' }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### rendering-hoist-jsx
Extract static JSX outside components.

```typescript
// ❌ BAD - Recreated every render
function Card({ title }) {
  const icon = <IconStar className="w-4 h-4" />; // New object each render

  return (
    <div>
      {icon}
      <span>{title}</span>
    </div>
  );
}

// ✅ GOOD - Static JSX hoisted
const starIcon = <IconStar className="w-4 h-4" />;

function Card({ title }) {
  return (
    <div>
      {starIcon}
      <span>{title}</span>
    </div>
  );
}
```

### rendering-svg-precision
Reduce SVG coordinate precision.

```typescript
// ❌ BAD - Excessive precision
<path d="M12.345678,23.456789 L45.678901,67.890123" />

// ✅ GOOD - Reduced precision (2-3 decimals)
<path d="M12.35,23.46 L45.68,67.89" />
```

### rendering-hydration-no-flicker
Use inline script for client-only data to prevent flicker.

```typescript
// ❌ BAD - Flash of wrong content
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light');
  }, []);

  return <div data-theme={theme}>{children}</div>;
}

// ✅ GOOD - Inline script prevents flash
// In layout.tsx <head>
<script
  dangerouslySetInnerHTML={{
    __html: `
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.dataset.theme = theme;
    `,
  }}
/>
```

### rendering-conditional-render
Use ternary, not `&&` for conditionals.

```typescript
// ❌ BAD - Can render "0" or "false"
{count && <Badge count={count} />}
{items.length && <List items={items} />}

// ✅ GOOD - Explicit ternary
{count > 0 ? <Badge count={count} /> : null}
{items.length > 0 ? <List items={items} /> : null}
```

---

## Category 7: JavaScript Performance (LOW-MEDIUM)

**Impact: LOW-MEDIUM** - Micro-optimizations for hot paths.

### js-batch-dom-css
Group CSS changes via classes or cssText.

```typescript
// ❌ BAD - Multiple style mutations
element.style.width = '100px';
element.style.height = '100px';
element.style.background = 'red';

// ✅ GOOD - Single mutation
element.classList.add('active-state');
// or
element.style.cssText = 'width: 100px; height: 100px; background: red;';
```

### js-index-maps
Build Map for repeated lookups.

```typescript
// ❌ BAD - O(n) lookup each time
function findUser(users: User[], id: string) {
  return users.find(u => u.id === id);
}

// ✅ GOOD - O(1) lookup with Map
const userMap = new Map(users.map(u => [u.id, u]));
function findUser(id: string) {
  return userMap.get(id);
}
```

### js-cache-property-access
Cache object properties in loops.

```typescript
// ❌ BAD - Property access in each iteration
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}

// ✅ GOOD - Cache length
for (let i = 0, len = items.length; i < len; i++) {
  process(items[i]);
}
```

### js-cache-function-results
Cache function results in module-level Map.

```typescript
// ❌ BAD - Recomputes every call
function expensiveCalculation(input: string) {
  return heavyProcess(input);
}

// ✅ GOOD - Memoize results
const cache = new Map<string, Result>();

function expensiveCalculation(input: string) {
  if (cache.has(input)) return cache.get(input)!;
  const result = heavyProcess(input);
  cache.set(input, result);
  return result;
}
```

### js-cache-storage
Cache localStorage/sessionStorage reads.

```typescript
// ❌ BAD - Reads storage on every call
function getTheme() {
  return localStorage.getItem('theme');
}

// ✅ GOOD - Cache the value
let cachedTheme: string | null = null;

function getTheme() {
  if (cachedTheme === null) {
    cachedTheme = localStorage.getItem('theme');
  }
  return cachedTheme;
}
```

### js-combine-iterations
Combine multiple filter/map into one loop.

```typescript
// ❌ BAD - Multiple iterations
const active = items.filter(i => i.active);
const names = active.map(i => i.name);
const upper = names.map(n => n.toUpperCase());

// ✅ GOOD - Single iteration
const result: string[] = [];
for (const item of items) {
  if (item.active) {
    result.push(item.name.toUpperCase());
  }
}
```

### js-length-check-first
Check array length before expensive comparison.

```typescript
// ❌ BAD - Always runs expensive check
if (items.some(i => expensiveCheck(i))) { ... }

// ✅ GOOD - Short-circuit on empty
if (items.length > 0 && items.some(i => expensiveCheck(i))) { ... }
```

### js-early-exit
Return early from functions.

```typescript
// ❌ BAD - Nested conditions
function process(user: User | null) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return doWork(user);
      }
    }
  }
  return null;
}

// ✅ GOOD - Early returns
function process(user: User | null) {
  if (!user) return null;
  if (!user.active) return null;
  if (!user.verified) return null;
  return doWork(user);
}
```

### js-hoist-regexp
Hoist RegExp creation outside loops.

```typescript
// ❌ BAD - Creates RegExp each iteration
for (const item of items) {
  if (/pattern/.test(item)) { ... }
}

// ✅ GOOD - Create once
const pattern = /pattern/;
for (const item of items) {
  if (pattern.test(item)) { ... }
}
```

### js-min-max-loop
Use loop for min/max instead of sort.

```typescript
// ❌ BAD - O(n log n) sort
const max = [...items].sort((a, b) => b.value - a.value)[0];

// ✅ GOOD - O(n) loop
let max = items[0];
for (const item of items) {
  if (item.value > max.value) max = item;
}
```

### js-set-map-lookups
Use Set/Map for O(1) lookups.

```typescript
// ❌ BAD - O(n) array lookup
const allowedIds = ['a', 'b', 'c'];
if (allowedIds.includes(id)) { ... }

// ✅ GOOD - O(1) Set lookup
const allowedIds = new Set(['a', 'b', 'c']);
if (allowedIds.has(id)) { ... }
```

### js-tosorted-immutable
Use `toSorted()` for immutability.

```typescript
// ❌ BAD - Mutates original array
const sorted = items.sort((a, b) => a.value - b.value);

// ✅ GOOD - Returns new array
const sorted = items.toSorted((a, b) => a.value - b.value);
```

---

## Category 8: Advanced Patterns (LOW)

**Impact: LOW** - Edge case optimizations for specific scenarios.

### advanced-event-handler-refs
Store event handlers in refs for stable identity.

```typescript
// ❌ BAD - New function each render
function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]); // callback changes = interval resets
}

// ✅ GOOD - Ref maintains stable callback
function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]); // Only delay matters now
}
```

### advanced-use-latest
useLatest hook for stable callback refs.

```typescript
// ✅ Reusable useLatest hook
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

// Usage
function Component({ onSave }: { onSave: () => void }) {
  const onSaveRef = useLatest(onSave);

  const handleSubmit = useCallback(() => {
    // Always calls latest onSave without re-creating callback
    onSaveRef.current();
  }, []);

  return <ExpensiveForm onSubmit={handleSubmit} />;
}
```

---

## Quick Reference by Priority

| Priority | Categories | Action |
|----------|-----------|--------|
| **CRITICAL** | Waterfalls, Bundle Size | Fix immediately |
| **HIGH** | Server Performance | Fix in current sprint |
| **MEDIUM-HIGH** | Client Data Fetching | Plan for optimization |
| **MEDIUM** | Re-renders, Rendering | Optimize as needed |
| **LOW-MEDIUM** | JavaScript Performance | Hot path only |
| **LOW** | Advanced Patterns | Edge cases |

---

## Sources

- [Vercel Blog: Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
- [GitHub: vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
