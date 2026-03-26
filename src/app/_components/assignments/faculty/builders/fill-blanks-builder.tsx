"use client";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import { Switch } from "@/app/_components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import type { QuestionBuilderProps } from "./types";
import type {
  FillBlanksContent,
  FillBlanksAnswerKey,
} from "@/lib/types/assignment-tyes";

export function FillBlanksBuilder({
  question,
  onChange,
}: QuestionBuilderProps) {
  const content = (question.content as unknown as FillBlanksContent) || {
    text: "",
    blanks: [],
  };
  const answerKey = (question.answerKey as unknown as FillBlanksAnswerKey) || {
    answers: [],
    partialCredit: true,
  };

  const updateContent = (patch: Partial<FillBlanksContent>) => {
    onChange({ ...question, content: { ...content, ...patch } });
  };

  const updateAnswerKey = (patch: Partial<FillBlanksAnswerKey>) => {
    onChange({ ...question, answerKey: { ...answerKey, ...patch } });
  };

  const addBlank = () => {
    const id = `blank_${content.blanks.length + 1}`;
    onChange({
      ...question,
      content: {
        ...content,
        blanks: [...content.blanks, { id, hint: "" }],
      },
      answerKey: {
        ...answerKey,
        answers: [
          ...answerKey.answers,
          { blankId: id, acceptedValues: [""], caseSensitive: false },
        ],
      },
    });
  };

  const removeBlank = (id: string) => {
    onChange({
      ...question,
      content: {
        ...content,
        blanks: content.blanks.filter((b) => b.id !== id),
      },
      answerKey: {
        ...answerKey,
        answers: answerKey.answers.filter((a) => a.blankId !== id),
      },
    });
  };

  const updateAcceptedValues = (blankId: string, rawValues: string) => {
    updateAnswerKey({
      answers: answerKey.answers.map((a) =>
        a.blankId === blankId
          ? { ...a, acceptedValues: rawValues.split(",").map((v) => v.trim()) }
          : a,
      ),
    });
  };

  const getAcceptedValues = (blankId: string) =>
    answerKey.answers
      .find((a) => a.blankId === blankId)
      ?.acceptedValues.join(", ") ?? "";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Template Text</Label>
        <Textarea
          value={content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="The {{blank_1}} protocol operates on port {{blank_2}}."
          className="min-h-24 bg-background font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Use {"{{blank_id}}"} syntax to mark blanks. e.g. {"{{blank_1}}"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={answerKey.partialCredit !== false}
          onCheckedChange={(val) => updateAnswerKey({ partialCredit: val })}
        />
        <Label className="text-sm">Allow partial credit</Label>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Blanks & Accepted Answers</Label>
        {content.blanks.map((blank) => (
          <div
            key={blank.id}
            className="rounded-lg border border-border bg-muted/20 p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-primary">{`{{${blank.id}}}`}</span>
              {content.blanks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlank(blank.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Input
              value={blank.hint || ""}
              onChange={(e) =>
                updateContent({
                  blanks: content.blanks.map((b) =>
                    b.id === blank.id ? { ...b, hint: e.target.value } : b,
                  ),
                })
              }
              placeholder="Hint (shown to students)"
              className="bg-background text-sm"
            />
            <Input
              value={getAcceptedValues(blank.id)}
              onChange={(e) => updateAcceptedValues(blank.id, e.target.value)}
              placeholder="Accepted values (comma-separated)"
              className="bg-background text-sm"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBlank}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Blank
        </Button>
      </div>
    </div>
  );
}
