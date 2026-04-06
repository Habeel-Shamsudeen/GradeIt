"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/app/_components/ui/textarea";
import type { QuestionRendererProps } from "./types";
import type { BlockDiagramResponse } from "@/lib/types/assignment-tyes";
import { Check, X } from "lucide-react";

export function BlockDiagramRenderer({
  question,
  value,
  onChange,
  readOnly,
  showFeedback,
  feedback,
}: QuestionRendererProps) {
  const response = (value as BlockDiagramResponse) || { nodes: [], edges: [] };

  // For now, render a JSON editor. A full canvas editor can be added later.
  const jsonValue = JSON.stringify(response, null, 2);

  const handleChange = (raw: string) => {
    if (readOnly) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.nodes && parsed.edges) {
        onChange(parsed as BlockDiagramResponse);
      }
    } catch {
      // ignore invalid JSON while typing
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Diagram Data (JSON)
        </p>
        <Textarea
          value={jsonValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='{"nodes": [...], "edges": [...]}'
          className="min-h-48 resize-y bg-background font-mono text-xs"
          disabled={readOnly}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Define nodes with id, label, x, y and edges with from, to, label. A
          visual editor will be available in a future update.
        </p>
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
