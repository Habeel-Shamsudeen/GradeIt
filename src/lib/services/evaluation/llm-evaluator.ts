import type { EvaluationResult, QuestionForEvaluation } from "./types";
import type { Prisma } from "@/app/generated/prisma/client";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

function buildOpenEndedEvaluationPrompt(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): string {
  const answerKey = question.answerKey as Record<string, unknown> | null;
  const studentResponse = response as { text?: string };
  const rubric =
    (answerKey?.rubric as string) || "Evaluate for completeness and accuracy.";
  const sampleAnswer = (answerKey?.sampleAnswer as string) || "";

  return `You are an expert evaluator for educational assessments. Evaluate the following student response.

**QUESTION:**
Title: ${question.title}
Description: ${question.description}

**RUBRIC:**
${rubric}

${sampleAnswer ? `**SAMPLE ANSWER (for reference):**\n${sampleAnswer}\n` : ""}

**STUDENT RESPONSE:**
${studentResponse?.text || "(empty response)"}

**INSTRUCTIONS:**
1. Score the response from 0-100 based on the rubric
2. Provide 1-3 sentences of constructive feedback
3. Be fair and objective

**RESPONSE FORMAT:**
Return ONLY a valid JSON object:
{
  "score": 85,
  "feedback": "Your explanation was thorough and covered the key points."
}

**CRITICAL:** Return ONLY the JSON object, no additional text.

Evaluate now:`;
}

function buildGenericEvaluationPrompt(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): string {
  return `You are an expert evaluator for educational assessments. Evaluate the following student response.

**QUESTION TYPE:** ${question.type}
**QUESTION:**
Title: ${question.title}
Description: ${question.description}

**QUESTION CONTEXT:**
${JSON.stringify(question.content, null, 2)}

**EXPECTED ANSWER:**
${JSON.stringify(question.answerKey, null, 2)}

**STUDENT RESPONSE:**
${JSON.stringify(response, null, 2)}

**INSTRUCTIONS:**
1. Score the response from 0-100
2. Provide 1-3 sentences of constructive feedback
3. Consider partial credit where appropriate

**RESPONSE FORMAT:**
Return ONLY a valid JSON object:
{
  "score": 85,
  "feedback": "Constructive feedback here."
}

Evaluate now:`;
}

async function callLLM(
  prompt: string,
): Promise<{ score: number; feedback: string }> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt,
        temperature: 0.3,
      });

      const cleaned = text.trim();
      const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : cleaned;

      const parsed = JSON.parse(jsonText);

      if (
        typeof parsed.score !== "number" ||
        parsed.score < 0 ||
        parsed.score > 100 ||
        typeof parsed.feedback !== "string"
      ) {
        throw new Error("Invalid LLM response structure");
      }

      return { score: parsed.score, feedback: parsed.feedback };
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw new Error(
    `LLM evaluation failed after ${maxRetries} attempts: ${lastError?.message}`,
  );
}

export async function evaluateOpenEnded(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): Promise<EvaluationResult> {
  const answerKey = question.answerKey as Record<string, unknown> | null;
  const method = (answerKey?.evaluationMethod as string) || "LLM";

  if (method === "MANUAL") {
    return {
      score: 0,
      feedback: "Awaiting manual review.",
      status: "MANUAL_REVIEW_REQUIRED",
    };
  }

  try {
    const prompt = buildOpenEndedEvaluationPrompt(question, response);
    const result = await callLLM(prompt);
    return {
      score: result.score,
      feedback: result.feedback,
      status: "EVALUATION_COMPLETE",
    };
  } catch (error) {
    console.error("LLM evaluation failed for open-ended question:", error);
    return {
      score: 0,
      feedback: "Automatic evaluation failed. Manual review required.",
      status: "LLM_EVALUATION_FAILED",
    };
  }
}

export async function evaluateWithLLMGeneric(
  question: QuestionForEvaluation,
  response: Prisma.JsonValue,
): Promise<EvaluationResult> {
  const answerKey = question.answerKey as Record<string, unknown> | null;
  const method = (answerKey?.evaluationMethod as string) || "LLM";

  if (method === "MANUAL") {
    return {
      score: 0,
      feedback: "Awaiting manual review.",
      status: "MANUAL_REVIEW_REQUIRED",
    };
  }

  try {
    const prompt = buildGenericEvaluationPrompt(question, response);
    const result = await callLLM(prompt);
    return {
      score: result.score,
      feedback: result.feedback,
      status: "EVALUATION_COMPLETE",
    };
  } catch (error) {
    console.error(
      `LLM evaluation failed for ${question.type} question:`,
      error,
    );
    return {
      score: 0,
      feedback: "Automatic evaluation failed. Manual review required.",
      status: "LLM_EVALUATION_FAILED",
    };
  }
}
