"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Maximize2, Minimize2, FileText } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { QuestionDescription } from "./question-description";
import { CodeEditor } from "./code-editor";
import { QuestionNav } from "./question-nav";
import { AssignmentById } from "@/lib/types/assignment-tyes";
import { FullscreenAlert } from "./fullscreen-alert";
import { CombinedTesting } from "./combined-testing-component";
import { toast } from "sonner";
//import { pollJudge0Submissions } from "@/server/actions/submission-actions";

interface AssignmentLayoutProps {
  assignment: AssignmentById;
  classCode: string;
}

export function AssignmentLayout({
  assignment,
  classCode,
}: AssignmentLayoutProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    setIsFullscreen(!!document.fullscreenElement);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const currentQuestion = assignment.questions[currentQuestionIndex];

  const handleRun = async () => {
    setIsRunning(true);
    setTestResults([]);
    const runningResult = {
      id: "running-test",
      status: "running" as const,
    };
    setTestResults([runningResult]);

    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          input: customInput,
          language: currentQuestion.language,
        }),
      });
      const { output } = await response.json();

      setTestResults([output]);
    } catch (error: any) {
      console.error("Error running code:", error);
      setTestResults([
        {
          id: "error",
          status: "failed" as const,
          error: error.message || "Failed to run code. Please try again.",
          runtime: "0s",
          memory: "0 MB",
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isRunning) return;

    setIsSubmitting(true);
    setSubmissionStatus("Submitting your solution...");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          questionId: currentQuestion.id,
          language: currentQuestion.language,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit solution");
      }

      const data = await response.json();
      const submissionId = data.submissionId;

      // Start polling for submission status
      setSubmissionStatus("Running test cases...");
      await pollSubmissionStatus(submissionId);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmissionStatus(`Submission failed: ${error.message}`);
      toast.error(
        error.message || "An error occurred while submitting your solution",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollSubmissionStatus = async (submissionId: string) => {
    let completed = false;
    let attempts = 0;
    const maxAttempts = 30; // Poll for maximum of 30 attempts (30 seconds with 2s interval) that is for 60 seconds

    while (!completed && attempts < maxAttempts) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 second

      try {
        const response = await fetch(`/api/submissions/${submissionId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch submission status");
        }

        const submissionData = await response.json();

        // Update test results in UI
        const mappedResults = submissionData.results.map((result: any) => ({
          id: result.id,
          status: result.status,
          runtime: result.runtime,
          memory: result.memory,
          output: result.output,
          error: result.error,
        }));

        setTestResults(mappedResults);

        // Check if submission is completed
        if (
          submissionData.status === "COMPLETED" ||
          submissionData.status === "PASSED" ||
          submissionData.status === "FAILED"
        ) {
          completed = true;

          // Show appropriate message
          if (submissionData.status === "COMPLETED") {
            setSubmissionStatus("All tests passed successfully!");
            toast.success("Your solution passed all test cases");
          } else {
            setSubmissionStatus(
              "Some tests failed. Check the results for details.",
            );
            toast.error("Your solution didn't pass all test cases");
          }

          //exit polling
          break;
        }

        // await pollJudge0Submissions(submissionId);

        setSubmissionStatus(
          `Running test cases (${attempts}/${maxAttempts})...`,
        );
      } catch (error) {
        console.error("Error polling submission status:", error);
      }
    }

    if (!completed) {
      setSubmissionStatus(
        "Submission is taking longer than expected. You can check results later.",
      );
    }

    return completed;
  };

  const handleEnterFullscreen = () => {
    setIsFullscreen(true);
  };

  const showFullscreenAlert = assignment.fullScreenEnforcement && !isFullscreen;

  return (
    <>
      {showFullscreenAlert && (
        <FullscreenAlert onEnterFullscreen={handleEnterFullscreen} />
      )}
      <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
        {/* Left Panel */}
        <motion.div
          initial={false}
          animate={{
            width: isDescriptionExpanded ? "100%" : "40%",
          }}
          transition={{ duration: 0.2 }}
          className="relative flex h-full flex-col border-r border-[#E6E4DD] bg-white"
        >
          <div className="flex items-center justify-between overflow-x-auto border-b border-[#E6E4DD] px-4 py-2">
            <QuestionNav
              questions={assignment.questions}
              currentIndex={currentQuestionIndex}
              onSelect={setCurrentQuestionIndex}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-[#E6E4DD]"
                onClick={() =>
                  (window.location.href = `/classes/${classCode}/${assignment.id}/submissions`)
                }
              >
                <FileText className="h-4 w-4" />
                <span>Submissions</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="h-8 w-8 rounded-full"
              >
                {isDescriptionExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <QuestionDescription question={currentQuestion} />
          </div>

          <AnimatePresence>
            {!isDescriptionExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -right-6 top-1/2 z-10"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDescriptionExpanded(true)}
                  className="h-12 w-12 rounded-full bg-white shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Panel */}
        <AnimatePresence>
          {!isDescriptionExpanded && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col bg-[#1E1E1E]"
            >
              <CodeEditor
                code={code}
                onChange={setCode}
                language={currentQuestion.language}
                onRun={handleRun}
                onSubmit={handleSubmit}
                isRunning={isRunning}
                disableCopyPaste={assignment.copyPastePrevention}
              />

              <div className="border-t border-[#2D2D2D]">
                <CombinedTesting
                  testCases={currentQuestion.testCases}
                  results={testResults}
                  customInput={customInput}
                  onCustomInputChange={setCustomInput}
                  onRunCode={handleRun}
                  isRunning={isRunning}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
