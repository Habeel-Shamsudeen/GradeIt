"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/app/_components/ui/button"
import { Code } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full flex justify-center border-b border-[#E6E4DD] bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
    >
      <div className="container flex h-16 w-full items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141413]">
            <Code className="h-4 w-4 text-white" />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg font-medium"
          >
            gradeIT
          </motion.span>
        </Link>

        <nav className="hidden md:flex md:gap-8 lg:gap-10">
          <Link href="#features" className="text-sm font-medium text-[#605F5B] transition-colors hover:text-[#141413]">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-[#605F5B] transition-colors hover:text-[#141413]"
          >
            How It Works
          </Link>
          <Link href="#contact" className="text-sm font-medium text-[#605F5B] transition-colors hover:text-[#141413]">
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
              className="border-[#E6E4DD] text-[#3A3935] hover:bg-[#F0EFEA] hover:text-[#141413]"
            >
              <Link href="/classes">Log in</Link>
            </Button>
            <Button size="sm" asChild className="bg-[#141413] text-white hover:bg-[#23241F]">
              <Link href="/classes">Sign up</Link>
            </Button>
          </div>
          <Button variant="outline" size="icon" className="md:hidden border-[#E6E4DD]">
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

