'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './video-section.css';

gsap.registerPlugin(ScrollTrigger);

interface VideoSectionProps {
  videoSrc: string;
  title: string;
  subtitle: string;
}

export default function VideoSection({
  videoSrc,
  title,
  subtitle,
}: VideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !heroRef.current) return;

    // HERO CONTAINER ANIMATION
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 15%',
        scrub: true,
      },
    });

    heroTl.to(heroRef.current, {
      marginInline: '6vw',
      borderRadius: 24,
      scale: 0.95,
      ease: 'none',
    });

    // CONTENT ANIMATION
    // gsap.fromTo(
    //   contentRef.current,
    //   {
    //     opacity: 0,
    //     y: 40,
    //   },
    //   {
    //     opacity: 1,
    //     y: 0,
    //     duration: 0.8,
    //     ease: 'power3.out',
    //     scrollTrigger: {
    //       trigger: sectionRef.current,
    //       start: 'top 65%',
    //     },
    //   }
    // );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="video-scroll-wrapper" ref={sectionRef}>
      <div className="hero-section" ref={heroRef}>
        {/* VIDEO */}
        <div className="video-bg-wrapper">
          <video
            className="video-bg"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* CONTENT */}
        {/* <div className="hero-content" ref={contentRef}>
          <h2 className="text-3xl " >
            {title.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h2>
          <p>{subtitle}</p>
        </div> */}
      </div>
    </section>
  );
}
