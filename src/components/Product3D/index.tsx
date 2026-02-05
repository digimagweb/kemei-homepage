"use client";

import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

/* =======================
   TYPES
======================= */
interface USP {
  id: number;
  label: string;
  title: string;
  description: string;
  angle: number;
}

interface ModelProps {
  modelPath: string;
  mousePos: { x: number; y: number };
  isHovering: boolean;
  setHover: (v: boolean) => void;
  setMousePos: (v: { x: number; y: number }) => void;
}
const isIOS =typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
/* =======================
   DATA
======================= */
const usps: USP[] = [
  {
    id: 1,
    label: "Premium",
    title: "Premium Build Quality",
    description:
      "Crafted with durable materials and reinforced components designed to last. Every Kemei tool undergoes strict quality checks for reliable, long-term performance.",
    angle: 0,
  },
  {
    id: 2,
    label: "User-Friendly",
    title: "Ergonomic & User-Friendly Design",
    description:
      "Lightweight, easy to hold, and built for effortless handling. Designed for comfort during daily grooming with smooth, controlled use.",
    angle: 288,
  },
  {
    id: 3,
    label: "Skin-Friendly",
    title: "Safe & Skin-Friendly Use",
    description:
      "All products are made to care for skin and hair gently and safely. Heat, blades, or contact surfaces are engineered to minimise irritation and protect your skin.",
    angle: 216,
  },
  {
    id: 4,
    label: "Efficient",
    title: "Efficient Performance",
    description:
      "Built for smooth, quick, and effective results. Whether it's trimming, styling, or drying, Kemei tools deliver consistency every time.",
    angle: 144,
  },
  {
    id: 5,
    label: "Easy Maintenance",
    title: "Easy Maintenance & Cleaning",
    description:
      "Designed for hassle-free care and upkeep. Detachable or easy-wipe components ensure hygiene and longer product life.",
    angle: 72,
  },
];

/* =======================
   3D MODEL
======================= */
const Model: React.FC<ModelProps> = ({
  modelPath,
  mousePos,
  isHovering,
  setHover,
  setMousePos,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const float = useRef(0);

  const baseYOffset = useRef(0);
  const baseXOffset = useRef(0);


  // const animationFrameId = useRef<number>();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // 1. Rotate first - horizontal at 45 degree angle, flipped to show front
    scene.rotation.set(-Math.PI / 2, 0, Math.PI / 4 + Math.PI);

    // 2. Scale
    const boxBefore = new THREE.Box3().setFromObject(scene);
    const size = boxBefore.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(6 / maxDim);

    // 3. Recompute box AFTER transforms
    const boxAfter = new THREE.Box3().setFromObject(scene);
    const center = boxAfter.getCenter(new THREE.Vector3());
    const sizeAfter = boxAfter.getSize(new THREE.Vector3());

    // 4. True centering
    scene.position.set(-center.x, -center.y, -center.z);
    baseYOffset.current = 0; // Keep centered vertically
    baseXOffset.current = 0; // Keep centered horizontally
  }, [scene]);

  // iOS detection (safe)
  

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (isIOS && ScrollTrigger.isScrolling()) return;
    if (isHovering) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.8,
        0.1,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mousePos.y * 0.5,
        0.1,
      );
    } else {
      float.current += delta;
      groupRef.current.position.y =
        baseYOffset.current + Math.sin(float.current) * 0.05;
      groupRef.current.position.x = baseXOffset.current;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0,
        0.05,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        0.05,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Invisible interaction plane */}
      <mesh
        position={[0, 0, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => {
          setHover(false);
          setMousePos({ x: 0, y: 0 });
        }}
        onPointerMove={(e) => {
          const x = e.point.x;
          const y = e.point.y;

          setMousePos({
            x: THREE.MathUtils.clamp(x * 0.8, -1, 1),
            y: THREE.MathUtils.clamp(y * 0.6, -1, 1),
          });
        }}
      >
        {/* Big enough to cover the model */}
        <boxGeometry args={[2, 4, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Actual model */}
      <primitive object={scene} />
    </group>
  );
};

