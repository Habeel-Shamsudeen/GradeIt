"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/app/_components/ui/textarea";
import type { QuestionRendererProps } from "./types";
import { Check, X } from "lucide-react";

interface CaseStudyResponse {
  text: string;
}

export function CaseStudyRenderer({
  question,
  value,
  onChange,
  readOnly,
  showFeedback,
  feedback,
}: QuestionRendererProps) {
  const content = question.content as { caseText?: string } | null;
  const response = (value as CaseStudyResponse) || { text: "" };

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      {content?.caseText && (
        <div className="rounded-lg border-l-4 border-primary/40 bg-muted/30 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Case Study
          </p>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content.caseText }}
          />
        </div>
      )}

      <Textarea
        value={response.text}
        onChange={(e) =>
          !readOnly &&
          onChange({ text: e.target.value } satisfies CaseStudyResponse)
        }
        placeholder="Write your analysis here..."
        className="min-h-48 resize-y bg-background text-sm"
        disabled={readOnly}
      />

      {showFeedback && feedback && (
        <div
          className={cn(
            "mt-4 rounded-lg border p-3 text-sm",
            feedback.score >= 80
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.score >= 80 ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Score: {feedback.score}/100
          </div>
          <p className="mt-1">{feedback.feedback}</p>
        </div>
      )}
    </div>
  );
}
