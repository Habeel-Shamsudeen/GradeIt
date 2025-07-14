import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Progress } from "@/app/_components/ui/progress";
import { cn } from "@/lib/utils";
import {
  getSubmissions,
  getSubmissionsById,
} from "@/server/actions/submission-actions";

export const metadata: Metadata = {
  title: "Submission Details | gradeIT",
  description: "View your submission details",
};

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{
    assignmentId: string;
    classCode: string;
    submissionId: string;
  }>;
}) {
  const { assignmentId, classCode, submissionId } = await params;
  const { submission } = await getSubmissionsById(submissionId);

  if (!submission) {
    notFound();
  }

  const totalTestCases = submission.testCaseResults.length;
  const passedTestCases = submission.testCaseResults.filter(
    (tc) => tc.status === "PASSED",
  ).length;
  const passRate =
    totalTestCases > 0 ? (passedTestCases / totalTestCases) * 100 : 0;

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 rounded-full"
        >
          <Link href={`/classes/${classCode}/${assignmentId}/submissions`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to submissions</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-medium text-foreground">
            Submission Details
          </h1>
          <p className="text-muted-foreground">{submission.questionTitle}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle>Submitted Code</CardTitle>
              <CardDescription>
                Submitted on {new Date(submission.submittedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-sm text-muted-foreground">
                  <code>{submission.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 rounded-2xl border-border">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                {passedTestCases} of {totalTestCases} test cases passed (
                {Math.round(passRate)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submission.testCaseResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            result.status === "PASSED" &&
                              "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
                            result.status === "FAILED" &&
                              "bg-destructive/10 text-destructive",
                            result.status === "PENDING" &&
                              "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                          )}
                        >
                          {result.status === "PASSED" && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {result.status === "FAILED" && (
                            <XCircle className="h-4 w-4" />
                          )}
                          {result.status === "PENDING" && (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <p className="font-medium text-foreground">
                          Test Case {index + 1}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          result.status === "PASSED" &&
                            "bg-green-600 hover:bg-green-700",
                          result.status === "FAILED" &&
                            "bg-destructive hover:bg-destructive/90",
                          result.status === "PENDING" &&
                            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                        )}
                      >
                        {result.status}
                      </Badge>
                    </div>

                    {result.executionTime && (
                      <p className="mb-2 text-xs text-muted-foreground">
                        Execution Time: {result.executionTime}ms
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Input:</p>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs">
                          {result.testCase.input}
                        </pre>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          Expected Output:
                        </p>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs">
                          {result.testCase.expectedOutput}
                        </pre>
                      </div>

                      {result.actualOutput && (
                        <div>
                          <p className="text-muted-foreground">Your Output:</p>
                          <pre className="mt-1 rounded bg-muted p-2 text-xs">
                            {result.actualOutput}
                          </pre>
                        </div>
                      )}

                      {result.errorMessage && (
                        <div>
                          <p className="text-destructive">Error:</p>
                          <pre className="mt-1 rounded bg-destructive/10 p-2 text-xs text-destructive">
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
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle>Submission Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        submission.status === "COMPLETED" &&
                          "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
                        submission.status === "FAILED" &&
                          "bg-destructive/10 text-destructive",
                        submission.status === "PARTIAL" &&
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
                        submission.status === "PENDING" &&
                          "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                      )}
                    >
                      {submission.status === "COMPLETED" && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {submission.status === "FAILED" && (
                        <XCircle className="h-4 w-4" />
                      )}
                      {submission.status === "PARTIAL" && (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {submission.status === "PENDING" && (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">
                      {submission.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Submitted At</p>
                  <p className="font-medium text-foreground">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium text-foreground">
                    {submission.language}
                  </p>
                </div>

                {submission.status !== "PENDING" && (
                  <>
                    {submission.score !== null && (
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <div className="mt-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">
                              {submission.score}%
                            </p>
                          </div>
                          <Progress
                            value={submission.score}
                            className="mt-1 h-2"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Test Cases
                      </p>
                      <div className="mt-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {passedTestCases}/{totalTestCases} Passed
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(passRate)}%
                          </p>
                        </div>
                        <Progress value={passRate} className="mt-1 h-2" />
                      </div>
                    </div>
                  </>
                )}

                {submission.plagiarismScore !== null && (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-muted-foreground">
                        Similarity Score
                      </p>
                      {submission.plagiarismScore > 30 && (
                        <div className="rounded-full bg-destructive/10 p-1 text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "font-medium",
                            submission.plagiarismScore > 30 &&
                              "text-destructive",
                            submission.plagiarismScore > 15 &&
                              submission.plagiarismScore <= 30 &&
                              "text-yellow-700 dark:text-yellow-300",
                            submission.plagiarismScore <= 15 &&
                              "text-foreground",
                          )}
                        >
                          {submission.plagiarismScore.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                      />
                    </div>
                    {submission.plagiarismScore > 30 && (
                      <p className="mt-1 text-xs text-destructive">
                        High similarity detected. Your submission may be flagged
                        for review.
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
  );
}
