"use client";
import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Mobile performance and glitch fixes
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.normalizeScroll(true);
    
    // Prevent browser from trying to remember scroll position and jumping down the page
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to absolute top on every single load/refresh
    window.scrollTo(0, 0);
    
    if (typeof ScrollTrigger.clearScrollMemory === 'function') {
      ScrollTrigger.clearScrollMemory("manual");
    }

  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, syncTouch: true, touchMultiplier: 2 }}>
      {children}
    </ReactLenis>
  );
}
