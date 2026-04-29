'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

const LENIS_OPTIONS = {
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  syncTouch: true,
  touchMultiplier: 1,
  wheelMultiplier: 1,
  anchors: true,
  allowNestedScroll: true,
  autoRaf: true,
} as const;

export function ReactLenisProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Avoid hydration mismatch: render consistently until client mount
  if (!mounted) {
    return <>{children}</>;
  }

  // When reduced motion is preferred, render children without Lenis
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
