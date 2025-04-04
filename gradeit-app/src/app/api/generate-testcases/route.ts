import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "FACULTY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionTitle, questionDescription, language, sampleInput, sampleOutput } = await req.json();
    
    if (!questionTitle || !questionDescription || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(questionTitle, questionDescription, language, sampleInput, sampleOutput);
    // Call the local LLM
    const prompt = buildPrompt(questionTitle, questionDescription, language, sampleInput, sampleOutput);
    const testCases = await generateTestCases(prompt);

    return NextResponse.json({ testCases });
  } catch (error: any) {
    console.error("Error generating test cases:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate test cases" },
      { status: 500 }
    );
  }
}

export function buildPrompt(title: string, description: string, language: string, sampleInput?: string, sampleOutput?: string): string {
  return `Generate test cases for the following programming question:
  
Title: ${title}
Description: ${description}
Programming Language: ${language}
${sampleInput ? `Sample Input: ${sampleInput}` : ''}
${sampleOutput ? `Sample Output: ${sampleOutput}` : ''}

Please generate 5 test cases that follow this exact JSON structure:

[
  {
    "input": "value1",
    "expectedOutput": "expectedResult1",
    "hidden": false,
    "description": "Brief description of what this test case checks"
  },
  ...
]

Make sure to:
1. Include edge cases, typical cases, and corner cases
2. Format your response as a valid JSON array
3. Set hidden to true for approximately 40% of test cases
4. Provide clear descriptions of what each test checks
5. Don't add any additional text before or after the JSON array

I need the exact JSON format above to properly parse your response.`;
}

async function generateTestCases(prompt: string) {
  try {
    // Call to local LLM API (Ollama)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "codellama:7b-instruct",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    console.log(data)
    
    // Parse the response and extract test cases
    return parseTestCasesFromResponse(data.response);
  } catch (error) {
    console.error("Error calling LLM:", error);
    throw new Error("Failed to generate test cases");
  }
}

export function parseTestCasesFromResponse(response: string): Array<{
  input: string;
  expectedOutput: string;
  hidden: boolean;
  description?: string;
}> {
  try {
    // Find JSON array in the response (in case there's any text before/after)
    const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (!jsonMatch) {
      console.error("No valid JSON array found in response");
      return [];
    }
    
    const jsonStr = jsonMatch[0];
    const testCases = JSON.parse(jsonStr);
    
    // Validate and ensure each test case has the required fields
    return testCases.map((tc: any, index: number) => ({
      input: String(tc.input || ""),
      expectedOutput: String(tc.expectedOutput || ""),
      hidden: Boolean(tc.hidden),
      description: tc.description || `Test case ${index + 1}`
    }));
  } catch (error) {
    console.error("Error parsing test cases:", error);
    
    // Fallback parsing for non-JSON responses
    return fallbackParsing(response);
  }
}

/**
 * Fallback parsing method if JSON parsing fails
 */
function fallbackParsing(response: string): Array<{
  input: string;
  expectedOutput: string;
  hidden: boolean;
  description?: string;
}> {
  const testCases = [];
  const testCaseRegex = /Test Case \d+:([\s\S]*?)(?=Test Case \d+:|$)/g;
  
  let match;
  while ((match = testCaseRegex.exec(response)) !== null) {
    const testCaseText = match[1].trim();
    
    // Extract description, input, output, and hidden status
    const description = extractValue(testCaseText, "Description", "Input");
    const input = extractValue(testCaseText, "Input", "Expected Output");
    const expectedOutput = extractValue(testCaseText, "Expected Output", "Hidden");
    const hidden = extractValue(testCaseText, "Hidden", "").toLowerCase().includes("true");
    
    testCases.push({
      description,
      input,
      expectedOutput,
      hidden,
    });
  }
  
  return testCases;
}

function extractValue(text: string, startMarker: string, endMarker: string): string {
  const startIndex = text.indexOf(startMarker + ":");
  if (startIndex === -1) return "";
  
  const valueStartIndex = startIndex + startMarker.length + 1;
  
  let endIndex;
  if (endMarker && text.indexOf(endMarker + ":") !== -1) {
    endIndex = text.indexOf(endMarker + ":");
  } else {
    endIndex = text.length;
  }
  
  return text.substring(valueStartIndex, endIndex).trim();
}

/**
 * Function to validate generated test cases match the database schema
 */
export function validateTestCases(testCases: any[]): boolean {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return false;
  }
  
  return testCases.every(tc => 
    typeof tc.input === 'string' && 
    typeof tc.expectedOutput === 'string' && 
    typeof tc.hidden === 'boolean'
  );
}