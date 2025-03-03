"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface ProcessStepProps {
  number: string
  icon: LucideIcon
  title: string
  description: string
}

export function ProcessStep({ number, icon: Icon, title, description }: ProcessStepProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-2xl border border-[#E6E4DD] bg-white p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)]"
    >
      <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#141413] text-xs font-medium text-white">
        {number}
      </div>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F0EFEA] text-[#141413]">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="mb-3 text-xl font-medium text-center text-[#141413]">{title}</h3>
      <p className="text-[#605F5B] text-center">{description}</p>
    </motion.div>
  )
}

