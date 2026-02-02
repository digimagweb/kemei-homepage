"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });

    // Sync with GSAP if available
    if (typeof window !== "undefined") {
      // Check if GSAP and ScrollTrigger are available
      if ((window as any).gsap?.ScrollTrigger) {
        lenis.on("scroll", (window as any).gsap.ScrollTrigger.update);
        (window as any).gsap.ticker.add((time: number) => {
          lenis.raf(time * 1000);
        });
        (window as any).gsap.ticker.lagSmoothing(0);
      }
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Handle resize
    const handleResize = () => {
      lenis.resize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      lenis.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  return <>{children}</>;
}