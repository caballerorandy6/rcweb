"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientOnly component prevents hydration mismatches by only rendering
 * children after the component has mounted on the client.
 *
 * Use this wrapper for components that:
 * - Access window, localStorage, or other browser-only APIs
 * - Render differently based on client-side state
 * - Have non-deterministic behavior (dates, random numbers)
 *
 * @param children - Content to render only on client
 * @param fallback - Optional content to show during SSR (default: null)
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  // false on the server and during hydration, true once on the client
  const hasMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
