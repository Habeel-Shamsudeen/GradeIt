"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  TestCaseStatus,
  CodeEvaluationStatus,
  SubmissionStatus,
} from "@/app/generated/prisma/client";
import {
  evaluateSubmissionMetrics,
  evaluateSubmissionTestCases,
} from "./grading-actions";
import { cookies } from "next/headers";
import { judgeResult } from "@/lib/types/code-types";

export async function processJudgeResultWebhook(
  testCaseId: string,
  codeSubmissionId: string,
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
        codeSubmissionId_testCaseId: {
          codeSubmissionId: codeSubmissionId,
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

export async function updateCodeSubmissionStatus(codeSubmissionId: string) {
  try {
    const testCaseResults = await prisma.testCaseResult.findMany({
      where: { codeSubmissionId: codeSubmissionId },
    });

    const allProcessed = testCaseResults.every(
      (result) => result.status !== TestCaseStatus.PENDING,
    );

    if (allProcessed) {
      await evaluateSubmissionTestCases(codeSubmissionId);

      console.log("All test cases processed, grading submission");

      const updatedCodeSubmission = await prisma.codeSubmission.updateMany({
        where: {
          id: codeSubmissionId,
          codeEvaluationStatus: "TEST_CASES_EVALUATION_COMPLETE",
        },
        data: {
          codeEvaluationStatus: "LLM_EVALUATION_IN_PROGRESS",
        },
      });

      if (updatedCodeSubmission.count > 0) {
        evaluateSubmissionMetrics(codeSubmissionId).catch((error) => {
          console.error("Background LLM evaluation failed:", error);
        });
        console.log("LLM evaluation triggered in background");
      } else {
        console.log("LLM evaluation already in progress or completed");
      }
    }
  } catch (error) {
    console.error(
      `Error updating submission status for submission ${codeSubmissionId}:`,
      error,
    );
  }
}

export async function updateSubmissionStatus(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      codeSubmission: true,
      answers: true,
      assignment: {
        include: {
          questions: true,
        },
      },
    },
  });
  if (!submission) {
    throw new Error("Submission not found");
  }

  const CODING_TYPES = ["CODING", "CODE_DEBUG", "CODE_FILL"];
  const codingQuestions = submission.assignment.questions.filter((q) =>
    CODING_TYPES.includes(q.type),
  );
  const nonCodingQuestions = submission.assignment.questions.filter(
    (q) => !CODING_TYPES.includes(q.type),
  );

  const totalQuestions = submission.assignment.questions.length;
  const questionScores: {
    questionId: string;
    score: number;
    points: number;
  }[] = [];

  // Score coding questions (best CodeSubmission per question)
  for (const q of codingQuestions) {
    const completedSubs = submission.codeSubmission.filter(
      (cs) =>
        cs.questionId === q.id &&
        cs.codeEvaluationStatus === CodeEvaluationStatus.EVALUATION_COMPLETE,
    );
    const best = completedSubs.sort(
      (a, b) => (b.score || 0) - (a.score || 0),
    )[0];
    if (best) {
      questionScores.push({
        questionId: q.id,
        score: best.score || 0,
        points: q.points,
      });
    }
  }

  // Score non-coding questions (Answer records)
  const TERMINAL_STATUSES = [
    "AUTO_EVALUATED",
    "EVALUATION_COMPLETE",
    "MANUAL_REVIEW_REQUIRED",
  ];
  for (const q of nonCodingQuestions) {
    const answer = submission.answers.find(
      (a) =>
        a.questionId === q.id && TERMINAL_STATUSES.includes(a.evaluationStatus),
    );
    if (answer) {
      questionScores.push({
        questionId: q.id,
        score: answer.score,
        points: q.points,
      });
    }
  }

  if (questionScores.length === totalQuestions && totalQuestions > 0) {
    const totalPoints = questionScores.reduce((acc, qs) => acc + qs.points, 0);
    const weightedScore =
      totalPoints > 0
        ? questionScores.reduce(
            (acc, qs) => acc + (qs.score * qs.points) / totalPoints,
            0,
          )
        : questionScores.reduce((acc, qs) => acc + qs.score, 0) /
          questionScores.length;

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.COMPLETED,
        finalScore: Math.min(100, Math.max(0, weightedScore)),
      },
    });
  } else if (questionScores.length > 0) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.PARTIAL,
      },
    });
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
        status: "failed",
        message: "Assignment not found",
      };
    }

    // Get the submission for this student and assignment
    const submission = await prisma.submission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: studentId ? studentId : session.user.id,
          assignmentId: assignmentId,
        },
      },
      include: {
        codeSubmission: {
          include: {
            question: true,
            testCaseResults: true,
          },
        },
      },
    });

    if (!submission) {
      return {
        status: "success",
        submissions: [],
      };
    }

    const formattedSubmissions = submission.codeSubmission.map(
      (codeSubmission) => ({
        id: codeSubmission.id,
        studentId: submission.studentId,
        questionId: codeSubmission.questionId,
        questionTitle: codeSubmission.question.title,
        code: codeSubmission.code,
        submittedAt: codeSubmission.createdAt,
        status: submission.status,
        score: codeSubmission.score,
        language: codeSubmission.question.language,
        testCaseResults: codeSubmission.testCaseResults,
        evaluationStatus:
          session.user.role === "FACULTY"
            ? codeSubmission.codeEvaluationStatus
            : undefined,
      }),
    );
    return { status: "success", submissions: formattedSubmissions };
  } catch (error) {
    throw new Error("Failed to get submissions " + error);
  }
}

