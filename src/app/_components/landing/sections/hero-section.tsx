"use client";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useScroll, useTransform, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import HeroCarousel from "../hero-carousel";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 flex justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0"></div>
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 opacity-[0.03]"
        ></motion.div>
      </div>

      <div className="container relative z-10 px-6">
        <motion.div
          style={{ y: heroY }}
          className="mx-auto max-w-3xl text-center mb-40"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-marine-600 text-white dark:text-marine-900 px-4 py-1.5 text-sm font-medium transition-colors">
              Automated Lab Grading
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Simplify coding education with{" "}
            <span className="font-semibold">gradeIT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl"
          >
            A thoughtfully designed platform for universities to automate
            computer lab grading and streamline programming assignments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {/* Primary Button */}
            <Button
              size="lg"
              className="h-12 px-8 transition-all bg-primary-button text-primary-button-foreground hover:bg-primary-button-hover"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Secondary Button */}
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 transition-all border-marine-500 text-secondary-button-foreground hover:bg-secondary-button-hover hover:text-marine-900"
            >
              <Link href="/classes">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="overflow-hidden">
            <HeroCarousel className="w-full max-w-[900px] aspect-[4/3] sm:aspect-[16/9] mx-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
