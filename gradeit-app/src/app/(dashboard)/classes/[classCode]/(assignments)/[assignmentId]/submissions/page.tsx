import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Submissions | gradeIT",
  description: "View your submission history",
}

// This would come from your database
const getAssignment = async (assignmentId: string) => {
  // Mock data for demonstration
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
        },
        {
          id: "2",
          title: "BST Deletion",
          description: "Implement a function to delete a node from a Binary Search Tree",
          difficulty: "Medium",
        },
      ],
    },
  ]

  return assignments.find((a) => a.id === assignmentId)
}

// This would come from your database
const getSubmissions = async (assignmentId: string, userId: string) => {
  // Mock data for demonstration
  return [
    {
      id: "1",
      questionId: "1",
      questionTitle: "BST Insertion",
      submittedAt: "2024-03-05T14:30:00",
      status: "passed",
      score: 100,
      runtime: "2ms",
      memory: "5.2MB",
      language: "Python",
    },
    {
      id: "2",
      questionId: "1",
      questionTitle: "BST Insertion",
      submittedAt: "2024-03-05T14:15:00",
      status: "failed",
      score: 60,
      runtime: "3ms",
      memory: "5.3MB",
      language: "Python",
    },
    {
      id: "3",
      questionId: "2",
      questionTitle: "BST Deletion",
      submittedAt: "2024-03-05T15:45:00",
      status: "in_progress",
      score: null,
      runtime: null,
      memory: null,
      language: "Python",
    },
  ]
}

export default async function SubmissionsPage({
  params,
}: {
  params: { assignmentId: string; classId: string }
}) {
  const {assignmentId, classId} = await params;
  const assignment = await getAssignment(assignmentId)

  if (!assignment) {
    notFound()
  }

  // In a real app, you'd get the user ID from the session
  const userId = "user123"
  const submissions = await getSubmissions(assignmentId, userId)

  // Group submissions by question
  const submissionsByQuestion = assignment.questions.map((question) => {
    const questionSubmissions = submissions.filter((s) => s.questionId === question.id)
    return {
      question,
      submissions: questionSubmissions,
    }
  })

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
          <Link href={`/classes/${params.classId}/assignments/${assignmentId}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to assignment</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-medium text-[#141413]">Submission History</h1>
          <p className="text-[#605F5B]">{assignment.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {submissionsByQuestion.map(({ question, submissions }) => (
          <Card key={question.id} className="rounded-2xl border-[#E6E4DD]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                <span className="mr-2">Question {question.id}:</span> {question.title}
              </CardTitle>
              <Badge
                className={cn(
                  "px-3 py-1",
                  question.difficulty === "Easy" && "bg-[#7EBF8E] hover:bg-[#6CAF7E]",
                  question.difficulty === "Medium" && "bg-[#F1E6D0] text-[#3A3935] hover:bg-[#EBDBBC]",
                  question.difficulty === "Hard" && "bg-[#D2886F] hover:bg-[#C27A63]",
                )}
              >
                {question.difficulty}
              </Badge>
            </CardHeader>

            <CardContent>
              {submissions.length === 0 ? (
                <div className="py-6 text-center text-[#605F5B]">No submissions yet for this question</div>
              ) : (
                <div className="divide-y divide-[#E6E4DD]">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            submission.status === "passed" && "bg-[#7EBF8E]/10 text-[#7EBF8E]",
                            submission.status === "failed" && "bg-[#D2886F]/10 text-[#D2886F]",
                            submission.status === "in_progress" && "bg-[#F1E6D0]/10 text-[#3A3935]",
                          )}
                        >
                          {submission.status === "passed" && <CheckCircle className="h-5 w-5" />}
                          {submission.status === "failed" && <XCircle className="h-5 w-5" />}
                          {submission.status === "in_progress" && <Clock className="h-5 w-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#141413]">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                            <Badge variant="outline" className="border-[#E6E4DD] text-[#605F5B]">
                              {submission.language}
                            </Badge>
                          </div>

                          {submission.status !== "in_progress" && (
                            <p className="text-sm text-[#605F5B]">
                              Score: {submission.score}% | Runtime: {submission.runtime} | Memory: {submission.memory}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="gap-1.5 border-[#E6E4DD]" asChild>
                        <Link
                          href={`/classes/${params.classId}/assignments/${params.assignmentId}/submissions/${submission.id}`}
                        >
                          <FileText className="h-4 w-4" />
                          View Code
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

