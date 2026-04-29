'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export function ReactLenisProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When reduced motion is preferred, render children without Lenis
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
        wheelMultiplier: 1,
        anchors: true,
        allowNestedScroll: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
