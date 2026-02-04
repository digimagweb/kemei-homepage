"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURES } from "@/data/ProductCategory";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollFeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${FEATURES.length * 100}%`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const nextIndex = Math.min(
          FEATURES.length - 1,
          Math.floor(self.progress * FEATURES.length),
        );

        if (nextIndex !== indexRef.current) {
          indexRef.current = nextIndex;
          animateChange(nextIndex);
        }
      },
    });

    return () => {
      trigger.kill(); // ✅ kill ONLY this trigger
    };
  }, []);

  const animateChange = (index: number) => {
    gsap.to([contentRef.current, centerRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(index);

        gsap.fromTo(
          [contentRef.current, centerRef.current],
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          },
        );
      },
    });
  };

  const feature = FEATURES[activeIndex];

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center"
      >
        <div
          className="relative mx-auto w-[90%] md:w-[98%]
  lg:w-[90%] xl:w-[75%] max-w-7xl md:h-[550px] h-auto rounded-3xl overflow-hidden grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 glass-card"
        >
          {/* MOBILE IMAGE (Visible only on mobile) */}
          <div className="block md:hidden w-full h-auto z-0 relative">
            <Image
              // @ts-ignore
              src={feature.mobileImg || feature.sideImage}
              alt={feature.title}
              width={800}
              height={1000}
              className="w-full h-auto object-contain transition-opacity duration-500"
              priority
            />
          </div>

          {/* TEXT (Hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center">
            <div ref={contentRef} className="max-w-md px-8 py-12 z-100">
              <p className="text-sm opacity-80 leading-relaxed">
                {feature.subTitle}
              </p>
              <h2 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                {feature.title}
              </h2>
              <p className="text-lg md:text-sm lg:text-base md:w-[90%] opacity-80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>

          {/* SIDE IMAGE (Hidden on mobile) */}
          <div className="relative hidden md:block">
            <Image
              src={feature.sideImage}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* CENTER PRODUCT (Button on mobile, Image+Button on desktop) */}
          <div
            ref={centerRef}
            className="absolute left-1/2 top-[65%] md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-6"
          >
            <Image
              src={feature.centerImage}
              alt=""
              width={220}
              height={420}
              className="
                hidden md:block
                w-[140px]
                sm:w-[180px]
                md:w-[240px]
                lg:w-[300px]
                xl:w-[355px]
                max-h-[420px]
                object-contain
              "
              priority
            />

            <a
              href={feature.href}
              className="glass-button opacity-70 hover:opacity-100 transition-opacity duration-300 md:opacity-100"
            >
              {feature.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
