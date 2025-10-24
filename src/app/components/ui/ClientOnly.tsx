"use client";

import { useEffect, useState } from "react";

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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
