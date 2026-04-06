"use client";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { Switch } from "@/app/_components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { QuestionBuilderProps } from "./types";
import type { MatchContent, MatchAnswerKey } from "@/lib/types/assignment-tyes";

export function MatchBuilder({ question, onChange }: QuestionBuilderProps) {
  const content = (question.content as unknown as MatchContent) || {
    leftItems: [],
    rightItems: [],
  };
  const answerKey = (question.answerKey as unknown as MatchAnswerKey) || {
    correctPairs: [],
    partialCredit: true,
  };

  const updateContent = (patch: Partial<MatchContent>) => {
    onChange({ ...question, content: { ...content, ...patch } });
  };

  const updateAnswerKey = (patch: Partial<MatchAnswerKey>) => {
    onChange({ ...question, answerKey: { ...answerKey, ...patch } });
  };

  const addLeftItem = () => {
    const id = `l${content.leftItems.length + 1}`;
    updateContent({ leftItems: [...content.leftItems, { id, text: "" }] });
  };

  const addRightItem = () => {
    const id = `r${content.rightItems.length + 1}`;
    updateContent({ rightItems: [...content.rightItems, { id, text: "" }] });
  };

  const removeLeftItem = (id: string) => {
    updateContent({ leftItems: content.leftItems.filter((i) => i.id !== id) });
    updateAnswerKey({
      correctPairs: answerKey.correctPairs.filter((p) => p.left !== id),
    });
  };

  const removeRightItem = (id: string) => {
    updateContent({
      rightItems: content.rightItems.filter((i) => i.id !== id),
    });
    updateAnswerKey({
      correctPairs: answerKey.correctPairs.filter((p) => {
        const right = Array.isArray(p.right) ? p.right : [p.right];
        return !right.includes(id);
      }),
    });
  };

  const setMapping = (leftId: string, rightId: string) => {
    const existing = answerKey.correctPairs.filter((p) => p.left !== leftId);
    if (rightId) {
      existing.push({ left: leftId, right: rightId });
    }
    updateAnswerKey({ correctPairs: existing });
  };

  const getMappedRight = (leftId: string) => {
    const pair = answerKey.correctPairs.find((p) => p.left === leftId);
    if (!pair) return "";
    return Array.isArray(pair.right) ? pair.right[0] : pair.right;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          checked={answerKey.partialCredit !== false}
          onCheckedChange={(val) => updateAnswerKey({ partialCredit: val })}
        />
        <Label className="text-sm">Allow partial credit</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Left Items</Label>
          {content.leftItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                value={item.text}
                onChange={(e) =>
                  updateContent({
                    leftItems: content.leftItems.map((i) =>
                      i.id === item.id ? { ...i, text: e.target.value } : i,
                    ),
                  })
                }
                placeholder={`Item ${item.id}`}
                className="flex-1 bg-background"
              />
              {content.leftItems.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLeftItem(item.id)}
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
            onClick={addLeftItem}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Right Items</Label>
          {content.rightItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                value={item.text}
                onChange={(e) =>
                  updateContent({
                    rightItems: content.rightItems.map((i) =>
                      i.id === item.id ? { ...i, text: e.target.value } : i,
                    ),
                  })
                }
                placeholder={`Match ${item.id}`}
                className="flex-1 bg-background"
              />
              {content.rightItems.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRightItem(item.id)}
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
            onClick={addRightItem}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Match
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Correct Mappings</Label>
        {content.leftItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="w-24 truncate text-sm text-muted-foreground">
              {item.text || item.id}
            </span>
            <span className="text-xs text-muted-foreground">&rarr;</span>
            <Select
              value={getMappedRight(item.id)}
              onValueChange={(val) => setMapping(item.id, val)}
            >
              <SelectTrigger className="flex-1 bg-background">
                <SelectValue placeholder="Select match" />
              </SelectTrigger>
              <SelectContent>
                {content.rightItems.map((ri) => (
                  <SelectItem key={ri.id} value={ri.id}>
                    {ri.text || ri.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
