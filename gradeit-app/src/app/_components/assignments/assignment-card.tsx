"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Calendar, FileText, Users, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { Assignment } from "@/lib/types/assignment-tyes"

interface AssignmentCardProps {
  assignment: Assignment
  classCode: string
}

export function AssignmentCard({ assignment, classCode }: AssignmentCardProps) {
  const isOverdue = assignment.dueDate && new Date() > assignment.dueDate
  const isDueSoon = !isOverdue && assignment.dueDate &&  new Date() > new Date(assignment.dueDate.getTime() - 2 * 24 * 60 * 60 * 1000)

  return (
    <Card className="overflow-hidden rounded-2xl border-[#E6E4DD] bg-white transition-all hover:shadow-md">
      <Link href={`/classes/${classCode}/${assignment.id}`} className="block">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-[#141413]">{assignment.title}</h3>
            {isOverdue ? (
              <Badge variant="destructive">Overdue</Badge>
            ) : isDueSoon ? (
              <Badge className="bg-[#F1E6D0] text-[#3A3935] hover:bg-[#EBDBBC]">Due Soon</Badge>
            ) : (
              <Badge variant="outline" className="border-[#E6E4DD] text-[#605F5B]">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-[#605F5B]">{assignment.description}</p>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs text-[#828179]">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due: {assignment.dueDate ? format(assignment.dueDate, "MMM d, yyyy 'at' h:mm a") : "No due date"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>
              {assignment.questionCount} question{assignment.questionCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>
              {assignment.submissionCount} submission{assignment.submissionCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Created {format(assignment.createdAt, "MMM d, yyyy")}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

