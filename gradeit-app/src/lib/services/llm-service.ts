import { buildPrompt, parseTestCasesFromResponse } from "@/app/api/generate-testcases/route";
import { TestCase } from "@/lib/types/assignment-tyes";

export async function generateTestCasesWithLLM(
  questionTitle: string,
  questionDescription: string,
  language: string,
  sampleInput?: string,
  sampleOutput?: string
): Promise<any[]> {
  const prompt = buildPrompt(questionTitle, questionDescription, language, sampleInput, sampleOutput);
  
  try {
    const response = await fetch(process.env.LOCAL_LLM_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LOCAL_LLM_MODEL,
        prompt: prompt,
        stream: false,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate test cases");
    }
    
    const data = await response.json();
    return parseTestCasesFromResponse(data.response);
  } catch (error) {
    console.error("Error calling local LLM:", error);
    throw error;
  }
}

// Add to llm-service.ts

export async function generateBasicTestCases(language: string): Promise<any[]> {
    // Generate simple test cases based on language
    switch (language.toLowerCase()) {
      case "python":
        return [
          {
            id: "1",
            description: "Basic functionality test",
            input: "10\n20",
            expectedOutput: "30",
            hidden: false,
          },
          {
            id: "2",
            description: "Edge case with zero",
            input: "0\n0",
            expectedOutput: "0",
            hidden: false,
          },
          // Add more default test cases
        ];
      case "javascript":
        // JavaScript-specific test cases
        return [/* ... */];
      default:
        return [/* Generic test cases */];
    }
  }

// Include the buildPrompt and parseTestCasesFromResponse functions from earlier