"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/app/_components/ui/input";
import type { QuestionRendererProps } from "./types";
import type {
  FillBlanksContent,
  FillBlanksResponse,
} from "@/lib/types/assignment-tyes";
import { Check, X } from "lucide-react";

export function FillBlanksRenderer({
  question,
  value,
  onChange,
  readOnly,
  showFeedback,
  feedback,
}: QuestionRendererProps) {
  const content = question.content as unknown as FillBlanksContent | null;
  const response = (value as FillBlanksResponse) || { filledBlanks: [] };

  if (!content?.text || !content?.blanks) {
    return (
      <p className="text-sm text-muted-foreground">No blanks configured.</p>
    );
  }

  const getBlankValue = (blankId: string) =>
    response.filledBlanks.find((b) => b.blankId === blankId)?.value || "";

  const updateBlank = (blankId: string, newValue: string) => {
    if (readOnly) return;
    const existing = response.filledBlanks.filter((b) => b.blankId !== blankId);
    existing.push({ blankId, value: newValue });
    onChange({ filledBlanks: existing } satisfies FillBlanksResponse);
  };

  // Split text by {{blank_id}} patterns and render inline inputs
  const parts = content.text.split(/(\{\{[^}]+\}\})/g);

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      <div className="rounded-lg border border-border bg-muted/30 p-6">
        <div className="flex flex-wrap items-baseline gap-1 text-sm leading-loose">
          {parts.map((part, idx) => {
            const blankMatch = part.match(/^\{\{(.+)\}\}$/);
            if (blankMatch) {
              const blankId = blankMatch[1];
              const blank = content.blanks.find((b) => b.id === blankId);
              return (
                <Input
                  key={idx}
                  type="text"
                  value={getBlankValue(blankId)}
                  onChange={(e) => updateBlank(blankId, e.target.value)}
                  placeholder={blank?.hint || "..."}
                  disabled={readOnly}
                  className="inline-block h-8 w-32 rounded border-b-2 border-primary/30 bg-background px-2 text-sm font-medium focus:border-primary"
                />
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      </div>

      {content.blanks.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {response.filledBlanks.filter((b) => b.value.trim()).length}/
          {content.blanks.length} blanks filled
        </p>
      )}

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
