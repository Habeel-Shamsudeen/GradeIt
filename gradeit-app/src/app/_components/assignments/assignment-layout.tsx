"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Maximize2, Minimize2, FileText } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { QuestionDescription } from "./question-description";
import { CodeEditor } from "./code-editor";
import { QuestionNav } from "./question-nav";
import { AssignmentById } from "@/lib/types/assignment-tyes";
import { LANGUAGE_ID_MAP } from "@/config/constants";
import { FullscreenAlert } from "./fullscreen-alert";
import { CombinedTesting } from "./combined-testing-component";
import { toast } from "sonner";
import { pollJudge0Submissions } from "@/server/actions/submission-actions";

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
    setTestResults([]); // Clear previous results

    // Add a "running" status result
    const runningResult = {
      id: "running-test",
      status: "running" as const,
    };
    setTestResults([runningResult]);

    try {
      console.log("Running code with input:", customInput);

      // Submit code to Judge0 API
      const submitResponse = await fetch(
        `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-key":
              process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id:
              LANGUAGE_ID_MAP[
                currentQuestion.language as keyof typeof LANGUAGE_ID_MAP
              ],
            source_code: btoa(code), // Convert code to Base64
            stdin: customInput ? btoa(customInput) : "",
            // Set reasonable execution constraints
            cpu_time_limit: 2, // 2 seconds
            memory_limit: 128000, // 128MB
          }),
        }
      );

      const submitData = await submitResponse.json();
      if (!submitData.token) {
        throw new Error("Failed to retrieve submission token.");
      }

      console.log("Submission token:", submitData.token);

      // Polling to get execution results
      let resultData;
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between requests

        const resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${submitData.token}?base64_encoded=true&fields=*`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key":
              process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        resultData = await resultResponse.json();

        if (resultData.status && resultData.status.id >= 3) {
          // Status >= 3 means execution is completed
          break;
        }
      }

      console.log("Execution Result:", resultData);

      // Process the result
      const newResult = {
        id: submitData.token,
        input: customInput,
        runtime: `${resultData.time || 0}s`,
        memory: `${(resultData.memory || 0) / 1000} MB`,
        status: "failed", // Default to failed, will update if passed
        output: "",
        error: "",
      };

      // Check for different types of results/errors
      if (resultData.status.id === 3) {
        // Accepted - code ran successfully
        newResult.status = "passed";
        newResult.output = resultData.stdout
          ? atob(resultData.stdout)
          : "No output";
      } else if (resultData.compile_output) {
        // Compilation error
        newResult.error = atob(resultData.compile_output);
      } else if (resultData.stderr) {
        // Runtime error
        newResult.error = atob(resultData.stderr);
      } else if (resultData.status.id === 5) {
        // Time limit exceeded
        newResult.error = "Time limit exceeded";
      } else if (resultData.status.id === 6) {
        // Memory limit exceeded
        newResult.error = "Memory limit exceeded";
      } else {
        newResult.error = `Execution failed: ${resultData.status.description}`;
      }

      // Replace the "running" result with the actual result
      setTestResults([newResult]);
    } catch (error: any) {
      console.error("Error running code:", error);

      // Handle network errors or other exceptions
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
    // Call your backend API endpoint
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
    toast.error(error.message || "An error occurred while submitting your solution");
  } finally {
    setIsSubmitting(false);
  }
};

const pollSubmissionStatus = async (submissionId: string) => {
  let completed = false;
  let attempts = 0;
  const maxAttempts = 30; // Poll for maximum of 30 attempts (30 seconds with 1s interval)
  
  while (!completed && attempts < maxAttempts) {
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 second
    
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
      if (submissionData.status === "COMPLETED" || 
          submissionData.status === "PASSED" || 
          submissionData.status === "FAILED") {
        completed = true;
        
        // Show appropriate message
        if (submissionData.status === "COMPLETED") {
          setSubmissionStatus("All tests passed successfully!");
          toast.success("Your solution passed all test cases");
        } else {
          setSubmissionStatus("Some tests failed. Check the results for details.");
          toast.error("Your solution didn't pass all test cases");
        }

        //exit polling
        break;
      } 

      await pollJudge0Submissions(submissionId);

        setSubmissionStatus(`Running test cases (${attempts}/${maxAttempts})...`);
      
    } catch (error) {
      console.error("Error polling submission status:", error);
    }
  }
  
  if (!completed) {
    setSubmissionStatus("Submission is taking longer than expected. You can check results later.");
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
