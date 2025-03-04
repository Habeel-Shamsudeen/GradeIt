"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { AssignmentCard } from "./assignment-card"
import { Button } from "@/app/_components/ui/button"
import { Role } from "@prisma/client"

// Mock data for demonstration
const assignments = [
  {
    id: "1",
    title: "Binary Search Trees Implementation",
    description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
    dueDate: new Date("2025-04-15T23:59:59"),
    questionCount: 3,
    submissionCount: 24,
    createdAt: new Date("2025-03-01T10:30:00"),
  },
  {
    id: "2",
    title: "Sorting Algorithms Analysis",
    description: "Implement and analyze the time complexity of various sorting algorithms.",
    dueDate: new Date("2025-04-22T23:59:59"),
    questionCount: 5,
    submissionCount: 18,
    createdAt: new Date("2025-03-05T14:15:00"),
  },
  {
    id: "3",
    title: "Graph Algorithms",
    description: "Implement BFS, DFS, and Dijkstra's algorithm for graph traversal and shortest path finding.",
    dueDate: new Date("2025-05-01T23:59:59"),
    questionCount: 4,
    submissionCount: 0,
    createdAt: new Date("2025-03-10T09:45:00"),
  },
]

interface AssignmentListProps {
  classId: string
  role:Role
}

export function AssignmentList({ classId, role }: AssignmentListProps) {
  const router = useRouter()

  const handleCreateAssignment = () => {
    router.push(`/classes/${classId}/create`)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#141413]">Assignments</h2>
        {role === "FACULTY" && (
          <Button onClick={handleCreateAssignment} className="gap-1">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E6E4DD] bg-white/50 p-6 text-center">
            <p className="text-[#605F5B]">No assignments yet.</p>
            {role === "FACULTY" && (
              <Button variant="outline" className="mt-4 border-[#E6E4DD]" onClick={handleCreateAssignment}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first assignment
              </Button>
            )}
          </div>
        ) : (
          assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <AssignmentCard assignment={assignment} classId={classId} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

