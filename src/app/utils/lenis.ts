"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Singleton instance
let lenisInstance: Lenis | null = null;

export function initSmoothScroll() {
  // Only on client side
  if (typeof window === "undefined") return null;

  // Initialize only once
  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Sync with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance!.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}