"use server";

import { prisma } from "@/lib/prisma";
import { AnswerEvaluationStatus } from "@/app/generated/prisma/client";
import type { QuestionType } from "@/app/generated/prisma/client";
import {
  evaluateAnswer,
  isCodingType,
} from "@/lib/services/evaluation/evaluation-dispatcher";
import { updateSubmissionStatus } from "./submission-actions";

export async function evaluateAnswerById(answerId: string) {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: {
      question: true,
      submission: true,
    },
  });

  if (!answer) throw new Error(`Answer ${answerId} not found`);

  if (isCodingType(answer.question.type as QuestionType)) {
    throw new Error("Coding questions use the Judge0 pipeline");
  }

  try {
    await prisma.answer.update({
      where: { id: answerId },
      data: {
        evaluationStatus: AnswerEvaluationStatus.LLM_EVALUATION_IN_PROGRESS,
      },
    });

    const result = await evaluateAnswer(
      {
        id: answer.question.id,
        type: answer.question.type,
        title: answer.question.title,
        description: answer.question.description,
        content: answer.question.content,
        answerKey: answer.question.answerKey,
        points: answer.question.points,
      },
      answer.response,
    );

    await prisma.answer.update({
      where: { id: answerId },
      data: {
        score: result.score,
        feedback: result.feedback,
        evaluationStatus: result.status as AnswerEvaluationStatus,
      },
    });

    await updateSubmissionStatus(answer.submissionId);

    return result;
  } catch (error) {
    console.error(`Evaluation failed for answer ${answerId}:`, error);
    await prisma.answer.update({
      where: { id: answerId },
      data: {
        evaluationStatus: AnswerEvaluationStatus.LLM_EVALUATION_FAILED,
        feedback: "Evaluation failed. Manual review may be required.",
      },
    });
    await updateSubmissionStatus(answer.submissionId);
    throw error;
  }
}

export async function evaluateAllAnswersForSubmission(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      answers: {
        where: {
          evaluationStatus: AnswerEvaluationStatus.PENDING,
        },
        include: { question: true },
      },
    },
  });

  if (!submission) throw new Error(`Submission ${submissionId} not found`);

  const results = await Promise.allSettled(
    submission.answers.map((answer) => evaluateAnswerById(answer.id)),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { total: submission.answers.length, succeeded, failed };
}
