"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { QuestionRendererProps } from "./types";
import type { MatchContent, MatchResponse } from "@/lib/types/assignment-tyes";
import { Check, X, ArrowRight } from "lucide-react";

export function MatchRenderer({
  question,
  value,
  onChange,
  readOnly,
  showFeedback,
  feedback,
}: QuestionRendererProps) {
  const content = question.content as unknown as MatchContent | null;
  const response = (value as MatchResponse) || { pairs: [] };
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  if (!content?.leftItems || !content?.rightItems) {
    return (
      <p className="text-sm text-muted-foreground">
        No matching items configured.
      </p>
    );
  }

  const getPairedRight = (leftId: string) =>
    response.pairs.find((p) => p.left === leftId)?.right;

  const getPairedLeft = (rightId: string) =>
    response.pairs.find((p) => p.right === rightId)?.left;

  const handleRightClick = (rightId: string) => {
    if (readOnly || !selectedLeft) return;

    const updatedPairs = response.pairs.filter(
      (p) => p.left !== selectedLeft && p.right !== rightId,
    );
    updatedPairs.push({ left: selectedLeft, right: rightId });

    onChange({ pairs: updatedPairs } satisfies MatchResponse);
    setSelectedLeft(null);
  };

  const clearPair = (leftId: string) => {
    if (readOnly) return;
    onChange({
      pairs: response.pairs.filter((p) => p.left !== leftId),
    } satisfies MatchResponse);
  };

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      <p className="text-xs text-muted-foreground">
        Click a left item, then click the matching right item to create a pair.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Items
          </h4>
          {content.leftItems.map((item) => {
            const paired = getPairedRight(item.id);
            const isActive = selectedLeft === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={readOnly}
                onClick={() =>
                  paired ? clearPair(item.id) : setSelectedLeft(item.id)
                }
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all",
                  isActive &&
                    "border-primary bg-primary/10 ring-1 ring-primary/30",
                  paired &&
                    !isActive &&
                    "border-green-500/50 bg-green-50 dark:bg-green-950/30",
                  !paired &&
                    !isActive &&
                    "border-border hover:border-primary/40",
                  readOnly && "cursor-default",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{item.text}</span>
                  {paired && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ArrowRight className="h-3 w-3" />
                      {content.rightItems.find((r) => r.id === paired)?.text}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Matches
          </h4>
          {content.rightItems.map((item) => {
            const pairedTo = getPairedLeft(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={readOnly || !selectedLeft}
                onClick={() => handleRightClick(item.id)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all",
                  pairedTo &&
                    "border-green-500/50 bg-green-50 dark:bg-green-950/30",
                  !pairedTo &&
                    selectedLeft &&
                    "border-border hover:border-primary/40 hover:bg-accent/50",
                  !pairedTo && !selectedLeft && "border-border opacity-60",
                  readOnly && "cursor-default",
                )}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

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
