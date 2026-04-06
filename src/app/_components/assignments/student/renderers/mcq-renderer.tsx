"use client";

import { cn } from "@/lib/utils";
import type { QuestionRendererProps } from "./types";
import type { MCQContent, MCQResponse } from "@/lib/types/assignment-tyes";
import { Check, X } from "lucide-react";

export function MCQRenderer({
  question,
  value,
  onChange,
  readOnly,
  showFeedback,
  feedback,
}: QuestionRendererProps) {
  const content = question.content as unknown as MCQContent | null;
  const response = (value as MCQResponse) || { selectedOptions: [] };

  if (!content?.options) {
    return (
      <p className="text-sm text-muted-foreground">No options configured.</p>
    );
  }

  const isMultiple = content.allowMultiple;

  const toggleOption = (optionId: string) => {
    if (readOnly) return;
    const selected = new Set(response.selectedOptions);
    if (selected.has(optionId)) {
      selected.delete(optionId);
    } else {
      if (!isMultiple) selected.clear();
      selected.add(optionId);
    }
    onChange({ selectedOptions: Array.from(selected) } satisfies MCQResponse);
  };

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      <p className="text-xs text-muted-foreground">
        {isMultiple ? "Select all that apply" : "Select one option"}
      </p>

      <div className="space-y-2">
        {content.options.map((option) => {
          const isSelected = response.selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={readOnly}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all",
                "hover:border-primary/50 hover:bg-accent/50",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-background",
                readOnly && "cursor-default opacity-80",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30",
                    !isMultiple && "rounded-full",
                    isMultiple && "rounded-sm",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                <span className="flex-1">{option.text}</span>
                {option.image && (
                  <img
                    src={option.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
              </div>
            </button>
          );
        })}
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
