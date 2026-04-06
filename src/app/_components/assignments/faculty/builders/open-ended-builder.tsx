"use client";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import type { QuestionBuilderProps } from "./types";
import type {
  OpenEndedContent,
  OpenEndedAnswerKey,
} from "@/lib/types/assignment-tyes";

export function OpenEndedBuilder({ question, onChange }: QuestionBuilderProps) {
  const content = (question.content as unknown as OpenEndedContent) || {
    prompt: "",
    minWords: 0,
    maxWords: 0,
  };
  const answerKey = (question.answerKey as unknown as OpenEndedAnswerKey) || {
    rubric: "",
    sampleAnswer: "",
    evaluationMethod: "LLM",
  };

  const updateContent = (patch: Partial<OpenEndedContent>) => {
    onChange({ ...question, content: { ...content, ...patch } });
  };

  const updateAnswerKey = (patch: Partial<OpenEndedAnswerKey>) => {
    onChange({ ...question, answerKey: { ...answerKey, ...patch } });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Prompt (optional)</Label>
        <Textarea
          value={content.prompt || ""}
          onChange={(e) => updateContent({ prompt: e.target.value })}
          placeholder="Additional context or specific instructions..."
          className="min-h-20 bg-background text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Min Words</Label>
          <Input
            type="number"
            value={content.minWords || ""}
            onChange={(e) =>
              updateContent({ minWords: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Max Words</Label>
          <Input
            type="number"
            value={content.maxWords || ""}
            onChange={(e) =>
              updateContent({ maxWords: parseInt(e.target.value) || 0 })
            }
            placeholder="No limit"
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Evaluation Method</Label>
        <Select
          value={answerKey.evaluationMethod || "LLM"}
          onValueChange={(val) =>
            updateAnswerKey({
              evaluationMethod: val as "LLM" | "MANUAL",
            })
          }
        >
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LLM">AI-Assisted (LLM)</SelectItem>
            <SelectItem value="MANUAL">Manual Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Rubric</Label>
        <Textarea
          value={answerKey.rubric || ""}
          onChange={(e) => updateAnswerKey({ rubric: e.target.value })}
          placeholder="1) Mentions key concept X (30pts)&#10;2) Explains relationship Y (40pts)&#10;3) Provides real-world example (30pts)"
          className="min-h-24 bg-background text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Define grading criteria. Used by AI or as a guide for manual review.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Sample Answer (optional)</Label>
        <Textarea
          value={answerKey.sampleAnswer || ""}
          onChange={(e) => updateAnswerKey({ sampleAnswer: e.target.value })}
          placeholder="An ideal answer would include..."
          className="min-h-20 bg-background text-sm"
        />
      </div>
    </div>
  );
}
