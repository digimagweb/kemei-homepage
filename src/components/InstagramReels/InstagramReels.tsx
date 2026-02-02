"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CarouselItem {
  id: number;
  title: string;
  videoUrl: string;
  poster?: string;
}

const carouselItems: CarouselItem[] = [
  { id: 1, title: "Video 1", videoUrl: "/videos/video-1.mp4" },
  { id: 2, title: "Video 2", videoUrl: "/videos/video-2.mp4" },
  { id: 3, title: "Video 3", videoUrl: "/videos/video-3.mp4" },
  { id: 4, title: "Video 4", videoUrl: "/videos/video-4.mp4" },
  { id: 5, title: "Video 5", videoUrl: "/videos/video-5.mp4" },
  { id: 6, title: "Video 6", videoUrl: "/videos/video-6.mp4" },
  { id: 7, title: "Video 7", videoUrl: "/videos/video-7.mp4" },
  { id: 8, title: "Video 8", videoUrl: "/videos/video-8.mp4" },
];

// Create 18 items for a full circle (18 * 20° = 360°)
const createCircularItems = (items: CarouselItem[]): CarouselItem[] => {
  const result: CarouselItem[] = [];
  const totalItems = 18;

  for (let i = 0; i < totalItems; i++) {
    const sourceItem = items[i % items.length];
    result.push({
      ...sourceItem,
      id: i + 1,
    });
  }

  return result;
};

