"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-4 flex justify-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-center">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </motion.div>
  )
}

