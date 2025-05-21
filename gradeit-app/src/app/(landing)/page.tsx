"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { SiteHeader } from "../_components/landing/site-header";
import { Footer } from "../_components/landing/footer";
import { Button } from "../_components/ui/button";
import { HeroCarousel } from "../_components/landing/hero-carousel";
import HeroSection from "../_components/landing/sections/hero-section";
import FeaturesSection from "../_components/landing/sections/features-section";
import EducatorsSection from "../_components/landing/sections/educators-section";
import StudentsSection from "../_components/landing/sections/students-section";
import WorkflowSection from "../_components/landing/sections/workflow-section";
import StatsSection from "../_components/landing/sections/stats-section";
import CTASection from "../_components/landing/sections/cta-section";
import {
  educatorFeatures,
  educatorSteps,
  featureCards,
  stats,
  studentFeatures,
  studentSteps,
} from "@/config/landingPageData";

const AnimatedSection = ({ children, delay = 0, className = "" }:any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggeredItem = ({ children, index = 0 }:any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.1 + index * 0.1,
      }}
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage = ({ src, alt, width, height, className = "" }:any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className="w-full object-cover"
        />
      </motion.div>
    </div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-col justify-center">
        <HeroSection
          heroOpacity={heroOpacity}
          heroY={heroY}
          HeroCarousel={HeroCarousel}
          AnimatedSection={AnimatedSection}
          motion={motion}
          ChevronRight={ChevronRight}
        />

        <FeaturesSection
          features={featureCards}
          AnimatedSection={AnimatedSection}
          StaggeredItem={StaggeredItem}
        />

        <EducatorsSection
          features={educatorFeatures}
          AnimatedSection={AnimatedSection}
          ParallaxImage={ParallaxImage}
          motion={motion}
        />


        <StudentsSection
          features={studentFeatures}
          AnimatedSection={AnimatedSection}
          ParallaxImage={ParallaxImage}
          motion={motion}
        />

        <WorkflowSection
          educatorSteps={educatorSteps}
          studentSteps={studentSteps}
          AnimatedSection={AnimatedSection}
          StaggeredItem={StaggeredItem}
          motion={motion}
        />


        <StatsSection
          stats={stats}
          AnimatedSection={AnimatedSection}
          motion={motion}
        />

        <CTASection
          AnimatedSection={AnimatedSection}
          Button={Button}
          ArrowRight={ArrowRight}
        />
      </main>
      <Footer />
    </div>
  );
}