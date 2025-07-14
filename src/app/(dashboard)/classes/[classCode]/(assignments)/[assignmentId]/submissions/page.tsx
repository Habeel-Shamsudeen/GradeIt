import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { cn } from "@/lib/utils";
import { getAssignmentById } from "@/server/actions/assignment-actions";
import { getSubmissions } from "@/server/actions/submission-actions";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: "Submissions | gradeIT",
  description: "View your submission history",
};

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ assignmentId: string; classCode: string }>;
}) {
  const { assignmentId, classCode } = await params;
  const { assignment } = await getAssignmentById(assignmentId);
  if (!assignment) {
    return NotFound();
  }

  const { submissions } = await getSubmissions(assignmentId);

  if (!submissions) {
    return NotFound();
  }

  // Group submissions by question
  const submissionsByQuestion = assignment.questions.map((question) => {
    const questionSubmissions = submissions.filter(
      (s) => s.questionId === question.id,
    );
    return {
      question,
      submissions: questionSubmissions,
    };
  });

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 rounded-full"
        >
          <Link href={`/classes/${classCode}/${assignmentId}`}>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Back to assignment</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-medium text-foreground">
            Submission History
          </h1>
          <p className="text-muted-foreground">{assignment.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {submissionsByQuestion.map(({ question, submissions }, index) => (
          <Card
            key={question.id}
            className="rounded-xl border border-border bg-background text-foreground"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                <span className="mr-2">Question {index + 1}:</span>
                {question.title}
              </CardTitle>
              {/* <Badge
                className={cn(
                  "px-3 py-1",
                  question.difficulty === "Easy" && "bg-[#7EBF8E] hover:bg-[#6CAF7E]",
                  question.difficulty === "Medium" && "bg-[#F1E6D0] text-[#3A3935] hover:bg-[#EBDBBC]",
                  question.difficulty === "Hard" && "bg-[#D2886F] hover:bg-[#C27A63]",
                )}
              >
                {question.difficulty}
              </Badge> */}
            </CardHeader>

            <CardContent>
              {submissions.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No submissions yet for this question
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            submission.status === "COMPLETED" &&
                              "bg-green-500/10 text-green-500",
                            submission.status === "FAILED" &&
                              "bg-destructive/10 text-destructive",
                            submission.status === "PARTIAL" &&
                              "bg-muted/20 text-muted-foreground",
                            submission.status === "PENDING" &&
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {submission.status === "COMPLETED" && (
                            <CheckCircle className="h-5 w-5" />
                          )}
                          {submission.status === "FAILED" && (
                            <XCircle className="h-5 w-5" />
                          )}
                          {submission.status === "PARTIAL" && (
                            <AlertTriangle className="h-5 w-5" />
                          )}
                          {submission.status === "PENDING" && (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {new Date(
                                submission.submittedAt,
                              ).toLocaleString()}
                            </p>
                            <Badge
                              variant="outline"
                              className="border-border text-muted-foreground"
                            >
                              {submission.language}
                            </Badge>
                          </div>

                          {submission.status !== "PENDING" && (
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              {submission.score !== null && (
                                <span>Score: {submission.score}%</span>
                              )}
                              {submission.plagiarismScore !== null && (
                                <span
                                  className={cn(
                                    submission.plagiarismScore > 30 &&
                                      "text-destructive",
                                    submission.plagiarismScore > 15 &&
                                      submission.plagiarismScore <= 30 &&
                                      "text-yellow-700",
                                  )}
                                >
                                  Similarity:{" "}
                                  {submission.plagiarismScore.toFixed(1)}%
                                </span>
                              )}
                              <span>
                                {
                                  submission.testCaseResults.filter(
                                    (tc) => tc.status === "PASSED",
                                  ).length
                                }
                                /{submission.testCaseResults.length} tests
                                passed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-border text-foreground"
                        asChild
                      >
                        <Link
                          href={`/classes/${classCode}/${assignmentId}/submissions/${submission.id}`}
                        >
                          <FileText className="h-4 w-4" />
                          View Details
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
  );
}
