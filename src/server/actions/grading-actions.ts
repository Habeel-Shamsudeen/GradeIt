"use server";

import { prisma } from "@/lib/prisma";
import { TestResults } from "@/lib/types/code-types";
import { Status, TestCaseStatus, EvaluationStatus } from "@prisma/client";

export async function gradeSubmission(submissionId: string) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        testCaseResults: {
          include: {
            testCase: true,
          },
        },
      },
    });

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const pendingTestCases = submission.testCaseResults.filter(
      (result) => result.status === TestCaseStatus.PENDING,
    );

    if (pendingTestCases.length > 0) {
      return;
    }

    let totalPoints = 0;
    let earnedPoints = 0;

    const testResults: TestResults[] = [];

    submission.testCaseResults.forEach((result) => {
      testResults.push({
        description:
          result.testCase.description || `Test Case ${result.testCase.id}`,
        passed: result.status === TestCaseStatus.PASSED,
        isBonus: false,
        executionTime: result.executionTime,
        error: result.errorMessage,
      });

      totalPoints += 1;
      if (result.status === TestCaseStatus.PASSED) {
        earnedPoints += 1;
      }
    });

    const baseScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    const totalScore = Math.min(100, baseScore);

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: totalScore,
        status: totalScore >= 60 ? Status.COMPLETED : Status.FAILED, // Pass with 60% or higher
        evaluationStatus: EvaluationStatus.TEST_CASES_EVALUATION_COMPLETE,
      },
    });

    return {
      submissionId,
      score: totalScore,
    };
  } catch (error) {
    console.error(`Error grading submission ${submissionId}:`, error);
    throw error;
  }
}

function generateFeedback(testResults: TestResults[], score: number) {
  const feedback = [];

  if (score >= 90) {
    feedback.push("Excellent work! Your solution performs well.");
  } else if (score >= 70) {
    feedback.push(
      "Good job! Your solution is solid but has some room for improvement.",
    );
  } else if (score >= 60) {
    feedback.push(
      "Your solution passes enough tests, but needs significant improvement.",
    );
  } else {
    feedback.push(
      "Your solution doesn't pass enough tests yet. Review the failed test cases.",
    );
  }

  const passedTests = testResults.filter((t) => t.passed && !t.isBonus).length;
  const totalRequiredTests = testResults.filter((t) => !t.isBonus).length;
  const passedBonus = testResults.filter((t) => t.passed && t.isBonus).length;
  const totalBonus = testResults.filter((t) => t.isBonus).length;

  feedback.push(
    `\nYou passed ${passedTests}/${totalRequiredTests} required test cases.`,
  );

  if (totalBonus > 0) {
    feedback.push(`You passed ${passedBonus}/${totalBonus} bonus test cases.`);
  }

  const failedTests = testResults.filter((t) => !t.passed);
  if (failedTests.length > 0) {
    feedback.push("\nFailed test cases:");
    failedTests.forEach((test, i) => {
      const bonusLabel = test.isBonus ? " (Bonus)" : "";
      feedback.push(`${i + 1}. ${test.description}${bonusLabel}`);
      if (test.error) {
        feedback.push(
          `   Error: ${test.error.substring(0, 100)}${test.error.length > 100 ? "..." : ""}`,
        );
      }
    });
  }

  const slowTests = testResults.filter((t) =>
    t.passed && t.executionTime ? t.executionTime > 1000 : false,
  ); // Tests taking over 1 second
  if (slowTests.length > 0) {
    feedback.push(
      "\nSome of your solutions run slowly and could be optimized:",
    );
    slowTests.forEach((test) => {
      feedback.push(`- ${test.description} (${test.executionTime}ms)`);
    });
  }

  return feedback.join("\n");
}