export default function Carousel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const isDragging = useRef(false);
  const startX = useRef(0);
  const rotationY = useRef(100);
  // const momentum = useRef(0);
  const lastTime = useRef(0);
  const rotationSpeed = useRef(8); // Constant rotation speed

  const allowAutoRotate = useRef(true);

  const animationId = useRef<number | null>(null);

  // Create circular array of 18 items
  const circularItems = createCircularItems(carouselItems);

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = circularItems.map(() => null);
  }, []);

  // Initialize carousel and start constant rotation
  useEffect(() => {
    if (!ringRef.current) return;

    // Set initial rotation
    gsap.set(ringRef.current, {
      rotationY: rotationY.current,
      cursor: "grab",
    });

    // Start constant rotation using requestAnimationFrame
    const animate = (timestamp: number) => {
      if (!lastTime.current) lastTime.current = timestamp;
      const deltaTime = timestamp - lastTime.current;
      lastTime.current = timestamp;

      if (allowAutoRotate.current && ringRef.current) {
        const deltaSeconds = deltaTime / 1000;

        rotationY.current += rotationSpeed.current * deltaSeconds;

        gsap.set(ringRef.current, {
          rotationY: rotationY.current,
        });
      }

      animationId.current = requestAnimationFrame(animate);
    };

    animationId.current = requestAnimationFrame(animate);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // e.preventDefault();
    // e.stopPropagation();

    isDragging.current = true;
    allowAutoRotate.current = false;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;

    if (ringRef.current) {
      gsap.set(ringRef.current, { cursor: "grabbing" });
    }

    // Add event listeners
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !ringRef.current) return;

    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX.current;

    // Calculate momentum
    // momentum.current = deltaX * 0.5;

    rotationY.current += deltaX * 0.3;

    // Immediate update for smooth dragging
    gsap.set(ringRef.current, {
      rotationY: rotationY.current,
    });

    startX.current = clientX;
  };

  const handleDragEnd = () => {
    isDragging.current = false;

    if (ringRef.current) {
      gsap.set(ringRef.current, { cursor: "grab" });
    }

    allowAutoRotate.current = true;

    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
  };

  // const handleWheel = (e: React.WheelEvent) => {
  //   rotationY.current += e.deltaY * 0.1;
  //   if (ringRef.current) {
  //     // Use gsap.set for immediate wheel response
  //     gsap.set(ringRef.current, {
  //       rotationY: rotationY.current,
  //     });
  //   }
  // };

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el;
    if (el) {
      el.play().catch((e) => console.log("Autoplay prevented:", e));
    }
  };

  const handleVideoClick = (clickedId: number) => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video) return;

      if (Number(id) === clickedId) {
        video.muted = false;
        video.controls = true;
        video.play().catch(() => {});
      } else {
        video.muted = true;
        video.controls = false;
        video.pause();
      }
    });
  };

  return (
    <section className="carousel-section">
      <div className="heading-container">
        <h1 className="main-heading">Real Stories. Real Results.</h1>
      </div>
      <div className="framer-jxojtt-container">
        <div
          className="carousel-container"
          ref={containerRef}
          // onWheel={handleWheel}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="carousel-inner">
            <div className="perspective-container">
              <div className="transform-container">
                <div className="ring" ref={ringRef}>
                  {circularItems.map((item, index) => {
                    const angle = -(index * 20);

                    return (
                      <div
                        key={item.id}
                        className="carousel-item"
                        style={{
                          transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(-967px) translateZ(0.1px)`,
                        }}
                      >
                        <div className="video-container">
                          <div className="framer-P9Zef">
                            <div className="relative w-full h-full">
                              <video
                                ref={setVideoRef(index)}
                                src={item.videoUrl}
                                className="w-full h-full rounded-[20px] object-cover cursor-pointer"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                controls={false}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVideoClick(index);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .heading-container {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 10;
          pointer-events: none;
        }

        .main-heading {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .sub-heading {
          font-size: 18px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .heading-container {
            top: 60px;
          }

          .main-heading {
            font-size: 36px;
          }

          .sub-heading {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .heading-container {
            top: 40px;
          }

          .main-heading {
            font-size: 25px;
          }

          .sub-heading {
            font-size: 14px;
          }
        }
        .carousel-section {
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          overflow: hidden;
        }

        .framer-jxojtt-container {
          width: 100%;
          height: 100%;
        }

        .carousel-container {
          width: 100%;
          height: 100vh;
          cursor: grab;
          user-select: none;
          position: relative;
          background-color: transparent;
          touch-action: none;
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.15) 0%,
            rgb(0, 0, 0) 11%,
            rgb(0, 0, 0) 89%,
            rgba(0, 0, 0, 0.15) 100%
          );
        }

        .carousel-container:active {
          cursor: grabbing;
        }

        .carousel-inner {
          width: 100%;
          height: 100%;
          position: absolute;
          overflow: hidden;
        }

        .perspective-container {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          perspective: 1500px;
        }

        .transform-container {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        
        @media screen and (max-width: 430px){
          .transform-container {
            height: 0px;
          }
        }

        .ring {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
          cursor: grab;
          backface-visibility: hidden;
          --tw-ring-shadow: 0 0 #0000 !important;
          --tw-ring-offset-shadow: 0 0 #0000 !important;
          box-shadow: none !important;
        }

        .carousel-item {
          position: absolute;
          left: 50%;
          top: 50%;
          backface-visibility: hidden;
          pointer-events: auto;
          width: 280px;
          height: 500px;
          transform-style: preserve-3d;
        }

        .video-container {
          width: 100%;
          height: 100%;
        }

        .framer-P9Zef {
          background-color: rgb(255, 255, 255);
          width: 100%;
          border-radius: 20px;
          opacity: 1;
          height: 100%;
          overflow: hidden;
        }

        .video-wrapper {
          opacity: 1;
          width: 100%;
          height: 100%;
        }

        .video-wrapper video {
          cursor: auto;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          display: block;
          object-fit: cover;
          background-color: rgba(0, 0, 0, 0);
          object-position: 50% 50%;
        }

        @media (max-width: 768px) {
          .carousel-item {
            width: 300px;
            height: 530px;
          }

          .perspective-container {
            perspective: 1000px;
          }
        }

        @media (max-width: 480px) {
          .carousel-inner {
            padding-top: 0px !important;
          }
          .carousel-item {
            width: 300px;
            height: 450px;
          }

          .perspective-container {
            perspective: 800px;
          }

          .carousel-container {
            mask-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.15) 0%,
              rgb(0, 0, 0) 15%,
              rgb(0, 0, 0) 85%,
              rgba(0, 0, 0, 0.15) 100%
            );
            height: 90vh;
          }
        }
      `}</style>
    </section>
  );
}
