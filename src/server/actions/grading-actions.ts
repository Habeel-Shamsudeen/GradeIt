"use server";

import { prisma } from "@/lib/prisma";
import { TestResults } from "@/lib/types/code-types";
import { Status, TestCaseStatus, EvaluationStatus } from "@prisma/client";
import { evaluateCodeWithLLM } from "@/lib/services/code-evaluation-llm-service";

//code submission grading
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

export async function triggerLLMEvaluation(submissionId: string) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        question: true,
        assignment: {
          include: {
            metrics: {
              include: {
                metric: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const { code, language, question, assignment } = submission;

    // if no metrics, skip LLM evaluation early return
    if (assignment.metrics.length === 0) {
      return;
    }

    try {
      const { evaluations } = await evaluateCodeWithLLM({
        code,
        language,
        questionTitle: question.title,
        questionDescription: question.description,
        metrics: assignment.metrics,
      });

      console.log(evaluations);
      await prisma.submissionMetricResult.createMany({
        data: evaluations.map((metric) => ({
          submissionId,
          metricId: metric.metricId,
          score: metric.score,
          feedback: metric.feedback,
        })),
      });
      const MetricWeightage = await prisma.assignmentMetric.findMany({
        where: {
          assignmentId: assignment.id,
        },
      });

      // calculate total score based on metric weightage
      const totalScore = evaluations.reduce((acc, metric) => {
        const weight =
          MetricWeightage?.find((m) => m.metricId === metric.metricId)
            ?.weight || 0;
        return acc + (metric.score * weight) / 100; // Convert weight percentage to decimal
      }, 0);
      console.log(totalScore);
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          evaluationStatus: EvaluationStatus.EVALUATION_COMPLETE,
          score: totalScore,
        },
      });
    } catch (error) {
      console.error(
        `Error evaluating code with LLM for submission ${submissionId}:`,
        error,
      );
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          evaluationStatus: EvaluationStatus.LLM_EVALUATION_FAILED,
        },
      });
      throw error;
    }
  } catch (error) {
    console.error(
      `Error triggering LLM evaluation for submission ${submissionId}:`,
      error,
    );
    throw error;
  }
}
