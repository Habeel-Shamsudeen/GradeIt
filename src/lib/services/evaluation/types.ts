import type { AnswerEvaluationStatus } from "@/app/generated/prisma/client";
import type { Prisma } from "@/app/generated/prisma/client";

export interface EvaluationResult {
  score: number;
  feedback: string;
  status: AnswerEvaluationStatus;
}

export interface QuestionForEvaluation {
  id: string;
  type: string;
  title: string;
  description: string;
  content: Prisma.JsonValue | null;
  answerKey: Prisma.JsonValue | null;
  points: number;
}

export type Evaluator = (
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
) => Promise<EvaluationResult>;
