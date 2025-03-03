"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion"
import { SiteHeader } from "../_components/landing/site-header"
import { Footer } from "../_components/landing/footer"
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
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { FeatureCard } from "../_components/landing/feature-card"
import { ProcessStep } from "../_components/landing/process-step"
import { Button } from "../_components/ui/button"
import { FeatureHighlight } from "../_components/landing/feature-highlight"

// Animated section component that triggers when scrolled into view
const AnimatedSection = ({ children, delay = 0, className = "" }:any) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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
            delay: delay 
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered item animation for lists/grids
const StaggeredItem = ({ children, index = 0 }:any) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? 
        { opacity: 1, y: 0 } : 
        { opacity: 0, y: 20 }
      }
      transition={{ 
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.1 + index * 0.1 
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax image component
const ParallaxImage = ({ src, alt, width, height, className = "" }:any) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

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
  )
}

export default function Home() {
  // For hero section parallax effect
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY = useTransform(scrollY, [0, 300], [0, 100])
  
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAFAF8]">
      <SiteHeader />
      <main className="flex-col justify-center">
        {/* Hero Section with Parallax */}
        <section className="relative overflow-hidden py-24 md:py-32 flex justify-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#F0EFEA] to-[#FAFAF8]"></div>
            <motion.div 
              style={{ opacity: heroOpacity }}
              className="absolute inset-0 opacity-[0.03]"
            >
              {/* <svg className="h-full w-full" viewBox="0 0 800 800">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg> */}
            </motion.div>
          </div>

          <div className="container relative z-10 px-6">
            <motion.div 
              style={{ y: heroY }}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-block rounded-full bg-[#F1E6D0] px-4 py-1.5 text-sm font-medium text-[#3A3935]">
                  Automated Lab Grading
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl font-medium tracking-tight text-[#141413] md:text-5xl lg:text-6xl"
              >
                Simplify coding education with <span className="font-semibold">gradeIT</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg text-[#605F5B] md:text-xl"
              >
                A thoughtfully designed platform for universities to automate computer lab grading and streamline
                programming assignments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Button size="lg" className="h-12 px-8 bg-[#141413] text-white hover:bg-[#23241F] transition-all">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-[#C4C3BB] text-[#3A3935] hover:bg-[#F0EFEA] transition-all"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Parallax hero image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative mx-auto mt-20 max-w-5xl"
            >
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-sm bg-white/90 border border-[#E6E4DD]">
                <ParallaxImage
                  src="/placeholder.svg?height=600&width=1200"
                  width={1200}
                  height={600}
                  alt="gradeIT Dashboard"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#F1E6D0] blur-2xl opacity-60"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-[#61AAF2] blur-2xl opacity-20"></div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-24 flex justify-center bg-white" id="features">
          <div className="container px-6">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center mb-16">
                <span className="inline-block text-sm font-medium text-[#605F5B] mb-3">CAPABILITIES</span>
                <h2 className="text-3xl font-medium tracking-tight text-[#141413] md:text-4xl">
                  Designed for modern coding education
                </h2>
                <p className="mt-4 text-lg text-[#828179]">
                  Thoughtfully crafted features that enhance the teaching and learning experience
                </p>
              </div>
            </AnimatedSection>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl">
              {[
                {
                  icon: Code,
                  title: "Integrated Code Editor",
                  description: "A powerful editor with syntax highlighting and intelligent auto-completion for a seamless coding experience."
                },
                {
                  icon: CheckCircle,
                  title: "Automated Grading",
                  description: "Execute test cases and provide real-time feedback to students with detailed insights."
                },
                {
                  icon: Users,
                  title: "Live Collaboration",
                  description: "Track student progress in real-time with interactive monitoring tools."
                },
                {
                  icon: Shield,
                  title: "Secure Environment",
                  description: "Role-based access control with a robust backend for data security and privacy."
                },
                {
                  icon: Sparkles,
                  title: "Plagiarism Detection",
                  description: "Automatically detect code similarities between student submissions."
                },
                {
                  icon: BookOpen,
                  title: "Comprehensive Analytics",
                  description: "Gain insights into student performance and identify areas for improvement."
                }
              ].map((feature, index) => (
                <StaggeredItem key={index} index={index}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </StaggeredItem>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlight Section */}
        <section className="py-24 flex justify-center bg-[#F8F8F2]">
          <div className="container px-6">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <AnimatedSection>
                <div>
                  <span className="inline-block text-sm font-medium text-[#605F5B] mb-3">FOR EDUCATORS</span>
                  <h2 className="text-3xl font-medium tracking-tight text-[#141413] md:text-4xl mb-6">
                    Streamline your teaching workflow
                  </h2>
                  <p className="text-lg text-[#828179] mb-8">
                    Create assignments, monitor student progress, and provide feedback—all in one place.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        icon: FileCode,
                        title: "Question Management",
                        description: "Upload coding questions with multiple languages, problem statements, and test cases."
                      },
                      {
                        icon: Users,
                        title: "Live Monitoring",
                        description: "View real-time progress of students and access each student's editor instance."
                      },
                      {
                        icon: CheckSquare,
                        title: "Automated Testing",
                        description: "Evaluate solutions based on correctness, performance, and edge cases."
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.5 }}
                      >
                        <FeatureHighlight
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.description}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] backdrop-blur-sm bg-white/90 border border-[#E6E4DD]">
                    <ParallaxImage
                      src="/placeholder.svg?height=500&width=600"
                      width={600}
                      height={500}
                      alt="Educator Dashboard"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#7EBF8E] blur-2xl opacity-20"></div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Second Feature Highlight Section */}
        <section className="py-24 flex justify-center bg-white">
          <div className="container px-6">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <AnimatedSection delay={0.2} className="order-2 lg:order-1">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] backdrop-blur-sm bg-white/90 border border-[#E6E4DD]">
                    <ParallaxImage
                      src="/placeholder.svg?height=500&width=600"
                      width={600}
                      height={500}
                      alt="Student Coding Interface"
                    />
                  </div>
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#D2886F] blur-2xl opacity-20"></div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection className="order-1 lg:order-2">
                <div>
                  <span className="inline-block text-sm font-medium text-[#605F5B] mb-3">FOR STUDENTS</span>
                  <h2 className="text-3xl font-medium tracking-tight text-[#141413] md:text-4xl mb-6">
                    Focus on learning, not logistics
                  </h2>
                  <p className="text-lg text-[#828179] mb-8">
                    A distraction-free environment that helps students concentrate on writing quality code.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        icon: Code,
                        title: "Interactive Code Editor",
                        description: "Integrated editor with real-time syntax highlighting and language-specific linting."
                      },
                      {
                        icon: CheckCircle,
                        title: "Instant Feedback",
                        description: "Test code with sample cases and view submission status immediately."
                      },
                      {
                        icon: Shield,
                        title: "Restriction Notifications",
                        description: "Clear messages when attempting restricted actions like pasting or right-clicking."
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.5 }}
                      >
                        <FeatureHighlight
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.description}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 flex justify-center bg-[#F6F1EB]">
          <div className="container px-6">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center mb-16">
                <span className="inline-block text-sm font-medium text-[#605F5B] mb-3">WORKFLOW</span>
                <h2 className="text-3xl font-medium tracking-tight text-[#141413] md:text-4xl">
                  Simple, intuitive process
                </h2>
                <p className="mt-4 text-lg text-[#828179]">A streamlined experience for both educators and students</p>
              </div>
            </AnimatedSection>

            <div className="mt-16">
              <AnimatedSection>
                <h3 className="mb-8 text-center text-xl font-medium text-[#3A3935]">For Educators</h3>
              </AnimatedSection>
              
              <div className="grid gap-6 md:grid-cols-3 mx-auto max-w-5xl">
                {[
                  {
                    number: "01",
                    icon: BookOpen,
                    title: "Create a Classroom",
                    description: "Set up your virtual classroom in minutes with customizable settings."
                  },
                  {
                    number: "02",
                    icon: FileCode,
                    title: "Assign Problems",
                    description: "Create or import coding assignments with test cases and instructions."
                  },
                  {
                    number: "03",
                    icon: CheckSquare,
                    title: "Monitor & Grade",
                    description: "Track student progress in real-time and review auto-graded submissions."
                  }
                ].map((step, index) => (
                  <StaggeredItem key={index} index={index}>
                    <ProcessStep
                      number={step.number}
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
                    />
                  </StaggeredItem>
                ))}
              </div>

              <div className="my-16 flex justify-center">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "6rem" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true, amount: 0.8 }}
                  className="h-px bg-[#C4C3BB]"
                ></motion.div>
              </div>

              <AnimatedSection>
                <h3 className="mb-8 text-center text-xl font-medium text-[#3A3935]">For Students</h3>
              </AnimatedSection>
              
              <div className="grid gap-6 md:grid-cols-3 mx-auto max-w-5xl">
                {[
                  {
                    number: "01",
                    icon: Users,
                    title: "Join a Class",
                    description: "Enter a class code or accept an invitation to join your instructor's classroom."
                  },
                  {
                    number: "02",
                    icon: Code,
                    title: "Solve Problems",
                    description: "Write and test your code in our powerful integrated development environment."
                  },
                  {
                    number: "03",
                    icon: CheckCircle,
                    title: "Get Feedback",
                    description: "Receive immediate feedback on your code with detailed explanations."
                  }
                ].map((step, index) => (
                  <StaggeredItem key={index} index={index}>
                    <ProcessStep
                      number={step.number}
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
                    />
                  </StaggeredItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 flex justify-center bg-white">
          <div className="container px-6">
            <AnimatedSection>
              <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl border border-[#E6E4DD] bg-[#FAFAF7] p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
                  <div className="grid gap-8 md:grid-cols-4">
                    {[
                      { value: "500+", label: "Educational Institutions" },
                      { value: "50,000+", label: "Active Students" },
                      { value: "1M+", label: "Assignments Completed" },
                      { value: "20+", label: "Programming Languages" }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        className="flex flex-col items-center justify-center text-center"
                      >
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          className="text-4xl font-medium text-[#141413]"
                        >
                          {stat.value}
                        </motion.span>
                        <span className="mt-2 text-sm text-[#828179]">{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#141413] text-white flex justify-center">
          <div className="container px-6">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                  Ready to transform your coding classroom?
                </h2>
                <p className="mt-4 text-lg text-[#A3A299]">
                  Join hundreds of universities already using gradeIT to streamline their computer lab assignments.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button size="lg" className="h-12 px-8 bg-white text-[#141413] hover:bg-[#F0EFEA] transition-all">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-8 text-sm text-[#A3A299]">
                  No credit card required. Free plan includes up to 30 students and basic features.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}