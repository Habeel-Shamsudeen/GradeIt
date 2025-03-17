"use server";
import { prisma } from "@/lib/prisma";
import { Status, TestCaseStatus } from "@prisma/client";

export async function pollJudge0Submissions(submissionId: string) {
  try {
    // Fetch all pending test case results for this submission
    const pendingResults = await prisma.testCaseResult.findMany({
      where: {
        submissionId,
        status: TestCaseStatus.PENDING,
      },
      include: {
        submission: true,
      },
    });

    if (pendingResults.length === 0) {
      // no pending results, update the submission status
      await updateSubmissionStatus(submissionId);
      return;
    }

    // For each pending result, check its status on Judge0
    const updatePromises = pendingResults.map(async (result) => {
      if (!result.judge0Token) {
        console.error(`Missing Judge0 token for test case result ${result.id}`);
        return;
      }

      try {
        const response = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${result.judge0Token}?base64_encoded=true&fields=*`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": process.env.JUDGE0_API_KEY || "",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const judgeResult = await response.json();

        // Skip if the result is still being processed
        if (judgeResult.status && judgeResult.status.id <= 2) {
          // 1=In Queue, 2=Processing
          return;
        }

        // Process the result
        await processJudgeResult(result.id, judgeResult);
      } catch (error) {
        console.error(
          `Error polling Judge0 for token ${result.judge0Token}:`,
          error
        );
      }
    });

    await Promise.all(updatePromises);

    // Update the submission status
    await updateSubmissionStatus(submissionId);
  } catch (error) {
    console.error(
      `Error polling Judge0 submissions for submission ${submissionId}:`,
      error
    );
  }
}

// Helper function to process a Judge0 result
export async function processJudgeResult(
  testCaseResultId: string,
  judgeResult: any
) {
  try {
    // Determine test case status based on Judge0 result
    let testCaseStatus: TestCaseStatus;
    let actualOutput = null;
    let errorMessage = null;
    let executionTime = judgeResult.time
      ? Math.round(parseFloat(judgeResult.time) * 1000)
      : null; // Convert to ms

    // Process based on Judge0 status ID
    // Status ID reference: https://github.com/judge0/judge0/blob/master/docs/api/submissions.md#status
    if (judgeResult.status.id === 3) {
      // Accepted
      testCaseStatus = TestCaseStatus.PASSED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 4) {
      // Wrong Answer
      testCaseStatus = TestCaseStatus.FAILED;
      if (judgeResult.stdout) {
        actualOutput = Buffer.from(judgeResult.stdout, "base64").toString();
      }
    } else if (judgeResult.status.id === 5) {
      // Time Limit Exceeded
      testCaseStatus = TestCaseStatus.TIMEOUT;
      errorMessage = "Time limit exceeded";
    } else if (judgeResult.compile_output) {
      // Compilation Error
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(
        judgeResult.compile_output,
        "base64"
      ).toString();
    } else if (judgeResult.stderr) {
      // Runtime Error
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = Buffer.from(judgeResult.stderr, "base64").toString();
    } else {
      testCaseStatus = TestCaseStatus.ERROR;
      errorMessage = `Execution failed: ${judgeResult.status.description}`;
    }

    // Update the TestCaseResult record
    await prisma.testCaseResult.update({
      where: { id: testCaseResultId },
      data: {
        status: testCaseStatus,
        actualOutput,
        errorMessage,
        executionTime,
      },
    });
  } catch (error) {
    console.error(
      `Error processing Judge0 result for test case result ${testCaseResultId}:`,
      error
    );
  }
}

// Helper function to update the submission status
export async function updateSubmissionStatus(submissionId: string) {
  try {
    // Check if all test cases for this submission have been processed
    const testCaseResults = await prisma.testCaseResult.findMany({
      where: { submissionId },
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
        where: { id: submissionId },
        data: {
          status: allPassed ? Status.COMPLETED : Status.FAILED,
        },
      });
    }
  } catch (error) {
    console.error(
      `Error updating submission status for submission ${submissionId}:`,
      error
    );
  }
}
