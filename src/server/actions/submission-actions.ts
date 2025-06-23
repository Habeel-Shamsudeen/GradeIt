"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestCaseStatus } from "@prisma/client";
import { gradeSubmission } from "./grading-actions";
import { cookies } from "next/headers";
import { judgeResult } from "@/lib/types/code-types";

export async function processJudgeResultWebhook(
  testCaseId: string,
  submissionId: string,
  judgeResult: judgeResult,
) {
  try {
    console.log(judgeResult);
    let testCaseStatus: TestCaseStatus;
    let actualOutput = null;
    let errorMessage = null;
    const executionTime = judgeResult.time
      ? Math.round(parseFloat(judgeResult.time) * 1000)
      : null; // Convert to ms

    if (judgeResult.status.id === 3) {
      testCaseStatus = TestCaseStatus.PASSED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 4) {
      testCaseStatus = TestCaseStatus.FAILED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 5) {
      testCaseStatus = TestCaseStatus.TIMEOUT;
      errorMessage = "Time limit exceeded";
    } else if (judgeResult.compile_output) {
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(
        judgeResult.compile_output,
        "base64",
      ).toString();
    } else if (judgeResult.stderr) {
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(judgeResult.stderr, "base64").toString();
    } else {
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = `Execution failed: ${judgeResult.status.description}`;
    }

    await prisma.testCaseResult.update({
      where: {
        submissionId_testCaseId: {
          submissionId,
          testCaseId,
        },
      },
      data: {
        status: testCaseStatus,
        actualOutput,
        errorMessage,
        executionTime,
      },
    });
  } catch (error) {
    console.error(
      `Error processing Judge0 result for test case result ${testCaseId}:`,
      error,
    );
  }
}

export async function updateSubmissionStatus(submissionId: string) {
  try {
    const testCaseResults = await prisma.testCaseResult.findMany({
      where: { submissionId },
    });

    const allProcessed = testCaseResults.every(
      (result) => result.status !== TestCaseStatus.PENDING,
    );

    if (allProcessed) {
      await gradeSubmission(submissionId);
    }
  } catch (error) {
    console.error(
      `Error updating submission status for submission ${submissionId}:`,
      error,
    );
  }
}

export async function getSubmissions(assignmentId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student")?.value;
  try {
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
      },
      include: {
        questions: true,
      },
    });

    if (!assignment) {
      return {
        status: "falied",
        message: "Assignment not found",
      };
    }

    const submissions = await prisma.submission.findMany({
      where: {
        studentId: studentId ? studentId : session.user.id,
        questionId: {
          in: assignment.questions.map((ques) => ques.id),
        },
      },
      include: {
        question: true,
        testCaseResults: true,
      },
    });

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      studentId: submission.studentId,
      questionId: submission.questionId,
      questionTitle: submission.question.title,
      code: submission.code,
      submittedAt: submission.createdAt,
      status: submission.status,
      score: submission.score,
      language: submission.question.language,
      plagiarismScore: submission.plagiarismScore,
      testCaseResults: submission.testCaseResults,
    }));
    return { status: "success", submissions: formattedSubmissions };
  } catch (error) {
    throw new Error("Failed to get submissions " + error);
  }
}

export async function getSubmissionsById(submissionId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student")?.value || session.user.id;
  try {
    const submission = await prisma.submission.findUnique({
      where: {
        studentId: studentId,
        id: submissionId,
      },
      include: {
        question: true,
        testCaseResults: {
          include: {
            testCase: true,
          },
        },
      },
    });

    if (!submission) {
      return {
        status: "falied",
        message: "Submission not found",
      };
    }

    const formattedSubmissions = {
      id: submission.id,
      studentId: submission.studentId,
      questionId: submission.questionId,
      questionTitle: submission.question.title,
      code: submission.code,
      submittedAt: submission.createdAt,
      status: submission.status,
      score: submission.score,
      language: submission.question.language,
      plagiarismScore: submission.plagiarismScore,
      testCaseResults: submission.testCaseResults,
    };
    return { status: "success", submission: formattedSubmissions };
  } catch (error) {
    throw new Error("Failed to get submissions " + error);
  }
}

