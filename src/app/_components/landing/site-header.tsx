"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/_components/ui/button";
import { Code } from "lucide-react";
import ModeToggle from "./mode-toggle";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg  bg-primary-button  hover:bg-main-700">
              <Code className="h-4 w-4 text-primary-foreground" />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold text-foreground"
            >
              gradeIT
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
            <Link
              href="#features"
              className="hover:text-main-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-main-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#contact"
              className="hover:text-main-600 transition-colors"
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
              <Button
                size="sm"
                asChild
                className="text-background bg-primary-button hover:bg-main-700"
              >
                <Link href="/classes">Sign up</Link>
              </Button>
            </div>

            {/* Mobile Hamburger_ */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-border"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
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

        {/* Mobile hamburger menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-background border-t border-border px-6 pb-4 pt-2 space-y-2"
            >
              <Button
                variant="outline"
                className="w-full border-border text-text hover:bg-muted hover:text-foreground"
                asChild
              >
                <Link href="/classes">Log in</Link>
              </Button>
              <Button
                className="w-full text-background  bg-primary-button hover:bg-main-700"
                asChild
              >
                <Link href="/classes">Sign up</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
