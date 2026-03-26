"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/app/_components/ui/textarea";
import type { QuestionRendererProps } from "./types";
import type {
  OpenEndedContent,
  OpenEndedResponse,
} from "@/lib/types/assignment-tyes";
import { Check, X, Clock } from "lucide-react";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function OpenEndedRenderer({
  question,
  value,
  onChange,
  readOnly,
  showFeedback,
  feedback,
}: QuestionRendererProps) {
  const content = question.content as unknown as OpenEndedContent | null;
  const response = (value as OpenEndedResponse) || { text: "" };
  const wordCount = countWords(response.text);

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      {content?.prompt && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm italic text-muted-foreground">
          {content.prompt}
        </div>
      )}

      <Textarea
        value={response.text}
        onChange={(e) =>
          !readOnly &&
          onChange({ text: e.target.value } satisfies OpenEndedResponse)
        }
        placeholder="Type your answer here..."
        className="min-h-48 resize-y bg-background text-sm"
        disabled={readOnly}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {wordCount} word{wordCount !== 1 ? "s" : ""}
          {content?.minWords && ` (min: ${content.minWords})`}
          {content?.maxWords && ` (max: ${content.maxWords})`}
        </span>
        {content?.minWords && wordCount < content.minWords && (
          <span className="text-amber-500">
            {content.minWords - wordCount} more words needed
          </span>
        )}
        {content?.maxWords && wordCount > content.maxWords && (
          <span className="text-red-500">
            {wordCount - content.maxWords} words over limit
          </span>
        )}
      </div>

      {showFeedback && feedback && (
        <div
          className={cn(
            "mt-4 rounded-lg border p-3 text-sm",
            feedback.score >= 80
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
              : feedback.score >= 50
                ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
          )}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.score >= 80 ? (
              <Check className="h-4 w-4" />
            ) : feedback.score >= 50 ? (
              <Clock className="h-4 w-4" />
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
