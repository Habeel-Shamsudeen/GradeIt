"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { ClassCard } from "./class-card"
import { CreateClassDialog } from "./create-class-dialog"
import { JoinClassDialog } from "./join-class-dialog"
import { Button } from "@/app/_components/ui/button"
import { useTheme } from "next-themes"
import { getCardBgColor } from "@/lib/utils"
import { UserClassroom } from "@/lib/types/class-types"
import { Role } from "@prisma/client"
import { ClassGridSkeleton } from "./class-grid-skeleton"

export function ClassGrid({classes,role}:{classes:UserClassroom[],role:Role}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait until the client has mounted to avoid hydration mismatches.
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddClick = () => {
    if (role === "FACULTY") {
      setCreateOpen(true)
    } else {
      setJoinOpen(true)
    }
  }

  if (!mounted) return <ClassGridSkeleton/>

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add / Create Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            className="group relative flex h-[280px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] dark:bg-[#222222] p-6 text-[hsl(var(--foreground))] shadow-sm transition-all hover:border-[hsl(var(--border-secondary))] hover:shadow-md"
            onClick={handleAddClick}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))] transition-colors group-hover:bg-[hsl(var(--border-secondary))]">
              <Plus className="h-8 w-8" />
            </div>
            <p className="text-base font-medium">
              {role === "FACULTY" ? "Create Class" : "Join Class"}
            </p>
          </Button>
        </motion.div>

        {/* Render Class Cards */}
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <ClassCard {...classItem} backgroundColor={getCardBgColor(resolvedTheme)}/>
          </motion.div>
        ))}
      </div>

      <CreateClassDialog open={createOpen} onOpenChange={setCreateOpen} />
      <JoinClassDialog open={joinOpen} onOpenChange={setJoinOpen} />
    </>
  )
}

