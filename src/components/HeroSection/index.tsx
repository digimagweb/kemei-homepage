"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import HeroProduct from "@/assets/main-products/2.png";
import HeroBanner from "@/assets/banners/banner-no-bg-no-product.png";
import './index.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText);

const HeroSection = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const productImageRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation
      const split = new SplitText(headingRef.current, { type: "chars" });

      gsap.from(split.chars, {
        opacity: 0,
        x: -50,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      });

      // Create timeline for scroll animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Calculate responsive scaling based on viewport
      const calculateFinalScale = () => {
        if (typeof window === "undefined") return 0.4;
        const width = window.innerWidth;
        // Adjust scale based on screen size
        if (width < 768) return 0.6; // Mobile
        if (width < 1024) return 0.5; // Tablet
        return 0.4; // Desktop
      };

      const calculateBackgroundScale = () => {
        if (typeof window === "undefined") return 0.6;
        const width = window.innerWidth;
        // Adjust background scale to ensure it's fully visible
        if (width < 768) return 1.2; // Mobile
        if (width < 1024) return 0.8; // Tablet
        return 0.9; // Desktop
      };

      // Fade out text content as we scroll
      tl.to(
        [
          headingRef.current,
          descriptionRef.current,
          ctaRef.current,
          scrollIndicatorRef.current,
        ],
        {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      )

        // Phase 1: Zoom out and center the product image
        .to(
          productImageRef.current,
          {
            scale: calculateFinalScale(),
            y: "-15vh",
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        )

        // Phase 2: Fade in background image
        .to(
          backgroundImageRef.current,
          {
            opacity: 1,
            scale: calculateBackgroundScale(),
            duration: 1,
            ease: "power2.inOut",
          },
          0.7, // Start slightly after the fade out begins
        );

      // Add a safety margin to ensure background is fully visible
      tl.to(
        backgroundImageRef.current,
        {
          y: "2%", // Adjust vertical position to ensure visibility
          duration: 0.5,
          ease: "power2.inOut",
        },
        1,
      );
    }, containerRef);

    // Handle resize events
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Hero Text */}
      <div className="absolute inset-0 text-[#f5f5f5] z-10">
        {/* CENTER HEADING */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6">
          <h1
            ref={headingRef}
            className="
              mx-auto
              max-w-[1400px]
              text-center
              font-bold
              uppercase
              tracking-tight
              leading-[0.95]
              text-4xl
              xs:text-5xl
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
              xl:text-[9rem]
            "
          >
            Elevate Your <br /> Grooming
          </h1>
        </div>

        {/* BOTTOM RIGHT DESCRIPTION */}
        <div
          ref={descriptionRef}
          className="
            absolute
            bottom-12
            right-4
            sm:right-6
            md:right-5
            lg:right-12
            w-auto
            xl:w-[100%]
            lg:w-[35%]
            max-w-[380px]
            sm:max-w-[320px]
            md:max-w-[270px]
            lg:max-w-[350px]
            xl:max-w-[400px]
            px-4
            sm:px-0
          "
        >
          <p
            className="
            text-sm
            sm:text-base
            xl:text-5lg
            lg:text-base
            md:text-xs
            leading-relaxed
            text-right
            sm:text-left

          "
          >
            Experience grooming made premium. Kemei brings professional-grade
            tools designed for a refined daily routine combining precision,
            power, and effortless control so you look sharp, always.
          </p>
        </div>

        {/* BOTTOM CENTER CTA */}
        <div
          ref={ctaRef}
          className="
            absolute
            bottom-12
            left-1/2
            -translate-x-1/2
            md:left-12
            md:translate-x-0
            w-full
            md:w-auto
            flex justify-center
            md:justify-start
            px-4
            md:px-0
          "
        >
          <button
            className="
            px-4
            sm:px-6
            py-2
            sm:py-3
            bg-[transparent]
            text-white
            rounded-full
            flex items-center gap-2
            hover:bg-[#f5f5f5]
            hover:text-black
            transition-colors
            text-sm
            sm:text-base
            whitespace-nowrap
          "
          >
            Discover More
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4L10 16M10 16L16 10M10 16L4 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Product Image */}
      <div
        ref={productImageRef}
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          z-20
          w-full
          max-w-[122px]
          xs:max-w-[90px]
          sm:max-w-[140px]
          md:max-w-[445px]
          lg:max-w-[490px]
          xl:max-w-[610px]
          h-auto
          overflow-hidden
          flex
          justify-center
        "
        style={{ transformOrigin: "center top" }}
      >
        <Image
          src={HeroProduct}
          alt="Hero image"
          priority
          className="
           
            h-auto
            md:max-w-none
            xl:w-[45%]
            lg:w-[45%]
            md:w-[50%]
          "
          sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 380px, 500px"
        />
      </div>

      {/* Background Image with Multiple Products */}
      <div
        ref={backgroundImageRef}
        className="
          absolute
          inset-0
          z-0
          opacity-0
          overflow-visible
        "
        style={{ transformOrigin: "center center" }}
      >
        <div
          className="
          absolute
          inset-0
          flex
          items-end
          justify-center
        "
        >
          <Image
            src={HeroBanner}
            alt="Kemei Professionals"
            fill
            className="
              object-contain
              object-start
              md:object-bottom
              lg:object-bottom
              xl:object-bottom
            "
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="
        absolute
        bottom-8
        left-1/2
        -translate-x-1/2
        z-30
        hidden
        md:block
      "
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Spacer for scroll - Uncomment if needed */}
      {/* <div className="h-[300vh]"></div> */}
    </div>
  );
};

export default HeroSection;
