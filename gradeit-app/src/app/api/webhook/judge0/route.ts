// app/api/webhook/judge0/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TestCaseStatus, Status } from "@prisma/client";

interface WebhookPayload {
  submissionId: string;
  testCaseId: string;
  questionId: string;
}

export async function POST(req: NextRequest) {
  try {
    // Extract payload from query parameter
    const url = new URL(req.url);
    const payloadParam = url.searchParams.get("payload");
    
    if (!payloadParam) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }
    
    // Decode payload
    const payload: WebhookPayload = JSON.parse(
      Buffer.from(payloadParam, "base64").toString()
    );
    
    // Get the Judge0 submission result from the request body
    const judgeResult = await req.json();
    
    // Determine test case status based on Judge0 result
    let testCaseStatus: TestCaseStatus;
    let actualOutput = null;
    let errorMessage = null;
    let executionTime = judgeResult.time ? Math.round(parseFloat(judgeResult.time) * 1000) : null; // Convert to ms
    
    // Process based on Judge0 status
    // Status ID reference: https://github.com/judge0/judge0/blob/master/docs/api/submissions.md#status
    if (judgeResult.status.id === 3) { // Accepted
      // Check if output matches expected output to determine if test passed
      const isOutputCorrect = judgeResult.status.description === "Accepted";
      testCaseStatus = isOutputCorrect ? TestCaseStatus.PASSED : TestCaseStatus.FAILED;
      
      // Decode the actual output if it exists
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 4) { // Wrong Answer
      testCaseStatus = TestCaseStatus.FAILED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 5) { // Time Limit Exceeded
      testCaseStatus = TestCaseStatus.TIMEOUT;
      errorMessage = "Time limit exceeded";
    } else if (judgeResult.compile_output) { // Compilation Error
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(judgeResult.compile_output, "base64").toString();
    } else if (judgeResult.stderr) { // Runtime Error
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(judgeResult.stderr, "base64").toString();
    } else {
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = `Execution failed: ${judgeResult.status.description}`;
    }
    
    // Update the TestCaseResult record
    await prisma.testCaseResult.update({
      where: {
        submissionId_testCaseId: {
          submissionId: payload.submissionId,
          testCaseId: payload.testCaseId,
        },
      },
      data: {
        status: testCaseStatus,
        actualOutput,
        errorMessage,
        executionTime,
      },
    });
    
    // Check if all test cases for this submission have been processed
    const testCaseResults = await prisma.testCaseResult.findMany({
      where: {
        submissionId: payload.submissionId,
      },
    });
    
    const allProcessed = testCaseResults.every(
      (result) => result.status !== TestCaseStatus.PENDING
    );
    
    if (allProcessed) {
      // Determine overall submission status
      const allPassed = testCaseResults.every(
        (result) => result.status === TestCaseStatus.PASSED
      );
      
      // Update submission status
      await prisma.submission.update({
        where: {
          id: payload.submissionId,
        },
        data: {
          status: allPassed ? Status.COMPLETED : Status.FAILED,
        },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}