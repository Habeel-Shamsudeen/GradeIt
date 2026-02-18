"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import { QuestionDescription } from "./question-description";
import { ScoringWeightDistribution } from "./scoring-weight-distribution";
import { QuestionNav } from "./question-nav";

const CodeEditor = dynamic(
  () => import("./code-editor").then((mod) => ({ default: mod.CodeEditor })),
  { ssr: false },
);
import { AssignmentById } from "@/lib/types/assignment-tyes";
import { FullscreenAlert } from "./fullscreen-alert";
import { CombinedTesting } from "./combined-testing-component";
import { useFullScreen } from "@/hooks/use-fullscreen";
import { useCodeRunner } from "@/hooks/use-code-runner";

interface AssignmentLayoutProps {
  assignment: AssignmentById;
  classCode: string;
}

export function AssignmentLayout({
  assignment,
  classCode,
}: AssignmentLayoutProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const { isFullscreen } = useFullScreen();

  const exitEditorFullscreen = useCallback(
    () => setIsEditorFullscreen(false),
    [],
  );

  useEffect(() => {
    if (!isEditorFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitEditorFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditorFullscreen, exitEditorFullscreen]);

  const currentQuestion = assignment.questions[currentQuestionIndex];
  const { isRunning, codeStatus, testResults, runCode, submitCode } =
    useCodeRunner({
      code,
      language: currentQuestion.language,
      questionId: currentQuestion.id,
      input: customInput,
    });

  const showFullscreenAlert = assignment.fullScreenEnforcement && !isFullscreen;

  const leftPanelContent = (
    <>
      <div className="flex items-center justify-between overflow-x-auto border-b border-border px-4 py-2">
        <QuestionNav
          questions={assignment.questions}
          currentIndex={currentQuestionIndex}
          onSelect={setCurrentQuestionIndex}
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border"
          onClick={() =>
            (window.location.href = `/classes/${classCode}/${assignment.id}/submissions`)
          }
        >
          <FileText className="h-4 w-4" />
          <span>Submissions</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <QuestionDescription question={currentQuestion} />
        {assignment.metrics !== undefined &&
          assignment.testCaseWeight !== undefined &&
          assignment.metricsWeight !== undefined && (
            <ScoringWeightDistribution
              testCaseWeight={assignment.testCaseWeight}
              metricsWeight={assignment.metricsWeight}
              metrics={assignment.metrics}
            />
          )}
      </div>
    </>
  );

  const rightPanelContent = !isEditorFullscreen && (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <CodeEditor
          code={code}
          onChange={setCode}
          language={currentQuestion.language}
          onRun={runCode}
          onSubmit={submitCode}
          isRunning={isRunning}
          disableCopyPaste={assignment.copyPastePrevention}
          onFullscreenToggle={() => setIsEditorFullscreen(true)}
          isFullscreen={false}
        />
      </div>
      <div className="shrink-0 border-t border-border">
        <CombinedTesting
          results={testResults}
          customInput={customInput}
          onCustomInputChange={setCustomInput}
          onRunCode={runCode}
          isRunning={isRunning}
          codeStatus={codeStatus}
        />
      </div>
    </>
  );

  return (
    <>
      {showFullscreenAlert && <FullscreenAlert />}
      <div className="flex h-[calc(100vh-5rem)] w-full min-w-0 flex-1 overflow-hidden">
        {!isEditorFullscreen && (
          <ResizablePanelGroup
            id="assignment-panels"
            orientation="horizontal"
            className="h-full min-h-0 w-full min-w-0"
            style={{ minWidth: 0 }}
          >
            <ResizablePanel
              id="problem"
              defaultSize="40%"
              minSize="25%"
              maxSize="75%"
              className="relative flex flex-col border-r border-border min-w-0"
            >
              {leftPanelContent}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              id="editor"
              defaultSize="60%"
              minSize="25%"
              maxSize="75%"
              className="flex flex-col bg-background min-h-0 min-w-0"
            >
              {rightPanelContent}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* Fullscreen code editor overlay */}
      <AnimatePresence>
        {isEditorFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex flex-col bg-background min-h-0"
          >
            <div className="flex h-full flex-col min-h-0">
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={currentQuestion.language}
                  onRun={runCode}
                  onSubmit={submitCode}
                  isRunning={isRunning}
                  disableCopyPaste={assignment.copyPastePrevention}
                  onFullscreenToggle={exitEditorFullscreen}
                  isFullscreen
                />
              </div>

              <div className="shrink-0 border-t border-border">
                <CombinedTesting
                  results={testResults}
                  customInput={customInput}
                  onCustomInputChange={setCustomInput}
                  onRunCode={runCode}
                  isRunning={isRunning}
                  codeStatus={codeStatus}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