/* =======================
   RESPONSIVE CONFIG
======================= */
const RESPONSIVE_CONFIG = {
  // Very large laptop (1440px+)
  xlLaptop: {
    containerHeight: "100vh",
    textBlock: {
      top: "2.5rem",
      right: "2.5rem",
      padding: "1.25rem",
      maxWidth: "25rem",
      titleSize: "1.5rem",
      descriptionSize: "0.9rem",
    },
    canvas: {
      maxWidth: "280px",
      height: "500px",
      cameraPosition: [6, 1, 6] as [number, number, number],
      fov: 45,
    },
    circle: {
      width: 580,
      height: 580,
      labelPadding: "1rem 1.75rem",
      labelFontSize: "1rem",
    },
  },
  // Large laptop (1280px - 1439px)
  laptop: {
    containerHeight: "100vh",
    textBlock: {
      top: "1rem",
      right: "1rem",
      padding: "1.1rem",
      maxWidth: "22rem",
      titleSize: "1.1rem ",
      descriptionSize: "0.8rem",
    },
    canvas: {
      maxWidth: "250px",
      height: "400px",
      cameraPosition: [6, 1, 6] as [number, number, number],
      fov: 45,
    },
    circle: {
      width: 420,
      height: 420,
      labelPadding: "0.875rem 1.5rem",
      labelFontSize: "0.95rem",
    },
  },
  // Tablet (768px - 1279px)
  tablet: {
    containerHeight: "100vh",
    textBlock: {
      top: "1rem",
      right: "1rem",
      padding: "1rem",
      maxWidth: "17rem",
      titleSize: "1.05rem",
      descriptionSize: "0.7rem",
    },
    canvas: {
      maxWidth: "200px",
      height: "300px",
      cameraPosition: [5, 1, 5] as [number, number, number],
      fov: 45,
    },
    circle: {
      width: 350,
      height: 350,
      labelPadding: "0.75rem 1.25rem",
      labelFontSize: "0.875rem",
    },
  },
  // Mobile XL (425px - 767px)
  mobileXL: {
    containerHeight: "100dvh",
    textBlock: {
      top: "1rem",
      right: "auto",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "1.25rem",
      maxWidth: "25rem",
      titleSize: "1.05rem",
      descriptionSize: "0.7rem",
      textAlign: "center",
      width: "90%",
    },
    canvas: {
      maxWidth: "115px",
      height: "220px",
      cameraPosition: [4, 0, 4] as [number, number, number],
      fov: 50,
    },
    circle: {
      width: 320,
      height: 320,
      labelPadding: "0.625rem 1rem",
      labelFontSize: "0.8125rem",
    },
  },
  // Mobile L (375px - 424px)
  mobileL: {
    containerHeight: "100dvh",
    textBlock: {
      top: "1rem",
      right: "auto",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "1rem",
      maxWidth: "20rem",
      titleSize: "1.05rem",
      descriptionSize: "0.7rem",
      textAlign: "center",
      width: "90%",
    },
    canvas: {
      maxWidth: "160px",
      height: "280px",
      cameraPosition: [3.5, 1, 3.5] as [number, number, number],
      fov: 50,
    },
    circle: {
      width: 280,
      height: 280,
      labelPadding: "0.5rem 0.875rem",
      labelFontSize: "0.75rem",
    },
  },
  // Mobile S (320px - 374px)
  mobileS: {
    containerHeight: "100dvh",
    textBlock: {
      top: "1rem",
      right: "auto",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "1rem",
      maxWidth: "18rem",
      titleSize: "1.05rem",
      descriptionSize: "0.7rem",
      textAlign: "center",
      width: "90%",
    },
    canvas: {
      maxWidth: "140px",
      height: "140px",
      cameraPosition: [3, 1, 3] as [number, number, number],
      fov: 50,
    },
    circle: {
      width: 240,
      height: 240,
      labelPadding: "0.5rem 0.75rem",
      labelFontSize: "0.6875rem",
    },
  },
};

