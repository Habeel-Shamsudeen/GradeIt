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
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full hero-color-background px-4 py-1.5 text-sm font-medium">
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
            <Button
              size="lg"
              className="h-12 px-8 button-primary transition-all"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 button-secondary transition-all"
            >
              <Link href={"/classes"}>Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm bg-card/90 border border-border">
            <HeroCarousel className="w-full h-64" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
