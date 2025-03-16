// app/api/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TestCaseStatus, Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Define payload for webhook to maintain state between calls
interface WebhookPayload {
  submissionId: string;
  testCaseId: string;
  questionId: string;
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { code, questionId, language } = await req.json();

    if (!code || !questionId || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get question and test cases
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { testCases: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        studentId: userId,
        questionId,
        code,
        language,
        status: Status.PENDING,
      },
    });

    // Create TestCaseResult records for each test case
    await prisma.testCaseResult.createMany({
      data: question.testCases.map((testCase) => ({
        submissionId: submission.id,
        testCaseId: testCase.id,
        status: TestCaseStatus.PENDING,
      })),
    });

    // Prepare to call Judge0 API for each test case
    const testCasePromises = question.testCases.map(async (testCase) => {
      // Prepare webhook payload
      const webhookPayload: WebhookPayload = {
        submissionId: submission.id,
        testCaseId: testCase.id,
        questionId,
      };

      // Base64 encode the webhook payload as a query parameter
      const encodedPayload = Buffer.from(JSON.stringify(webhookPayload)).toString('base64');
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/judge0?payload=${encodedPayload}`;

      // Submit code to Judge0 API
      const response = await fetch(
        `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*&callback_url=${encodeURIComponent(webhookUrl)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-key": process.env.JUDGE0_API_KEY || "",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id: parseInt(language),
            source_code: Buffer.from(code).toString("base64"),
            stdin: Buffer.from(testCase.input).toString("base64"),
            expected_output: Buffer.from(testCase.expectedOutput).toString("base64"),
            cpu_time_limit: 2, // 2 seconds
            memory_limit: 128000, // 128MB
          }),
        }
      );

      // Store the Judge0 token for tracking
      const judgeData = await response.json();
      if (!judgeData.token) {
        throw new Error(`Failed to submit test case ${testCase.id}`);
      }

      return judgeData.token;
    });

    try {
      // Wait for all submissions to be sent to Judge0
      await Promise.all(testCasePromises);
      
      // Return submission ID so frontend can poll for status
      return NextResponse.json({ 
        submissionId: submission.id,
        message: "Submission created and test cases queued" 
      });
    } catch (error) {
      // Mark submission as failed if any test case submission fails
      await prisma.submission.update({
        where: { id: submission.id },
        data: { status: Status.FAILED },
      });
      
      throw error;
    }
  } catch (error: any) {
    console.error("Error in submission:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}