"use client";

import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

import usp1 from "@/assets/usp/product-1.webp";
import usp2 from "@/assets/usp/product-2.webp";
import usp3 from "@/assets/usp/product-3.webp";
import usp4 from "@/assets/usp/product-4.webp";
import usp5 from "@/assets/usp/product-5.webp";
import usp6 from "@/assets/usp/product-6.webp";
import usp7 from "@/assets/usp/product-7.webp";

// TypeScript interface for image data
interface MarqueeImage {
  id: number;
  src: StaticImageData;
  alt: string;
  href: string;
}

// Sample images data - replace with your actual images
const images: MarqueeImage[] = [
  {
    id: 1,
    src: usp1,
    alt: "Kemei Professionals USP 1",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-1015-10-in-1-grooming-kit",
  },
  {
    id: 2,
    src: usp2,
    alt: "Kemei Professionals USP 2",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-1397-4-in-1-hair-beauty-styler",
  },
  {
    id: 3,
    src: usp3,
    alt: "Kemei Professionals USP 3",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-1627-professional-hair-clipper",
  },
  {
    id: 4,
    src: usp4,
    alt: "Kemei Professionals USP 4",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-1637-all-in-one-multi-grooming-kit",
  },
  {
    id: 5,
    src: usp5,
    alt: "Kemei Professionals USP 5",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-1731-professional-hair-clipper",
  },
  {
    id: 6,
    src: usp6,
    alt: "Kemei Professionals USP 6",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-205-rechargeable-hair-remover",
  },
  {
    id: 7,
    src: usp7,
    alt: "Kemei Professionals USP 7",
    href: "https://kemei-professionals.myshopify.com/products/kemei-km-275-5-in-1-rechargeable-grooming-kit",
  },
];

const HorizontalMarquee: React.FC = () => {
  return (
    <div className="w-full py-12 md:py-10 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {/* First set of images */}
          {images.map((image) => (
            <div
              key={`first-${image.id}`}
              className="marquee-item flex-shrink-0 mx-4 md:mx-4"
            >
              <a
                href={image.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </a>
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {images.map((image) => (
            <div
              key={`second-${image.id}`}
              className="marquee-item flex-shrink-0 mx-4 md:mx-6"
            >
              <a
                href={image.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Responsive speed adjustments */
        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
};

export default HorizontalMarquee;