export async function getStudentAssignmentProgress(
  assignmentId: string,
  classCode: string,
) {
  // 1. Get the classroom with its enrolled students
  const classroom = await prisma.classroom.findUnique({
    where: { code: classCode },
    include: {
      students: true,
      assignments: {
        where: { id: assignmentId },
        include: {
          questions: true,
        },
      },
    },
  });

  if (!classroom || !classroom.assignments[0]) {
    throw new Error("Classroom or assignment not found");
  }

  const assignment = classroom.assignments[0];
  const questionIds = assignment.questions.map((q) => q.id);

  // 2. Get all submissions for this assignment's questions
  const submissions = await prisma.submission.findMany({
    where: {
      questionId: { in: questionIds },
      studentId: { in: classroom.students.map((s) => s.id) },
    },
    include: {
      testCaseResults: true,
    },
  });

  // 3. Process student data
  const studentsProgress = classroom.students.map((student) => {
    // Get this student's submissions for this assignment
    const studentSubmissions = submissions.filter(
      (s) => s.studentId === student.id,
    );

    // Count questions completed (has submission)
    const questionsCompleted = new Set(
      studentSubmissions.map((s) => s.questionId),
    ).size;

    // Determine status
    let status = "not_started";
    if (questionsCompleted > 0) {
      status =
        questionsCompleted === assignment.questions.length
          ? "completed"
          : "in_progress";
    }

    // Calculate average score if completed
    let score = null;
    if (status === "completed") {
      const scores = studentSubmissions
        .map((s) => s.score)
        .filter(Boolean) as number[];
      if (scores.length > 0) {
        score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    }

    return {
      id: student.id,
      name: student.name,
      email: student.email || "",
      avatar: student.image || "",
      status,
      submittedAt:
        studentSubmissions.length > 0
          ? new Date(
              Math.max(...studentSubmissions.map((s) => s.createdAt.getTime())),
            ).toISOString()
          : null,
      score,
      questionsCompleted,
      submissions: studentSubmissions.map((sub) => ({
        questionId: sub.questionId,
        status: sub.status,
        score: sub.score,
      })),
    };
  });

  return studentsProgress;
}

/*
legacy polling mechanism
export async function pollJudge0Submissions(submissionId: string) {
  try {
    const pendingResults = await prisma.testCaseResult.findMany({
      where: {
        submissionId,
        status: TestCaseStatus.PENDING,
      },
      include: {
        submission: true,
      },
    });

    if (pendingResults.length === 0) {
      await updateSubmissionStatus(submissionId);
      return;
    }

    const updatePromises = pendingResults.map(async (result) => {
      if (!result.judge0Token) {
        console.error(`Missing Judge0 token for test case result ${result.id}`);
        return;
      }

      try {
        const response = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${result.judge0Token}?base64_encoded=true&fields=*`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": process.env.JUDGE0_API_KEY || "",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const judgeResult = await response.json();

        // Skip if the result is still being processed
        if (judgeResult.status && judgeResult.status.id <= 2) {
          // 1=In Queue, 2=Processing
          return;
        }

        await processJudgeResult(result.id, judgeResult);
      } catch (error) {
        console.error(
          `Error polling Judge0 for token ${result.judge0Token}:`,
          error
        );
      }
    });

    await Promise.all(updatePromises);

    await updateSubmissionStatus(submissionId);
  } catch (error) {
    console.error(
      `Error polling Judge0 submissions for submission ${submissionId}:`,
      error
    );
  }
}

export async function processJudgeResult(
  testCaseResultId: string,
  judgeResult: any,
) {
  try {
    let testCaseStatus: TestCaseStatus;
    let actualOutput = null;
    let errorMessage = null;
    const executionTime = judgeResult.time
      ? Math.round(parseFloat(judgeResult.time) * 1000)
      : null; // Convert to ms

    if (judgeResult.status.id === 3) {
      // Accepted
      testCaseStatus = TestCaseStatus.PASSED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 4) {
      // Wrong Answer
      testCaseStatus = TestCaseStatus.FAILED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 5) {
      // Time Limit Exceeded
      testCaseStatus = TestCaseStatus.TIMEOUT;
      errorMessage = "Time limit exceeded";
    } else if (judgeResult.compile_output) {
      // Compilation Error
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(
        judgeResult.compile_output,
        "base64",
      ).toString();
    } else if (judgeResult.stderr) {
      // Runtime Error
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(judgeResult.stderr, "base64").toString();
    } else {
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = `Execution failed: ${judgeResult.status.description}`;
    }

    await prisma.testCaseResult.update({
      where: { id: testCaseResultId },
      data: {
        status: testCaseStatus,
        actualOutput,
        errorMessage,
        executionTime,
      },
    });
  } catch (error) {
    console.error(
      `Error processing Judge0 result for test case result ${testCaseResultId}:`,
      error,
    );
  }
}
*/
