import type { QuestionType } from "@/app/generated/prisma/client";
import type {
  EvaluationResult,
  QuestionForEvaluation,
  Evaluator,
} from "./types";
import type { Prisma } from "@/app/generated/prisma/client";
import {
  evaluateMCQ,
  evaluateMatch,
  evaluateFillBlanks,
} from "./auto-evaluators";
import { evaluateOpenEnded, evaluateWithLLMGeneric } from "./llm-evaluator";

const evaluatorRegistry: Partial<Record<QuestionType, Evaluator>> = {
  MCQ: evaluateMCQ,
  MATCH_FOLLOWING: evaluateMatch,
  FILL_BLANKS: evaluateFillBlanks,
  OPEN_ENDED: evaluateOpenEnded,
  CASE_STUDY: evaluateWithLLMGeneric,
  CHAIN_QUESTION: evaluateWithLLMGeneric,
  BLOCK_DIAGRAM: evaluateWithLLMGeneric,
};

const CODING_TYPES: QuestionType[] = ["CODING", "CODE_DEBUG", "CODE_FILL"];

export function isCodingType(type: QuestionType): boolean {
  return CODING_TYPES.includes(type);
}

export async function evaluateAnswer(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): Promise<EvaluationResult> {
  const questionType = question.type as QuestionType;

  if (isCodingType(questionType)) {
    throw new Error(
      `Coding-type questions (${questionType}) should use the CodeSubmission/Judge0 pipeline, not the Answer evaluator.`,
    );
  }

  const evaluator = evaluatorRegistry[questionType];

  if (!evaluator) {
    return {
      score: 0,
      feedback: `No evaluator registered for question type: ${questionType}. Manual review required.`,
      status: "MANUAL_REVIEW_REQUIRED",
    };
  }

  return evaluator(question, response);
}

export function getRegisteredEvaluators(): QuestionType[] {
  return Object.keys(evaluatorRegistry) as QuestionType[];
}

export function registerEvaluator(
  type: QuestionType,
  evaluator: Evaluator,
): void {
  evaluatorRegistry[type] = evaluator;
}
