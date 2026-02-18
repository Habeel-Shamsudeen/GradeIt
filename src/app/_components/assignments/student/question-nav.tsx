"use client";

import { Check, Circle, Clock } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { Question } from "@/lib/types/assignment-tyes";

interface QuestionNavProps {
  questions: Question[];
  currentIndex: number;
  onSelect: (index: number) => void;
  questionStatus?: Record<string, "passed" | "attempted">;
}

export function QuestionNav({
  questions,
  currentIndex,
  onSelect,
  questionStatus = {},
}: QuestionNavProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {questions.map((question, index) => {
        const status = questionStatus[question.id];
        return (
          <Button
            key={question.id}
            variant="ghost"
            onClick={() => onSelect(index)}
            className={cn(
              "h-8 gap-1.5 rounded-full px-3 text-sm",
              currentIndex === index && "bg-accent",
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white text-xs">
              {index + 1}
            </span>
            <span className="hidden sm:inline">{question.title}</span>
            {status === "passed" ? (
              <Check
                className="h-3.5 w-3.5 text-green-500 shrink-0"
                aria-label="Passed"
              />
            ) : status === "attempted" ? (
              <Clock
                className="h-3.5 w-3.5 text-amber-500 shrink-0"
                aria-label="Attempted"
              />
            ) : (
              <Circle
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                aria-label="Not attempted"
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
