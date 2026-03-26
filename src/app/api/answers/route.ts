import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  SubmissionStatus,
  AnswerEvaluationStatus,
} from "@/app/generated/prisma/client";
import { isCodingType } from "@/lib/services/evaluation/evaluation-dispatcher";
import type { QuestionType } from "@/app/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, response, submit } = await req.json();
    if (!questionId || response === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: questionId, response" },
        { status: 400 },
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { assignment: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    if (isCodingType(question.type as QuestionType)) {
      return NextResponse.json(
        { error: "Coding questions should use /api/submissions" },
        { status: 400 },
      );
    }

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
    } else if (submission.status === SubmissionStatus.NOT_STARTED) {
      submission = await prisma.submission.update({
        where: { id: submission.id },
        data: { status: SubmissionStatus.IN_PROGRESS },
      });
    }

    const answer = await prisma.answer.upsert({
      where: {
        submissionId_questionId: {
          submissionId: submission.id,
          questionId,
        },
      },
      update: {
        response,
        evaluationStatus: submit
          ? AnswerEvaluationStatus.PENDING
          : AnswerEvaluationStatus.PENDING,
      },
      create: {
        submissionId: submission.id,
        questionId,
        response,
        evaluationStatus: AnswerEvaluationStatus.PENDING,
      },
    });

    if (submit) {
      const { evaluateAnswerById } =
        await import("@/server/actions/evaluation-actions");
      evaluateAnswerById(answer.id).catch((err) =>
        console.error("Background answer evaluation failed:", err),
      );
    }

    return NextResponse.json({
      answerId: answer.id,
      submissionId: submission.id,
      saved: true,
      submitted: !!submit,
    });
  } catch (error: unknown) {
    console.error("Error saving answer:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    const questionId = searchParams.get("questionId");

    if (!assignmentId) {
      return NextResponse.json(
        { error: "assignmentId is required" },
        { status: 400 },
      );
    }

    const submission = await prisma.submission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: session.user.id,
          assignmentId,
        },
      },
      include: {
        answers: questionId ? { where: { questionId } } : true,
      },
    });

    if (!submission) {
      return NextResponse.json({ answers: [] });
    }

    return NextResponse.json({ answers: submission.answers });
  } catch (error: unknown) {
    console.error("Error fetching answers:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
