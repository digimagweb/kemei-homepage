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

  // Track if a video is manually controlled (clicked)
  const manualControlId = useRef<number | null>(null);

  // Helper to normalize angle to -180 to 180
  const normalizeAngle = (angle: number) => {
    let normalized = angle % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    return normalized;
  };

  // Track play promises to avoid race conditions
  const playPromises = useRef<Record<number, Promise<void> | null>>({});
  // Track WHEN the promise started, so we can clear stuck ones
  const promiseTimestamps = useRef<Record<number, number>>({});
  const tickCount = useRef(0);

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

      // FORCE PLAYBACK: Keep all videos playing as requested by user
      // Watchdog style: Check every 20 frames (~330ms)
      tickCount.current++;

      if (tickCount.current % 20 === 0) {
        const now = Date.now();
        circularItems.forEach((item, index) => {
          const video = videoRefs.current[index];
          if (!video) return;

          // Only auto-manage if not manually controlled
          if (manualControlId.current === null) {

            // 1. CLEAR STUCK PROMISES
            // If we have a promise but it's older than 2 seconds, assume it's stuck/ignored
            if (playPromises.current[index] && promiseTimestamps.current[index]) {
              if (now - promiseTimestamps.current[index] > 2000) {
                // Force clear the stuck promise
                playPromises.current[index] = null;
                promiseTimestamps.current[index] = 0;
              }
            }

            // 2. CHECK & PLAY
            // Only try if paused AND (no active promise OR we just cleared it)
            if (video.paused && !playPromises.current[index]) {
              // Only play if we have enough data (HAVE_FUTURE_DATA = 3)
              // trying to play an unconnected/empty video causes errors
              if (video.readyState >= 3) {
                const promise = video.play();
                if (promise !== undefined) {
                  playPromises.current[index] = promise;
                  promiseTimestamps.current[index] = now;

                  promise
                    .then(() => {
                      playPromises.current[index] = null;
                      promiseTimestamps.current[index] = 0;
                    })
                    .catch(() => {
                      playPromises.current[index] = null;
                      promiseTimestamps.current[index] = 0;
                    });
                }
              }
            }
          }
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
    isDragging.current = true;
    allowAutoRotate.current = false;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;

    if (ringRef.current) {
      gsap.set(ringRef.current, { cursor: "grabbing" });
    }

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

    rotationY.current += deltaX * 0.3;

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

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el;
    // Don't auto-play here, let the loop handle it
  };

  const handleVideoClick = (clickedId: number) => {
    // Toggle manual control
    // If clicking the same video, exit manual control (resume auto behavior)
    // If clicking a new video, enter manual control for that video

    // Check if we are already in manual mode for this video
    // (Note: clickedId is item.id, we need to map to index or just use the loop)

    // Find the index for this clickedId to check ref
    const index = circularItems.findIndex(item => item.id === clickedId);

    // If we are already controlling a video, reset everything first?
    // Let's implement simple logic: Click to unmute/view, click again or click background to reset?
    // For now: Click focuses this video.

    manualControlId.current = clickedId;

    Object.entries(videoRefs.current).forEach(([idxStr, video]) => {
      if (!video) return;
      const idx = Number(idxStr);
      const item = circularItems[idx];

      if (item.id === clickedId) {
        video.muted = false;
        video.controls = true;
        video.play().catch(() => { });
      } else {
        video.muted = true;
        video.controls = false;
        // In manual mode, maybe pause others to save resources?
        // Or keep them playing if user wants "all playing"
        // Let's keep visible ones playing logic, but since we set manualControlId,
        // the loop won't touch them. We should probably pause them here if we want max performance,
        // OR we just let them be. The user wants "all playing".
        // Let's ensuring they are playing if they were visible, but mute them.
        video.play().catch(() => { });
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
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
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
          /* cursor: grab; REMOVED to allow normal cursor on background */
          user-select: none;
          position: relative;
          background-color: transparent;
          touch-action: pan-y; /* ALLOW vertical scroll on background */
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
          cursor: grab; /* Cursor on item */
          touch-action: pan-y; /* Allow vertical scroll, horizontal triggers drag (via JS) */
        }
        
        .carousel-item:active {
           cursor: grabbing;
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
          .carousel-section {
            min-height: auto !important;
            height: auto !important;
            padding-bottom: 0px !important; /* Remove padding */
            align-items: flex-start !important; /* Move items to top if possible */
          }

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
            height: 460px; /* Tightly fit 450px card */
            margin-top: 0px; 
          }
        }

        @media (max-width: 430px) {
           .carousel-container {
             height: 380px !important; /* Force even smaller height for <430px */
             margin-top: 60px !important; 
           }
        }
      `}</style>
    </section>
  );
}
