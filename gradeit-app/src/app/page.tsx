"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "./_components/landing/site-header";
import { Footer } from "./_components/landing/footer";
import {
  Code,
  CheckCircle,
  Users,
  Shield,
  ChevronRight,
  ArrowRight,
  BookOpen,
  FileCode,
  CheckSquare,
} from "lucide-react";
import Image from "next/image";
import { TestimonialCard } from "./_components/landing/testimonial-card";
import { FeatureCard } from "./_components/landing/feature-card";
import { ProcessStep } from "./_components/landing/process-step";
import { Button } from "./_components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-col justify-center">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20 md:py-32 flex justify-center">
          <div className="container">
            <div className="absolute inset-0 z-0 opacity-30">
              <svg className="h-full w-full" viewBox="0 0 800 800">
                <defs>
                  <pattern
                    id="grid"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="none"
                      stroke="rgba(100, 116, 240, 0.1)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="container relative z-10 ">
              <div className="mx-auto max-w-4xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    Next-Gen Learning Platform
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                >
                  Empower Learning, Automate Grading,{" "}
                  <span className="text-primary">
                    Simplify Coding Assignments
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 text-lg text-muted-foreground md:text-xl"
                >
                  A comprehensive platform designed for educators and students
                  to streamline the coding education experience with powerful
                  tools and real-time feedback.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button size="lg" className="h-12 px-8">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-lg border shadow-xl"
            >
              <Image
                src="/placeholder.svg?height=600&width=1200"
                width={1200}
                height={600}
                alt="Platform Dashboard"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 flex justify-center" id="features">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Powerful Features for Modern Coding Education
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform combines cutting-edge technology with intuitive
                design to create the ultimate coding education experience.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 mx-auto max-w-7xl">
              <FeatureCard
                icon={Code}
                title="Integrated Code Editor"
                description="Supports multiple languages, syntax highlighting, and intelligent auto-completion for a seamless coding experience."
              />
              <FeatureCard
                icon={CheckCircle}
                title="Automated Grading"
                description="Execute test cases, detect plagiarism, and provide real-time feedback to students with detailed insights."
              />
              <FeatureCard
                icon={Users}
                title="Live Collaboration"
                description="Track student progress in real-time with WebSocket-powered updates and interactive monitoring tools."
              />
              <FeatureCard
                icon={Shield}
                title="Secure & Scalable"
                description="Role-based access control with a robust backend powered by PostgreSQL/MongoDB and Prisma ORM."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted py-20 flex justify-center">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A streamlined process for both educators and students
              </p>
            </div>

            <div className="mt-16">
              <h3 className="mb-8 text-center text-xl font-semibold">
                For Educators
              </h3>
              <div className="grid gap-4 md:grid-cols-3 mx-auto max-w-5xl">
                <ProcessStep
                  number="01"
                  icon={BookOpen}
                  title="Create a Classroom"
                  description="Set up your virtual classroom in minutes with customizable settings and branding."
                />
                <ProcessStep
                  number="02"
                  icon={FileCode}
                  title="Assign Coding Problems"
                  description="Create or import coding assignments with test cases and detailed instructions."
                />
                <ProcessStep
                  number="03"
                  icon={CheckSquare}
                  title="Monitor & Grade"
                  description="Track student progress in real-time and review auto-graded submissions."
                />
              </div>

              <div className="my-12 flex justify-center">
                <div className="h-px w-24 bg-border"></div>
              </div>

              <h3 className="mb-8 text-center text-xl font-semibold">
                For Students
              </h3>
              <div className="grid gap-4 md:grid-cols-3 mx-auto max-w-5xl">
                <ProcessStep
                  number="01"
                  icon={Users}
                  title="Join a Class"
                  description="Enter a class code or accept an invitation to join your instructor's classroom."
                />
                <ProcessStep
                  number="02"
                  icon={Code}
                  title="Solve Coding Problems"
                  description="Write and test your code in our powerful integrated development environment."
                />
                <ProcessStep
                  number="03"
                  icon={CheckCircle}
                  title="Get Instant Feedback"
                  description="Receive immediate feedback on your code with detailed explanations and suggestions."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 flex justify-center">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Trusted by Educators and Students
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See what our users have to say about their experience
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
              <TestimonialCard
                quote="This platform has revolutionized how I teach programming. The automated grading saves me hours each week."
                author="Dr. Sarah Johnson"
                role="Computer Science Professor"
                avatarSrc="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The instant feedback on my code has helped me improve faster than any other learning method I've tried."
                author="Michael Chen"
                role="Computer Engineering Student"
                avatarSrc="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="We've implemented this across our entire CS department with fantastic results. Student engagement is up 40%."
                author="Prof. David Miller"
                role="Department Chair, Tech University"
                avatarSrc="/placeholder.svg?height=100&width=100"
              />
            </div>

            <div className="mt-16 rounded-lg border bg-card p-8 shadow-sm mx-auto max-w-5xl">
              <div className="grid gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-primary">500+</span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    Educational Institutions
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-primary">
                    50,000+
                  </span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    Active Students
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-primary">1M+</span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    Assignments Completed
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-primary">20+</span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    Programming Languages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground flex justify-center">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Transform Your Coding Classroom?
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Join thousands of educators and students who are already
                experiencing the benefits of our platform.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-primary"
                >
                  Start For Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="mt-6 text-sm opacity-80">
                No credit card required. Free plan includes up to 30 students
                and basic features.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
