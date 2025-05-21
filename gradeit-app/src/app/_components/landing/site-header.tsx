"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/app/_components/ui/button"
import { Code } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full flex justify-center border-b border-border bg-primary backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 w-full items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg button-primary">
            <Code className="h-4 w-4 text-primary-foreground" />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg font-medium text-foreground"
          >
            gradeIT
          </motion.span>
        </Link>

        <nav className="hidden md:flex md:gap-8 lg:gap-10">
          <Link
            href="#features"
            className="text-sm font-medium text-text hover:text-accent transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-text hover:text-accent transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-text hover:text-accent transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden sm:flex sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-border text-text hover:bg-muted hover:text-foreground"
            >
              <Link href="/classes">Log in</Link>
            </Button>
            <Button size="sm" asChild className="text-background button-primary hover:button-secondary">
              <Link href="/classes">Sign up</Link>
            </Button>
          </div>
          <Button variant="outline" size="icon" className="md:hidden border-border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
