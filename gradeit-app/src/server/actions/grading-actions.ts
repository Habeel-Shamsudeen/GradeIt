"use server";

import { prisma } from "@/lib/prisma";
import { Status, TestCaseStatus } from "@prisma/client";

export async function gradeSubmission(submissionId: string) {
  try {
    // Get submission with test case results
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        testCaseResults: {
          include: {
            testCase: true, // Include the test case to access its properties
          },
        },
      },
    });

    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    // Skip if not all test cases are processed
    const pendingTestCases = submission.testCaseResults.filter(
      (result) => result.status === TestCaseStatus.PENDING
    );
    
    if (pendingTestCases.length > 0) {
      return;
    }

    // Calculate score based on test case results
    let totalPoints = 0;
    let earnedPoints = 0;
    let bonusPoints = 0;
    
    const testResults = [];
    
    submission.testCaseResults.forEach((result) => {
      // Use weight and isBonus from the testCase model, with fallbacks
      const weight = result.testCase.weight || 1;
      const isBonus = result.testCase.isBonus || false;
      
      // Track test case outcome for feedback
      testResults.push({
        description: result.testCase.description || `Test Case ${result.testCase.id}`,
        passed: result.status === TestCaseStatus.PASSED,
        isBonus,
        executionTime: result.executionTime,
        error: result.errorMessage,
      });
      
      if (isBonus) {
        if (result.status === TestCaseStatus.PASSED) {
          bonusPoints += weight;
        }
      } else {
        totalPoints += weight;
        if (result.status === TestCaseStatus.PASSED) {
          earnedPoints += weight;
        }
      }
    });
    
    // Calculate base score (0-100)
    const baseScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    
    // Add bonus points (capped to ensure score doesn't exceed 100)
    const totalScore = Math.min(100, baseScore + (bonusPoints * 5));
    
    // Generate simple feedback
    const feedback = generateFeedback(testResults, totalScore);
    
    // Update submission with score and feedback
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: totalScore,
        feedback,
        status: totalScore >= 60 ? Status.COMPLETED : Status.FAILED, // Pass with 60% or higher
      },
    });
    
    return {
      submissionId,
      score: totalScore,
      feedback,
    };
  } catch (error) {
    console.error(`Error grading submission ${submissionId}:`, error);
    throw error;
  }
}

function generateFeedback(testResults, score) {
  let feedback = [];
  
  // General score feedback
  if (score >= 90) {
    feedback.push("Excellent work! Your solution performs well.");
  } else if (score >= 70) {
    feedback.push("Good job! Your solution is solid but has some room for improvement.");
  } else if (score >= 60) {
    feedback.push("Your solution passes enough tests, but needs significant improvement.");
  } else {
    feedback.push("Your solution doesn't pass enough tests yet. Review the failed test cases.");
  }
  
  // Count passed and failed tests
  const passedTests = testResults.filter(t => t.passed && !t.isBonus).length;
  const totalRequiredTests = testResults.filter(t => !t.isBonus).length;
  const passedBonus = testResults.filter(t => t.passed && t.isBonus).length;
  const totalBonus = testResults.filter(t => t.isBonus).length;
  
  feedback.push(`\nYou passed ${passedTests}/${totalRequiredTests} required test cases.`);
  
  if (totalBonus > 0) {
    feedback.push(`You passed ${passedBonus}/${totalBonus} bonus test cases.`);
  }
  
  // Add failed test case details
  const failedTests = testResults.filter(t => !t.passed);
  if (failedTests.length > 0) {
    feedback.push("\nFailed test cases:");
    failedTests.forEach((test, i) => {
      const bonusLabel = test.isBonus ? " (Bonus)" : "";
      feedback.push(`${i+1}. ${test.description}${bonusLabel}`);
      if (test.error) {
        feedback.push(`   Error: ${test.error.substring(0, 100)}${test.error.length > 100 ? '...' : ''}`);
      }
    });
  }
  
  // Add suggestions for slow tests
  const slowTests = testResults.filter(t => t.passed && t.executionTime > 1000); // Tests taking over 1 second
  if (slowTests.length > 0) {
    feedback.push("\nSome of your solutions run slowly and could be optimized:");
    slowTests.forEach((test, i) => {
      feedback.push(`- ${test.description} (${test.executionTime}ms)`);
    });
  }
  
  return feedback.join("\n");
}