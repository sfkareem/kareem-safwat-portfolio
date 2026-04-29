'use client';

import { ReactLenis } from 'lenis/react';
import { useSyncExternalStore } from 'react';

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

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

export function ReactLenisProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Avoid hydration mismatch: only render Lenis on the client.
  // Also respect users who prefer reduced motion.
  if (!isClient || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