/* =======================
   COMPONENT
======================= */
export default function RotatingUSPShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [breakpoint, setBreakpoint] =
    useState<keyof typeof RESPONSIVE_CONFIG>("laptop");

  const modelPath = "/models/barbeador_trimmer.glb";

  // Detect breakpoint on mount and resize
  useEffect(() => {
    const updateBreakpoint = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;

      if (width >= 1440) {
        setBreakpoint("xlLaptop");
      } else if (width >= 1024) {
        setBreakpoint("laptop");
      } else if (width >= 768) {
        setBreakpoint("tablet");
      } else if (width >= 425) {
        setBreakpoint("mobileXL");
      } else if (width >= 375) {
        setBreakpoint("mobileL");
      } else {
        setBreakpoint("mobileS");
      }
    };

    setIsMounted(true);
    updateBreakpoint();

    const handleResize = () => {
      updateBreakpoint();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // @ts-ignore
  const config = RESPONSIVE_CONFIG[breakpoint];

  /* =======================
     SCROLL LOGIC - FIXED with proper cleanup
  ======================= */
  useEffect(() => {
    if (!isMounted || typeof document === "undefined") return;

    const container = containerRef.current;
    const circle = circleRef.current;

    // Check if elements exist
    if (!container || !circle) {
      console.warn("Container or circle element not found");
      return;
    }

    // Force a reflow to ensure DOM is ready
    container.getBoundingClientRect();

    const total = usps.length;
    const triggers: ScrollTrigger[] = [];

    try {
      // Create main scroll trigger with error handling
      const mainTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${total * 100}%`,
        pin: true,
        scrub: isIOS ? 0.8 : 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.isActive) {
            const index = Math.min(
              total - 1,
              Math.floor(self.progress * total),
            );
            if (index !== activeIndexRef.current) {
              activeIndexRef.current = index;
              setActiveIndex(index);
            }
          }
        },
        invalidateOnRefresh: true,
      });

      if (mainTrigger) triggers.push(mainTrigger);

      // Rotate circle
      const circleTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${total * 100}%`,
        scrub: isIOS ? 0.8 : 1,
        onUpdate: (self) => {
          if (circle && self.isActive) {
            const rotation = self.progress * 360;
            circle.style.transform = `rotate(${rotation}deg)`;
          }
        },
        invalidateOnRefresh: true,
      });

      if (circleTrigger) triggers.push(circleTrigger);

      // Counter-rotate labels to keep them upright
      labelsRef.current.forEach((label, i) => {
        if (label) {
          const labelTrigger = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: `+=${total * 100}%`,
            scrub: isIOS ? 0.8 : 1,
            onUpdate: (self) => {
              if (label && self.isActive) {
                const rotation = -self.progress * 360;
                label.style.transform = `rotate(${rotation}deg)`;
              }
            },
            invalidateOnRefresh: true,
          });

          if (labelTrigger) triggers.push(labelTrigger);
        }
      });

      // Refresh ScrollTrigger after setup
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } catch (error) {
      console.error("Error creating ScrollTriggers:", error);
    }

    // Cleanup function
    return () => {
      triggers.forEach((t) => t.kill());
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    };
  }, [isMounted]); // activeIndex shouldn't trigger re-init

  /* =======================
     MOUSE TILT
  ======================= */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
      y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
    });
  }, []);

  const currentUSP = usps[activeIndex];

  /* =======================
     HANDLE WINDOW RESIZE
  ======================= */
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      // Refresh ScrollTrigger on resize
      setTimeout(() => {
        if (ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMounted]);

  // Don't render until mounted
  if (!isMounted) {
    return (
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: config.containerHeight }}
    >
      {/* TEXT BLOCK */}
      <div
        className="absolute z-20 rounded-2xl text-white backdrop-blur-md bg-white/10 border border-white/20"
        style={{
          top: config.textBlock.top,
          right: config.textBlock.right,
          left: (config.textBlock as any).left,
          transform: (config.textBlock as any).transform,
          padding: config.textBlock.padding,
          maxWidth: config.textBlock.maxWidth,
          width: (config.textBlock as any).width,
          textAlign: (config.textBlock as any).textAlign
        }}
      >
        <h3
          className="font-semibold mb-3 md:mb-4 leading-tight"
          style={{ fontSize: config.textBlock.titleSize }}
        >
          {currentUSP.title}
        </h3>
        <p
          className="opacity-80 leading-relaxed"
          style={{ fontSize: config.textBlock.descriptionSize }}
        >
          {currentUSP.description}
        </p>
      </div>

      {/* CENTER SECTION */}
      <div className="relative h-full flex items-center justify-center">
        <div className="relative h-full flex items-center justify-center w-full">
          {/* 3D Model Canvas */}
          <div
            className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: config.canvas.maxWidth,
              height: config.canvas.height,
            }}
          // onMouseEnter={() => setHover(true)}
          // onMouseLeave={() => {
          //   setHover(false);
          //   setMousePos({ x: 0, y: 0 });
          // }}
          // onMouseMove={handleMouseMove}
          >
            <Canvas
              camera={{
                position: config.canvas.cameraPosition,
                fov: config.canvas.fov,
              }}
              dpr={isIOS ? 1 : [1, 2]}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[4, 6, 4]}
                intensity={breakpoint.includes("mobile") ? 1.2 : 1.4}
              />
              <Suspense fallback={null}>
                <Model
                  modelPath={modelPath}
                  mousePos={mousePos}
                  isHovering={hover}
                  setHover={setHover}
                  setMousePos={setMousePos}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* ROTATING CIRCLE */}
          <div
            ref={circleRef}
            className="absolute rounded-full border border-white/30 pointer-events-none transition-all duration-300"
            style={{
              width: `${config.circle.width}px`,
              height: `${config.circle.height}px`,
              transform: "rotate(0deg)",
            }}
          >
            {usps.map((usp, i) => {
              const r = config.circle.width / 2;
              const rad = (usp.angle * Math.PI) / 180;
              const x = Math.sin(rad) * r;
              const y = -Math.cos(rad) * r;

              return (
                <div
                  key={usp.id}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}
                >
                  <div
                    ref={(el) => {
                      if (el) labelsRef.current[i] = el;
                    }}
                    className={`rounded-full font-medium transition-all duration-300 whitespace-nowrap transform backdrop-blur-sm border text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl ${i === activeIndex
                      ? "glass-card scale-100 bg-white/20 backdrop-blur-md border border-white/30"
                      : "glass-card opacity-60 bg-white/10 backdrop-blur-sm border border-white/10"
                      }`}
                    style={{
                      padding: config.circle.labelPadding,
                      // fontSize: config.circle.labelFontSize,
                    }}
                  >
                    {usp.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE INDICATOR */}
      <div
        className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 ${breakpoint.includes("mobile") ? "block" : "hidden"
          }`}
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-xs mb-1">Scroll</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* STYLES */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        /* Prevent flash of unstyled content */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        section {
          animation: fadeIn 0.3s ease-out;
        }

        /* Better mobile touch handling */
        @media (max-width: 767px) {
          canvas {
            touch-action: pan-y;
          }
        }
        @supports (-webkit-touch-callout: none) {
          .glass-card {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}

