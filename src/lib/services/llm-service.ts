import { TestCase } from "@/lib/types/assignment-tyes";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export function buildPrompt(
  title: string,
  description: string,
  language: string,
  sampleInput?: string,
  sampleOutput?: string,
  noTestCases?: number,
): string {
  return `Generate test cases for the following programming question:
  
Title: ${title}
Description: ${description}
Programming Language: ${language}
${sampleInput ? `Sample Input: ${sampleInput}` : ""}
${sampleOutput ? `Sample Output: ${sampleOutput}` : ""}

Please generate ${
    noTestCases ? noTestCases : 5
  } test cases that follow this exact JSON structure:

{
  [
    {
      "input": "value1",
      "expectedOutput": "expectedResult1",
      "hidden": false,
    },
    ...
  ]
}

Make sure to:
1. Include edge cases, typical cases, and corner cases
2. Format your response as a valid JSON array
3. Set hidden to true for approximately 40% of test cases
5. Don't add any additional text before or after the JSON array

I need the exact JSON format above to properly parse your response.`;
}

export async function generateTestCases(prompt: string) {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompt,
    });
    const testCases: Omit<TestCase, "id">[] = JSON.parse(text);
    return testCases;
  } catch (error) {
    console.error("Error calling LLM:", error);
    throw new Error("Failed to generate test cases");
  }
}
