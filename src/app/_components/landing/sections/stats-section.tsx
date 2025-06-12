"use client";
import { stats } from "@/config/landingPageData";
import AnimatedSection from "../../animations/AnimatedSection";
import StaggeredItem from "../../animations/StaggeredItem";
import { motion } from "framer-motion";

export default function StatsSection() {
  return (
    <section className="py-24 flex justify-center bg-background">
      <div className="container px-6">
        <AnimatedSection>
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-border bg-secondary p-12 shadow-lg">
              <div className="grid gap-8 md:grid-cols-4">
                {stats.map((stat: any, index: number) => (
                  <StaggeredItem key={index} index={index}>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      className="text-4xl font-medium text-foreground hero-color"
                    >
                      {stat.value}
                    </motion.span>
                    <span className="mt-2 text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </StaggeredItem>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
