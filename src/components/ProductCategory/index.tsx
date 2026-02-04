"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContentPhase {
  title: string;
  description: string;
  centralImg: string;
  bgImg: string;
  mobileImg?: string;
  ctaLink?: string;
}

const phases: ContentPhase[] = [
  {
    title: "FOR MEN WHO DEMAND MORE",
    description: "Precision tools crafted for the modern man.",
    centralImg: "/product-category/men-center.png",
    bgImg: "/product-category/for-him.webp",
    mobileImg: "/product-category/for-him-with-text.webp",
    ctaLink: "https://kemei-professionals.myshopify.com/collections/for-him"
  },
  {
    title: "FOR WOMEN WHO INSPIRE",
    description: "Quality care designed to enhance every look.",
    centralImg: "/product-category/women-center.png",
    bgImg: "/product-category/for-her.webp",
    mobileImg: "/product-category/for-her-with-text.webp",
    ctaLink: "https://kemei-professionals.myshopify.com/collections/for-her"
  },
  // Add more phases as needed
];

const ScrollingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const centralImgRef = useRef<HTMLImageElement>(null);
  const rightImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run GSAP on desktop (1024px and above)
    const isDesktop = window.innerWidth >= 1024;

    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${phases.length * 100}%`,
          pin: true,
          scrub: 1,
        }
      });

      phases.forEach((_, i) => {
        if (i === 0) return; // Skip first phase as it's the starting state

        tl.to([textRef.current, centralImgRef.current, rightImgRef.current], {
          opacity: 0,
          duration: 0.5
        })
          .set(textRef.current, { innerHTML: `<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase">${phases[i].title}</h2><p class="text-base md:text-lg leading-relaxed">${phases[i].description}</p>` })
          // Update images here via state or direct DOM manipulation if preferred
          .to([textRef.current, centralImgRef.current, rightImgRef.current], {
            opacity: 1,
            duration: 0.5
          });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Render both layouts and toggle with CSS for SSR safety
  return (
    <>
      {/* OLD MOBILE LAYOUT - HIDDEN */}
      <section className="hidden">
        {/* Content hidden as per request */}
      </section>

      {/* NEW MOBILE LAYOUT (< 768px) - Static Images */}
      <section className="relative w-full overflow-hidden py-8 block md:hidden z-30 bg-transparent">
        <div className="flex flex-col space-y-8 px-4">

          {/* Item 1: For Him */}
          <div className="flex flex-col w-full items-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <img
                src="/product-category/for-him-with-text.webp"
                alt="For Him"
                className="w-full h-auto object-cover block"
              />
            </div>
            <a
              href="https://kemei-professionals.myshopify.com/collections/for-him"
              className="mt-4 px-8 py-3 rounded-full bg-emerald-950 text-white flex items-center gap-2 
                           hover:bg-emerald-900 transition-all border border-emerald-500/30 shadow-md text-sm font-semibold tracking-wide"
            >
              Explore Now <span className="text-lg">→</span>
            </a>
          </div>

          {/* Item 2: For Her */}
          <div className="flex flex-col w-full items-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <img
                src="/product-category/for-her-with-text.webp"
                alt="For Her"
                className="w-full h-auto object-cover block"
              />
            </div>
            <a
              href="https://kemei-professionals.myshopify.com/collections/for-her"
              className="mt-4 px-8 py-3 rounded-full bg-emerald-950 text-white flex items-center gap-2 
                           hover:bg-emerald-900 transition-all border border-emerald-500/30 shadow-md text-sm font-semibold tracking-wide"
            >
              Explore Now <span className="text-lg">→</span>
            </a>
          </div>

        </div>
      </section>

      {/* DESKTOP/TABLET LAYOUT (>= 768px) */}
      <section ref={sectionRef} className="hidden md:flex relative h-screen w-full overflow-hidden items-center justify-center bg-transparent">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[80vh] gap-8 items-center px-6 lg:px-10">
          {/* Left Column: Glassmorphism Text Box */}
          <div
            className="group relative p-8 lg:p-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md 
                       transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <div ref={textRef} className="space-y-4 lg:space-y-6 text-[#f5f5f5]">
              <h2 className="text-4xl lg:text-5xl xl:text-5xl font-bold tracking-tighter uppercase">{phases[0].title}</h2>
              <p className="text-lg lg:text-lg leading-relaxed">{phases[0].description}</p>
            </div>
          </div>

          {/* Right Column: Background Image display */}
          <div
            ref={rightImgRef}
            className="hidden lg:block h-full w-full rounded-2xl bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${phases[0].bgImg})` }}
          />
        </div>

        {/* Central Floating Element & CTA */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <img
            ref={centralImgRef}
            src={phases[0].centralImg}
            alt="Device"
            className="w-48 md:w-56 lg:w-64 xl:w-64 drop-shadow-2xl mb-8"
          />

          <button className="px-8 py-3 rounded-md bg-emerald-950 text-white flex items-center gap-3 
                             hover:bg-emerald-900 transition-colors border border-emerald-500/30
                             hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            En savoir plus
            <span className="text-xl">→</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default ScrollingSection;
