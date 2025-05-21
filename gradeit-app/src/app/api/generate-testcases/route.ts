import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildPrompt, generateTestCases } from "@/lib/services/llm-service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "FACULTY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      questionTitle,
      questionDescription,
      language,
      sampleInput,
      sampleOutput,
    } = await req.json();

    if (!questionTitle || !questionDescription || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(
      questionTitle,
      questionDescription,
      language,
      sampleInput,
      sampleOutput
    );
    
    const prompt = buildPrompt(
      questionTitle,
      questionDescription,
      language,
      sampleInput,
      sampleOutput
    );
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
