import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssignmentLayout } from "@/app/_components/assignments/assignment-layout"
import { FacultyView } from "@/app/_components/assignments/faculty-view"
import { getUserRole } from "@/server/actions/user-actions"
import { getAssignmentById } from "@/server/actions/assignment-actions"

export const metadata: Metadata = {
  title: "Assignment | gradeIT",
  description: "Complete your coding assignment",
}

// This would come from your database TODO: write a server action to fetch assignments
const getAssignment = async (assignmentId: string) => {
  const assignments = [
    {
      id: "1",
      title: "Binary Search Trees Implementation",
      description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
      dueDate: new Date("2025-04-15T23:59:59"),
      questions: [
        {
          id: "1",
          title: "BST Insertion",
          description: "Implement a function to insert a node into a Binary Search Tree",
          difficulty: "Easy",
          timeLimit: 1000, 
          memoryLimit: 16, 
          testCases: [
            {
              id: "1",
              input: "[5,3,7,2,4,6,8]",
              expectedOutput: "true",
              isHidden: false,
            },
            {
              id: "2",
              input: "[1]",
              expectedOutput: "true",
              isHidden: true,
            },
          ],
        },
        {
          id: "2",
          title: "BST Deletion",
          description: "Implement a function to delete a node from a Binary Search Tree",
          difficulty: "Medium",
          timeLimit: 1000,
          memoryLimit: 16,
          testCases: [
            {
              id: "1",
              input: "[5,3,7,2,4,6,8]",
              expectedOutput: "true",
              isHidden: false,
            },
          ],
        },
      ],
    },
  ]

  return assignments.find((a) => a.id === assignmentId)
}

export default async function AssignmentPage({
  params,
}: {
  params: { assignmentId: string; classId: string }
}) {
  const {assignmentId, classId} = await params;
  const {assignment} = await getAssignmentById(assignmentId);
  const {role} = await getUserRole()

  console.log(assignment);

  if (!assignment) {
    notFound()
  }

  if ( role === "FACULTY") {
    return <FacultyView assignment={assignment} classId={classId} />
  }

  return <AssignmentLayout assignment={assignment} classId={classId} />
}

