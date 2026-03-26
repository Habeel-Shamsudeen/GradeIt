"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Save, Send, Loader2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import { QuestionDescription } from "./question-description";
import { ScoringWeightDistribution } from "./scoring-weight-distribution";
import { QuestionNav } from "./question-nav";
import { SectionNav } from "./section-nav";
import { getQuestionRenderer, isCodingQuestionType } from "./renderers";

const CodeEditor = dynamic(
  () => import("./code-editor").then((mod) => ({ default: mod.CodeEditor })),
  { ssr: false },
);
import { AssignmentById, type QuestionType } from "@/lib/types/assignment-tyes";
import { FullscreenAlert } from "./fullscreen-alert";
import { CombinedTesting } from "./combined-testing-component";
import { useFullScreen } from "@/hooks/use-fullscreen";
import { useCodeRunner } from "@/hooks/use-code-runner";
import { useAutoSave } from "@/hooks/use-auto-save";
import { toast } from "sonner";

interface AssignmentLayoutProps {
  assignment: AssignmentById;
  classCode: string;
}

export function AssignmentLayout({
  assignment,
  classCode,
}: AssignmentLayoutProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [answerValues, setAnswerValues] = useState<Record<string, unknown>>({});
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const { isFullscreen } = useFullScreen();

  const hasSections = assignment.sections && assignment.sections.length > 0;

  const currentQuestions = hasSections
    ? (assignment.sections![currentSectionIndex]?.questions ?? [])
    : assignment.questions;

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const questionType = (currentQuestion?.type ?? "CODING") as QuestionType;
  const isCoding = isCodingQuestionType(questionType);

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

  const { isRunning, codeStatus, testResults, runCode, submitCode } =
    useCodeRunner({
      code,
      language: currentQuestion?.language ?? "Python",
      questionId: currentQuestion?.id ?? "",
      input: customInput,
    });

  const currentAnswerValue = currentQuestion
    ? (answerValues[currentQuestion.id] ?? null)
    : null;

  const { isSaving, lastSaved } = useAutoSave({
    questionId: currentQuestion?.id ?? "",
    value: currentAnswerValue,
    enabled: !isCoding && !!currentQuestion,
  });

  const handleAnswerChange = (value: unknown) => {
    if (!currentQuestion) return;
    setAnswerValues((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !currentAnswerValue) return;
    setIsSubmittingAnswer(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          response: currentAnswerValue,
          submit: true,
        }),
      });
      if (res.ok) {
        toast.success("Answer submitted for evaluation");
      } else {
        toast.error("Failed to submit answer");
      }
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const showFullscreenAlert = assignment.fullScreenEnforcement && !isFullscreen;

  const Renderer = !isCoding ? getQuestionRenderer(questionType) : null;

  const leftPanelContent = (
    <>
      {hasSections && (
        <SectionNav
          sections={assignment.sections!}
          currentIndex={currentSectionIndex}
          onSelect={(idx) => {
            setCurrentSectionIndex(idx);
            setCurrentQuestionIndex(0);
          }}
        />
      )}

      <div className="flex items-center justify-between overflow-x-auto border-b border-border px-4 py-2">
        <QuestionNav
          questions={currentQuestions}
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
        {isCoding ? (
          <>
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
          </>
        ) : Renderer ? (
          <>
            <h2 className="mb-4 text-lg font-semibold">
              {currentQuestion.title}
            </h2>
            <Renderer
              question={currentQuestion}
              value={currentAnswerValue}
              onChange={handleAnswerChange}
            />
            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {isSaving && (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
                {!isSaving && lastSaved && (
                  <span className="flex items-center gap-1">
                    <Save className="h-3 w-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                onClick={handleSubmitAnswer}
                disabled={isSubmittingAnswer || !currentAnswerValue}
                className="gap-1.5"
              >
                {isSubmittingAnswer ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Answer
              </Button>
            </div>
          </>
        ) : (
          <QuestionDescription question={currentQuestion} />
        )}
      </div>
    </>
  );

  const codingRightPanel = !isEditorFullscreen && (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <CodeEditor
          code={code}
          onChange={setCode}
          language={currentQuestion?.language ?? "Python"}
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

  // For non-coding questions, use a single-panel layout
  if (!isCoding) {
    return (
      <>
        {showFullscreenAlert && <FullscreenAlert />}
        <div className="flex h-[calc(100vh-5rem)] w-full min-w-0 flex-1 overflow-hidden">
          <div className="flex w-full flex-col">{leftPanelContent}</div>
        </div>
      </>
    );
  }

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
              {codingRightPanel}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

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
                  language={currentQuestion?.language ?? "Python"}
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
