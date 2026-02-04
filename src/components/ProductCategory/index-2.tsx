
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
      {/* MOBILE LAYOUT (Visible < 768px) */}
      <section className="block md:hidden w-full py-10 relative z-10">
        <div className="flex flex-col gap-12 px-6">
          {/* For Him */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full overflow-hidden rounded-3xl shadow-lg border border-white/10">
              <Image
                src="/product-category/for-him-1.webp"
                alt="For Him"
                width={800}
                height={1000}
                className="w-full h-auto object-cover"
              />
            </div>
            <a
              href="https://kemei-professionals.myshopify.com/collections/for-him"
              className="glass-button opacity-100 hover:opacity-100 transition-opacity duration-300"
            >
              Explore More
            </a>
          </div>

          {/* For Her */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full overflow-hidden rounded-3xl shadow-lg border border-white/10">
              <Image
                src="/product-category/for-her-with-text.webp"
                alt="For Her"
                width={800}
                height={1000}
                className="w-full h-auto object-cover"
              />
            </div>
            <a
              href="https://kemei-professionals.myshopify.com/collections/for-her"
              className="glass-button opacity-100 hover:opacity-100 transition-opacity duration-300"
            >
              Explore More
            </a>
          </div>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="hidden md:flex relative min-h-screen items-center"
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
              className="hidden md:inline-block glass-button opacity-70 hover:opacity-100 transition-opacity duration-300 md:opacity-100"
            >
              {feature.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
