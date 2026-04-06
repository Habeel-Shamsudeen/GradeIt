import type { EvaluationResult, QuestionForEvaluation } from "./types";
import type { Prisma } from "@/app/generated/prisma/client";
import type {
  MCQAnswerKey,
  MCQResponse,
  MatchAnswerKey,
  MatchResponse,
  FillBlanksAnswerKey,
  FillBlanksResponse,
} from "@/lib/types/assignment-tyes";

export async function evaluateMCQ(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): Promise<EvaluationResult> {
  const answerKey = question.answerKey as unknown as MCQAnswerKey;
  const studentResponse = response as unknown as MCQResponse;

  if (!answerKey?.correctOptions || !studentResponse?.selectedOptions) {
    return {
      score: 0,
      feedback: "Invalid answer format.",
      status: "EVALUATION_COMPLETE",
    };
  }

  const correct = new Set(answerKey.correctOptions);
  const selected = new Set(studentResponse.selectedOptions);

  const correctCount = [...selected].filter((o) => correct.has(o)).length;
  const incorrectCount = [...selected].filter((o) => !correct.has(o)).length;

  let score: number;
  if (correct.size === selected.size && correctCount === correct.size) {
    score = 100;
  } else if (incorrectCount > 0) {
    // Partial credit with penalty for wrong selections
    score = Math.max(
      0,
      ((correctCount - incorrectCount * 0.5) / correct.size) * 100,
    );
  } else {
    score = (correctCount / correct.size) * 100;
  }

  const feedback =
    score === 100
      ? "Correct!"
      : score > 0
        ? `Partially correct. ${correctCount}/${correct.size} correct options selected.`
        : "Incorrect.";

  return {
    score: Math.round(score * 100) / 100,
    feedback: answerKey.explanation
      ? `${feedback} ${answerKey.explanation}`
      : feedback,
    status: "AUTO_EVALUATED",
  };
}

export async function evaluateMatch(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): Promise<EvaluationResult> {
  const answerKey = question.answerKey as unknown as MatchAnswerKey;
  const studentResponse = response as unknown as MatchResponse;

  if (!answerKey?.correctPairs || !studentResponse?.pairs) {
    return {
      score: 0,
      feedback: "Invalid answer format.",
      status: "EVALUATION_COMPLETE",
    };
  }

  const totalPairs = answerKey.correctPairs.length;
  let correctCount = 0;

  for (const correctPair of answerKey.correctPairs) {
    const studentPair = studentResponse.pairs.find(
      (p) => p.left === correctPair.left,
    );
    if (!studentPair) continue;

    const acceptedRights = Array.isArray(correctPair.right)
      ? correctPair.right
      : [correctPair.right];

    if (acceptedRights.includes(studentPair.right)) {
      correctCount++;
    }
  }

  const partialCredit = answerKey.partialCredit !== false;
  const score = partialCredit
    ? (correctCount / totalPairs) * 100
    : correctCount === totalPairs
      ? 100
      : 0;

  const feedback =
    correctCount === totalPairs
      ? "All pairs matched correctly!"
      : `${correctCount}/${totalPairs} pairs matched correctly.`;

  return {
    score: Math.round(score * 100) / 100,
    feedback,
    status: "AUTO_EVALUATED",
  };
}

export async function evaluateFillBlanks(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): Promise<EvaluationResult> {
  const answerKey = question.answerKey as unknown as FillBlanksAnswerKey;
  const studentResponse = response as unknown as FillBlanksResponse;

  if (!answerKey?.answers || !studentResponse?.filledBlanks) {
    return {
      score: 0,
      feedback: "Invalid answer format.",
      status: "EVALUATION_COMPLETE",
    };
  }

  const totalBlanks = answerKey.answers.length;
  let correctCount = 0;
  const details: string[] = [];

  for (const expected of answerKey.answers) {
    const studentBlank = studentResponse.filledBlanks.find(
      (b) => b.blankId === expected.blankId,
    );
    if (!studentBlank) {
      details.push(`Blank "${expected.blankId}": not answered`);
      continue;
    }

    const caseSensitive = expected.caseSensitive ?? false;
    const studentVal = caseSensitive
      ? studentBlank.value.trim()
      : studentBlank.value.trim().toLowerCase();

    const isCorrect = expected.acceptedValues.some((v) =>
      caseSensitive
        ? v.trim() === studentVal
        : v.trim().toLowerCase() === studentVal,
    );

    if (isCorrect) {
      correctCount++;
    } else {
      details.push(`Blank "${expected.blankId}": incorrect`);
    }
  }

  const partialCredit = answerKey.partialCredit !== false;
  const score = partialCredit
    ? (correctCount / totalBlanks) * 100
    : correctCount === totalBlanks
      ? 100
      : 0;

  const feedback =
    correctCount === totalBlanks
      ? "All blanks filled correctly!"
      : `${correctCount}/${totalBlanks} blanks correct. ${details.join("; ")}`;

  return {
    score: Math.round(score * 100) / 100,
    feedback,
    status: "AUTO_EVALUATED",
  };
}
