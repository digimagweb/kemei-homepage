"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";
import kemeiLogo from "@/assets/logo/kemei-logo.png";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    leftColumn: [
      { label: "Home", href: "/" },
      {
        label: "Shop",
        href: "https://kemei-professionals.myshopify.com/collections",
      },
      {
        label: "All Products",
        href: "https://kemei-professionals.myshopify.com/collections/all",
      },
      {
        label: "About Us",
        href: "https://kemei-professionals.myshopify.com/pages/about-us",
      },
      // {
      //   label: "Contact",
      //   href: "https://kemei-professionals.myshopify.com/pages/contact",
      // },
    ],
    rightColumn: [
      { label: "Privacy Policy", href: "https://kemei-professionals.myshopify.com/policies/privacy-policy" },
      { label: "Refund Policy", href: "https://kemei-professionals.myshopify.com/policies/refund-policy" },
      { label: "Shipping Policy", href: "https://kemei-professionals.myshopify.com/policies/shipping-policy" },
      { label: "Terms of Service", href: "https://kemei-professionals.myshopify.com/policies/terms-of-service" },
    ],
  };

  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Main Content - All in one row */}
        <div className={styles.mainContent}>
          {/* Left Section - Logo & Copyright */}
          <div className={styles.leftSection}>
            {/* Brand Logo */}
            <Image
              src={kemeiLogo}
              alt="Kemei Professionals"
              className={styles.brandLogo}
              priority
            />

            <p className={styles.tagline}>
              Premium Grooming Tools. Authentic Products. Trusted Warranty.
            </p>

            {/* Social Icons */}
            <div className={styles.socialIcons}>
              <a
                href="https://www.facebook.com/KEMEIPROFESSIONALS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/kemei_professionals/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Middle Section - Links */}
          <div className={styles.middleSection}>
            <div className={styles.linksGrid}>
              {/* Left Column Links */}
              <div className={styles.linksColumn}>
                {footerLinks.leftColumn.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  const isHome = link.href === "/";
                  const isAnchor = link.href.startsWith("#");

                  return (
                    <button
                      key={link.label}
                      className={styles.footerLink}
                      onClick={() => {
                        // 1️⃣ External links
                        if (isExternal) {
                          window.open(
                            link.href,
                            "_blank",
                            "noopener,noreferrer",
                          );
                          return;
                        }

                        // 2️⃣ Home link
                        if (isHome) {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          return;
                        }

                        // 3️⃣ In-page anchor
                        if (isAnchor) {
                          handleScrollTo(link.href);
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>

              {/* Right Column Links */}
              <div className={styles.linksColumn}>
                {footerLinks.rightColumn.map((link) => {
                  if (link.href.startsWith("#")) {
                    return (
                      <button
                        key={link.label}
                        className={styles.footerLink}
                        onClick={() => handleScrollTo(link.href)}
                      >
                        {link.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={styles.footerLink}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Section - Description */}
          <div className={styles.rightSection}>
            <h4 className={styles.contactTitle}>Contact</h4>

            <ul className={styles.contactList}>
              <li>
                <span>📍</span>
                Kapadia Complex, 33 Sarang Street, 6th Floor, 604, Mumbai –
                400003
              </li>

              <li>
                <span>📞</span>
                <a href="tel:+918104108528">+91 81041 08528</a>
              </li>

              <li>
                <span>✉️</span>
                <a href="mailto:kemeiprofessionals@gmail.com">
                  kemeiprofessionals@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8 max-[500px]:text-center">
        <p>
          Copyright © 2026 Kemei Professionals All rights reserved | Developed
          by DigiMag
        </p>
      </div>
    </footer>
  );
};

export default Footer;