export async function getSubmissionsById(codeSubmissionId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student")?.value || session.user.id;
  try {
    const codeSubmission = await prisma.codeSubmission.findUnique({
      where: {
        id: codeSubmissionId,
        submission: {
          studentId: studentId,
        },
      },
      include: {
        question: true,
        testCaseResults: {
          include: {
            testCase: true,
          },
        },
        submission: true,
      },
    });

    if (!codeSubmission) {
      return {
        status: "failed",
        message: "Submission not found",
      };
    }

    const formattedSubmission = {
      id: codeSubmission.id,
      studentId: codeSubmission.submission.studentId,
      questionId: codeSubmission.questionId,
      questionTitle: codeSubmission.question.title,
      code: codeSubmission.code,
      submittedAt: codeSubmission.createdAt,
      status: codeSubmission.submission.status,
      score: codeSubmission.score,
      language: codeSubmission.question.language,
      testCaseResults: codeSubmission.testCaseResults,
      evaluationStatus:
        session.user.role === "FACULTY"
          ? codeSubmission.codeEvaluationStatus
          : undefined,
    };

    return { status: "success", submission: formattedSubmission };
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

  const CODING_TYPES = ["CODING", "CODE_DEBUG", "CODE_FILL"];

  // 2. Get all submissions for this assignment with metric results and answers
  const submissions = await prisma.submission.findMany({
    where: {
      assignmentId: assignmentId,
      studentId: { in: classroom.students.map((s) => s.id) },
    },
    include: {
      codeSubmission: {
        include: {
          metricResults: {
            include: {
              metric: true,
            },
          },
        },
      },
      answers: true,
    },
  });

  // 3. Process student data using database values directly
  const studentsProgress = classroom.students.map((student) => {
    const studentSubmission = submissions.find(
      (s) => s.studentId === student.id,
    );

    const status = studentSubmission?.status || "NOT_STARTED";
    const score = studentSubmission?.finalScore || 0;

    const codingQuestions = assignment.questions.filter((q) =>
      CODING_TYPES.includes(q.type),
    );
    const nonCodingQuestions = assignment.questions.filter(
      (q) => !CODING_TYPES.includes(q.type),
    );

    // Best coding submission per question
    const bestCodingSubmissions = codingQuestions.map((q) => {
      const subs =
        studentSubmission?.codeSubmission.filter(
          (cs) =>
            cs.questionId === q.id &&
            cs.codeEvaluationStatus ===
              CodeEvaluationStatus.EVALUATION_COMPLETE,
        ) || [];
      return subs.sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    });

    // Evaluated answers for non-coding questions
    const TERMINAL = [
      "AUTO_EVALUATED",
      "EVALUATION_COMPLETE",
      "MANUAL_REVIEW_REQUIRED",
    ];
    const evaluatedAnswers = nonCodingQuestions.filter((q) =>
      studentSubmission?.answers.some(
        (a) => a.questionId === q.id && TERMINAL.includes(a.evaluationStatus),
      ),
    );

    const questionsCompleted =
      bestCodingSubmissions.filter((cs) => cs !== undefined).length +
      evaluatedAnswers.length;

    const allTimestamps = [
      ...(studentSubmission?.codeSubmission.map((cs) =>
        cs.createdAt.getTime(),
      ) ?? []),
      ...(studentSubmission?.answers.map((a) => a.updatedAt.getTime()) ?? []),
    ];

    return {
      id: student.id,
      name: student.name,
      email: student.email || "",
      avatar: student.image || "",
      status,
      submittedAt:
        allTimestamps.length > 0
          ? new Date(Math.max(...allTimestamps)).toISOString()
          : null,
      score,
      questionsCompleted,
      submissions: bestCodingSubmissions.filter((cs) => cs !== undefined) || [],
    };
  });

  return studentsProgress;
}
