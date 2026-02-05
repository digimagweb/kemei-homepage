import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection/video-section";
import FloatingLines from "@/components/Background/floatinglines";
import ScrollFeatureSection from "@/components/ProductCategory/index-2";
import HorizontalMarquee from "@/components/ImageMarquee";
import RotatingUSPShowcase from "@/components/Product3D";
import InstagramReels from "@/components/InstagramReels/InstagramReels"; // ADD THIS
// import dynamic from "next/dynamic";
// const FloatingLines = dynamic(
//   () => import("@/components/Background/floatinglines"),
//   { ssr: false }
// );

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Effects - Cover entire page including footer */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-grow">
        {/* Home Section */}
        <section id="home" className="relative min-h-screen">
          <HeroSection />
        </section>

        {/* Token Section */}
        <section id="video" className="relative min-h-screen">
          <div className="h-[20vh]"></div>
          <VideoSection
            videoSrc="/kemei_web_banner.mp4"
            title="Experience the Power of Professional Grooming"
            subtitle="Discover our range of high-quality grooming products designed for excellence."
          />
        </section>

        {/* Ecosystem Section */}
        <section id="shop" className="relative min-h-screen">
          {/* <div className="h-[20vh]"></div> */}
          <HorizontalMarquee />
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="relative min-h-screen">
          <ScrollFeatureSection />
        </section>

        {/* Team Section */}
        <section id="usp" className="relative min-h-screen">
          <RotatingUSPShowcase />
        </section>

        {/* Instagram Reels Section - ADD THIS */}
        <section id="testimonials" className="relative md:min-h-screen">
          <InstagramReels />
        </section>
      </main>

      {/* Footer - With background effect behind it */}
      <Footer />
    </div>
  );
}
