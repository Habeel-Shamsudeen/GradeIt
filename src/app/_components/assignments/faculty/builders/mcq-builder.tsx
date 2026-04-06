"use client";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { Switch } from "@/app/_components/ui/switch";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import type { QuestionBuilderProps } from "./types";
import type { MCQContent, MCQAnswerKey } from "@/lib/types/assignment-tyes";

export function MCQBuilder({ question, onChange }: QuestionBuilderProps) {
  const content = (question.content as unknown as MCQContent) || {
    options: [],
    allowMultiple: false,
    shuffleOptions: true,
  };
  const answerKey = (question.answerKey as unknown as MCQAnswerKey) || {
    correctOptions: [],
    explanation: "",
  };

  const updateContent = (patch: Partial<MCQContent>) => {
    onChange({ ...question, content: { ...content, ...patch } });
  };

  const updateAnswerKey = (patch: Partial<MCQAnswerKey>) => {
    onChange({ ...question, answerKey: { ...answerKey, ...patch } });
  };

  const addOption = () => {
    const nextId = String.fromCharCode(97 + content.options.length);
    updateContent({
      options: [...content.options, { id: nextId, text: "", image: null }],
    });
  };

  const removeOption = (id: string) => {
    updateContent({ options: content.options.filter((o) => o.id !== id) });
    updateAnswerKey({
      correctOptions: answerKey.correctOptions.filter((o) => o !== id),
    });
  };

  const updateOptionText = (id: string, text: string) => {
    updateContent({
      options: content.options.map((o) => (o.id === id ? { ...o, text } : o)),
    });
  };

  const toggleCorrect = (id: string) => {
    const isCorrect = answerKey.correctOptions.includes(id);
    if (content.allowMultiple) {
      updateAnswerKey({
        correctOptions: isCorrect
          ? answerKey.correctOptions.filter((o) => o !== id)
          : [...answerKey.correctOptions, id],
      });
    } else {
      updateAnswerKey({ correctOptions: [id] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={content.allowMultiple}
            onCheckedChange={(val) => {
              updateContent({ allowMultiple: val });
              if (!val && answerKey.correctOptions.length > 1) {
                updateAnswerKey({
                  correctOptions: [answerKey.correctOptions[0]],
                });
              }
            }}
          />
          <Label className="text-sm">Allow multiple selections</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={content.shuffleOptions ?? true}
            onCheckedChange={(val) => updateContent({ shuffleOptions: val })}
          />
          <Label className="text-sm">Shuffle options</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Options</Label>
        {content.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              checked={answerKey.correctOptions.includes(option.id)}
              onCheckedChange={() => toggleCorrect(option.id)}
              className="shrink-0"
            />
            <span className="w-6 text-center text-xs font-medium uppercase text-muted-foreground">
              {option.id}
            </span>
            <Input
              value={option.text}
              onChange={(e) => updateOptionText(option.id, e.target.value)}
              placeholder={`Option ${option.id.toUpperCase()}`}
              className="flex-1 bg-background"
            />
            {content.options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(option.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Option
        </Button>
        <p className="text-xs text-muted-foreground">
          Check the box next to correct option(s)
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Explanation (optional)</Label>
        <Input
          value={answerKey.explanation || ""}
          onChange={(e) => updateAnswerKey({ explanation: e.target.value })}
          placeholder="Why is this the correct answer?"
          className="bg-background"
        />
      </div>
    </div>
  );
}
