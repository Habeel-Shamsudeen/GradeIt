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

Please generate 5 test cases with the following format for each:
1. A brief description of what the test case is checking
2. Input values
3. Expected output
4. Whether this should be a hidden test case (true/false)

Make sure to include edge cases, typical cases, and corner cases.`;
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
    
    // Parse the response and extract test cases
    return parseTestCasesFromResponse(data.response);
  } catch (error) {
    console.error("Error calling LLM:", error);
    throw new Error("Failed to generate test cases");
  }
}

export function parseTestCasesFromResponse(response: string) {
  // Simple parsing logic - this could be made more robust
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