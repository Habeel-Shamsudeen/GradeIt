import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapStatus } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: any}
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {id} = await params;
    const submissionId = id;
    const userId = session.user.id;

    // Get the submission with test case results
    const submission = await prisma.submission.findUnique({
      where: { 
        id: submissionId,
        studentId: userId
      },
      include: {
        testCaseResults: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        question: {
          include: {
            testCases: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Map test cases to their results
    const testCaseMap = new Map();
    submission.question.testCases.forEach((testCase) => {
      testCaseMap.set(testCase.id, testCase);
    });

    // Process the results for frontend consumption
    const results = submission.testCaseResults.map((result) => {
      const testCase = testCaseMap.get(result.testCaseId);
      
      return {
        id: result.id,
        testCaseId: result.testCaseId,
        status: mapStatus(result.status),
        runtime: result.executionTime ? `${result.executionTime}ms` : "N/A",
        memory: "N/A", // Judge0 doesn't always provide memory usage
        output: result.actualOutput,
        error: result.errorMessage,
        input: testCase?.hidden ? null : testCase?.input,
        expectedOutput: testCase?.hidden ? null : testCase?.expectedOutput,
        hidden: testCase?.hidden || false,
      };
    });

    return NextResponse.json({
      id: submission.id,
      status: submission.status,
      results,
      code: submission.code,
      language: submission.language,
      createdAt: submission.createdAt,
      questionId: submission.questionId,
    });
  } catch (error: any) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
