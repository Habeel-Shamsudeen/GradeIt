import { AssignmentMetric, EvaluationMetric } from "@prisma/client";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

interface CodeEvaluationRequest {
  code: string;
  language: string;
  questionTitle: string;
  questionDescription: string;
  metrics: (AssignmentMetric & { metric: EvaluationMetric })[];
}

interface MetricEvaluationResult {
  metricId: string;
  metricName: string;
  score: number; // 0-100
  feedback: string; // 1-2 sentences
}

interface CodeEvaluationResponse {
  evaluations: MetricEvaluationResult[];
}

export function buildCodeEvaluationPrompt(
  request: CodeEvaluationRequest,
): string {
  const { code, language, questionTitle, questionDescription, metrics } =
    request;

  const metricsSection = metrics
    .map(
      (metric) =>
        `- **${metric.metric.name}** (Weight: ${metric.weight}%): ${metric.metric.description || "No description provided"}`,
    )
    .join("\n");

  return `You are an expert code evaluator for programming assignments. Evaluate the following code submission based on the specified metrics.

**ASSIGNMENT CONTEXT:**
- Question: ${questionTitle}
- Description: ${questionDescription}
- Programming Language: ${language}

**CODE TO EVALUATE:**
\`\`\`${language}
${code}
\`\`\`

**EVALUATION METRICS:**
${metricsSection}

**EVALUATION INSTRUCTIONS:**
1. Evaluate each metric independently
2. Provide a score from 0-100 for each metric
3. Give 1-2 sentences of constructive feedback for each metric
4. Be objective and consistent in your evaluation
5. Consider the programming language and context

**SCORING GUIDELINES:**
- 90-100: Excellent - Demonstrates best practices, clear logic, well-structured
- 80-89: Good - Solid implementation with minor issues
- 70-79: Satisfactory - Works but has noticeable problems
- 60-69: Needs Improvement - Functional but significant issues
- 0-59: Poor - Major problems or doesn't meet requirements

**RESPONSE FORMAT:**
Return ONLY a valid JSON object with this exact structure:
{
  "evaluations": [
    {
      "metricId": "metric_id_here",
      "metricName": "Metric Name",
      "score": 85,
      "feedback": "Clear and well-structured code with good variable naming."
    }
  ]
}

**CRITICAL:**
- Return ONLY the JSON object, no additional text
- Ensure all scores are integers between 0-100
- Keep feedback concise (1-2 sentences maximum)
- Use proper JSON formatting with double quotes

Evaluate the code now:`;
}

export async function evaluateCodeWithLLM(
  request: CodeEvaluationRequest,
): Promise<CodeEvaluationResponse> {
  // Validate input
  if (
    !request.code ||
    !request.language ||
    !request.questionTitle ||
    !request.metrics?.length
  ) {
    throw new Error(
      "Missing required fields: code, language, questionTitle, or metrics",
    );
  }

  if (request.metrics.length === 0) {
    throw new Error("No metrics provided for evaluation");
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const prompt = buildCodeEvaluationPrompt(request);

      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: prompt,
        temperature: 0.3,
      });
      console.log(text);
      // Clean and parse the response
      const cleanedText = text.trim();
      const jsonMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : cleanedText;

      let response;
      try {
        response = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("Failed to parse LLM response as JSON:", jsonText);
        throw new Error("LLM returned invalid JSON format");
      }

      if (!validateEvaluationResponse(response)) {
        console.error("LLM response failed validation:", response);
        throw new Error("Invalid evaluation response format");
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`LLM evaluation attempt ${attempt} failed:`, error);

      // Don't retry on validation errors (these won't be fixed by retrying)
      if (
        error instanceof Error &&
        (error.message.includes("Invalid evaluation response format") ||
          error.message.includes("LLM returned invalid JSON format") ||
          error.message.includes("Missing required fields"))
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `LLM evaluation failed after ${maxRetries} attempts: ${lastError?.message}`,
  );
}

export function validateEvaluationResponse(
  response: any,
): response is CodeEvaluationResponse {
  if (!response || typeof response !== "object") return false;
  if (!Array.isArray(response.evaluations)) return false;

  return response.evaluations.every(
    (evaluation: any) =>
      typeof evaluation.metricId === "string" &&
      typeof evaluation.metricName === "string" &&
      typeof evaluation.score === "number" &&
      evaluation.score >= 0 &&
      evaluation.score <= 100 &&
      typeof evaluation.feedback === "string",
  );
}
