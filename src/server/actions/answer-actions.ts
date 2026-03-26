"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  SubmissionStatus,
  AnswerEvaluationStatus,
} from "@/app/generated/prisma/client";
import type { Prisma } from "@/app/generated/prisma/client";

export async function saveAnswer(
  questionId: string,
  response: Prisma.InputJsonValue,
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) throw new Error("Question not found");

  let submission = await prisma.submission.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: session.user.id,
        assignmentId: question.assignmentId,
      },
    },
  });

  if (!submission) {
    submission = await prisma.submission.create({
      data: {
        studentId: session.user.id,
        assignmentId: question.assignmentId,
        status: SubmissionStatus.IN_PROGRESS,
      },
    });
  }

  const answer = await prisma.answer.upsert({
    where: {
      submissionId_questionId: {
        submissionId: submission.id,
        questionId,
      },
    },
    update: { response },
    create: {
      submissionId: submission.id,
      questionId,
      response,
      evaluationStatus: AnswerEvaluationStatus.PENDING,
    },
  });

  return { answerId: answer.id, submissionId: submission.id };
}

export async function submitAnswer(
  questionId: string,
  response: Prisma.InputJsonValue,
) {
  const result = await saveAnswer(questionId, response);

  const { evaluateAnswerById } = await import("./evaluation-actions");
  evaluateAnswerById(result.answerId).catch((err) =>
    console.error("Background answer evaluation failed:", err),
  );

  return result;
}

export async function getAnswersForSubmission(assignmentId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const submission = await prisma.submission.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: session.user.id,
        assignmentId,
      },
    },
    include: {
      answers: {
        include: { question: true },
      },
    },
  });

  if (!submission) return { answers: [] };

  return {
    answers: submission.answers.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      questionType: a.question.type,
      response: a.response,
      score: a.score,
      feedback: a.feedback,
      evaluationStatus: a.evaluationStatus,
      updatedAt: a.updatedAt,
    })),
  };
}
