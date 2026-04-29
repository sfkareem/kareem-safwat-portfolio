'use client'

import { Suspense, useEffect, useRef, useState } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const viewerRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Delay rendering the 3D scene slightly to prioritize the main thread for UI rendering
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const viewer = viewerRef.current;
    if (!viewer) return;

    const hideLogo = () => {
      if (viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) {
          logo.style.display = 'none';
        }
      }
    };

    // Try immediately and after a short delay
    hideLogo();
    const timer = setTimeout(hideLogo, 1000);
    
    // Some versions use a different approach, let's also try to inject a style
    if (viewer.shadowRoot) {
      const style = document.createElement('style');
      style.textContent = '#logo { display: none !important; }';
      viewer.shadowRoot.appendChild(style);
    }

    return () => clearTimeout(timer);
  }, [isMounted]);

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <div className={`${className} overflow-visible`}>
        {isMounted && (
          <spline-viewer 
            ref={viewerRef} 
            url={scene} 
            className="w-full h-full" 
            loading-anim-type="spinner"
          />
        )}
      </div>
    </Suspense>
  )
}
