import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, CheckCircle, XCircle, Clock, AlertTriangle, AlertCircle } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { Progress } from "@/app/_components/ui/progress"
import { cn } from "@/lib/utils"
import { getSubmissions, getSubmissionsById } from "@/server/actions/submission-actions"

export const metadata: Metadata = {
  title: "Submission Details | gradeIT",
  description: "View your submission details",
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: { assignmentId: string; classCode: string; submissionId: string }
}) {
    const {assignmentId,classCode, submissionId} = await params;
  const {submission} = await getSubmissionsById(submissionId)

  if (!submission) {
    notFound()
  }

  // Calculate test case statistics
  const totalTestCases = submission.testCaseResults.length
  const passedTestCases = submission.testCaseResults.filter((tc) => tc.status === "PASSED").length
  const passRate = totalTestCases > 0 ? (passedTestCases / totalTestCases) * 100 : 0

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
          <Link href={`/classes/${classCode}/${assignmentId}/submissions`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to submissions</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-medium text-[#141413]">Submission Details</h1>
          <p className="text-[#605F5B]">{submission.questionTitle}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-[#E6E4DD]">
            <CardHeader>
              <CardTitle>Submitted Code</CardTitle>
              <CardDescription>Submitted on {new Date(submission.submittedAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#1E1E1E] p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{submission.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 rounded-2xl border-[#E6E4DD]">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                {passedTestCases} of {totalTestCases} test cases passed ({Math.round(passRate)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submission.testCaseResults.map((result,index) => (
                  <div key={result.id} className="rounded-lg border border-[#E6E4DD] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            result.status === "PASSED" && "bg-[#7EBF8E]/10 text-[#7EBF8E]",
                            result.status === "FAILED" && "bg-[#D2886F]/10 text-[#D2886F]",
                            result.status === "PENDING" && "bg-[#E6E4DD]/50 text-[#605F5B]",
                          )}
                        >
                          {result.status === "PASSED" && <CheckCircle className="h-4 w-4" />}
                          {result.status === "FAILED" && <XCircle className="h-4 w-4" />}
                          {result.status === "PENDING" && <Clock className="h-4 w-4" />}
                        </div>
                        <p className="font-medium text-[#141413]">Test Case {index+1}</p>
                      </div>
                      <Badge
                        className={cn(
                          result.status === "PASSED" && "bg-[#7EBF8E] hover:bg-[#6CAF7E]",
                          result.status === "FAILED" && "bg-[#D2886F] hover:bg-[#C27A63]",
                          result.status === "PENDING" && "bg-[#E6E4DD] text-[#605F5B]",
                        )}
                      >
                        {result.status}
                      </Badge>
                    </div>

                    {result.executionTime && (
                      <p className="mb-2 text-xs text-[#605F5B]">Execution Time: {result.executionTime}ms</p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-[#605F5B]">Input:</p>
                        <pre className="mt-1 rounded bg-[#F0EFEA] p-2 text-xs">{result.testCase.input}</pre>
                      </div>

                      <div>
                        <p className="text-[#605F5B]">Expected Output:</p>
                        <pre className="mt-1 rounded bg-[#F0EFEA] p-2 text-xs">{result.testCase.expectedOutput}</pre>
                      </div>

                      {result.actualOutput && (
                        <div>
                          <p className="text-[#605F5B]">Your Output:</p>
                          <pre className="mt-1 rounded bg-[#F0EFEA] p-2 text-xs">{result.actualOutput}</pre>
                        </div>
                      )}

                      {result.errorMessage && (
                        <div>
                          <p className="text-[#D2886F]">Error:</p>
                          <pre className="mt-1 rounded bg-[#D2886F]/10 p-2 text-xs text-[#D2886F]">
                            {result.errorMessage}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="rounded-2xl border-[#E6E4DD]">
            <CardHeader>
              <CardTitle>Submission Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#605F5B]">Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        submission.status === "COMPLETED" && "bg-[#7EBF8E]/10 text-[#7EBF8E]",
                        submission.status === "FAILED" && "bg-[#D2886F]/10 text-[#D2886F]",
                        submission.status === "PARTIAL" && "bg-[#F1E6D0]/10 text-[#3A3935]",
                        submission.status === "PENDING" && "bg-[#E6E4DD]/50 text-[#605F5B]",
                      )}
                    >
                      {submission.status === "COMPLETED" && <CheckCircle className="h-4 w-4" />}
                      {submission.status === "FAILED" && <XCircle className="h-4 w-4" />}
                      {submission.status === "PARTIAL" && <AlertTriangle className="h-4 w-4" />}
                      {submission.status === "PENDING" && <Clock className="h-4 w-4" />}
                    </div>
                    <span className="font-medium text-[#141413]">{submission.status.replace(/_/g, " ")}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#605F5B]">Submitted At</p>
                  <p className="font-medium text-[#141413]">{new Date(submission.submittedAt).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-[#605F5B]">Language</p>
                  <p className="font-medium text-[#141413]">{submission.language}</p>
                </div>

                {submission.status !== "PENDING" && (
                  <>
                    {submission.score !== null && (
                      <div>
                        <p className="text-sm text-[#605F5B]">Score</p>
                        <div className="mt-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-[#141413]">{submission.score}%</p>
                          </div>
                          <Progress
                            value={submission.score}
                            className="mt-1 h-2"
                            // indicatorClassName={cn(
                            //   submission.score >= 90 && "bg-[#7EBF8E]",
                            //   submission.score >= 60 && submission.score < 90 && "bg-[#F1E6D0]",
                            //   submission.score < 60 && "bg-[#D2886F]",
                            // )}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-[#605F5B]">Test Cases</p>
                      <div className="mt-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-[#141413]">
                            {passedTestCases}/{totalTestCases} Passed
                          </p>
                          <p className="text-sm text-[#605F5B]">{Math.round(passRate)}%</p>
                        </div>
                        <Progress
                          value={passRate}
                          className="mt-1 h-2"
                        //   indicatorClassName={cn(
                        //     passRate >= 90 && "bg-[#7EBF8E]",
                        //     passRate >= 60 && passRate < 90 && "bg-[#F1E6D0]",
                        //     passRate < 60 && "bg-[#D2886F]",
                        //   )}
                        />
                      </div>
                    </div>
                  </>
                )}

                {submission.plagiarismScore !== null && (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-[#605F5B]">Similarity Score</p>
                      {submission.plagiarismScore > 30 && (
                        <div className="rounded-full bg-[#D2886F]/10 p-1 text-[#D2886F]">
                          <AlertCircle className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "font-medium",
                            submission.plagiarismScore > 30 && "text-[#D2886F]",
                            submission.plagiarismScore > 15 && submission.plagiarismScore <= 30 && "text-[#F1E6D0]/90",
                            submission.plagiarismScore <= 15 && "text-[#141413]",
                          )}
                        >
                          {submission.plagiarismScore.toFixed(1)}%
                        </p>
                        <p className="text-xs text-[#605F5B]">
                          {submission.plagiarismScore > 30
                            ? "High"
                            : submission.plagiarismScore > 15
                              ? "Medium"
                              : "Low"}
                        </p>
                      </div>
                      <Progress
                        value={submission.plagiarismScore}
                        className="mt-1 h-2"
                        // indicatorClassName={cn(
                        //   submission.plagiarismScore > 30 && "bg-[#D2886F]",
                        //   submission.plagiarismScore > 15 && submission.plagiarismScore <= 30 && "bg-[#F1E6D0]",
                        //   submission.plagiarismScore <= 15 && "bg-[#7EBF8E]",
                        // )}
                      />
                    </div>
                    {submission.plagiarismScore > 30 && (
                      <p className="mt-1 text-xs text-[#D2886F]">
                        High similarity detected. Your submission may be flagged for review.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

