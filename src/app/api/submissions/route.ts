import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TestCaseStatus, Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LANGUAGE_ID_MAP } from "@/config/constants";
// import { pollJudge0Submissions } from "@/server/actions/submission-actions";
import { WebhookPayload } from "@/lib/types/config-types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { code, questionId, language } = await req.json();
    if (!code || !questionId || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { testCases: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const submission = await prisma.submission.create({
      data: {
        studentId: userId,
        questionId,
        code,
        language,
        status: Status.PENDING,
      },
    });

    await prisma.testCaseResult.createMany({
      data: question.testCases.map((testCase) => ({
        submissionId: submission.id,
        testCaseId: testCase.id,
        status: TestCaseStatus.PENDING,
      })),
    });

    const testCasePromises = question.testCases.map(async (testCase) => {
      const webhookPayload: WebhookPayload = {
        submissionId: submission.id,
        testCaseId: testCase.id,
        questionId,
      };

      const encodedPayload = Buffer.from(
        JSON.stringify(webhookPayload),
      ).toString("base64");
      const webhookUrl = `${process.env.APP_URL}/api/webhook/judge0?payload=${encodedPayload}`;

      const response = await fetch(
        `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*&callback_url=${encodeURIComponent(
          webhookUrl,
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-key": process.env.JUDGE0_API_KEY || "",
            "x-rapidapi-host":
              process.env.RAPID_API_HOST || "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id:
              LANGUAGE_ID_MAP[language as keyof typeof LANGUAGE_ID_MAP],
            source_code: Buffer.from(code).toString("base64"),
            stdin: Buffer.from(testCase.input).toString("base64"),
            expected_output: Buffer.from(testCase.expectedOutput).toString(
              "base64",
            ),
            cpu_time_limit: 2, // 2 seconds
            memory_limit: 128000, // 128MB
          }),
        },
      );

      const judgeData = await response.json();
      if (!judgeData.token) {
        throw new Error(`Failed to submit test case ${testCase.id}`);
      }

      await prisma.testCaseResult.update({
        where: {
          submissionId_testCaseId: {
            submissionId: submission.id,
            testCaseId: testCase.id,
          },
        },
        data: {
          judge0Token: judgeData.token,
        },
      });

      return judgeData.token;
    });

    try {
      await Promise.all(testCasePromises);
      //await pollJudge0Submissions(submission.id);

      return NextResponse.json({
        submissionId: submission.id,
        message: "Submission created and test cases queued",
      });
    } catch (error) {
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
      { status: 500 },
    );
  }
}
