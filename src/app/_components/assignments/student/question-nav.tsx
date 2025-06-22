"use client";

import { Check, Clock } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { Question } from "@/lib/types/assignment-tyes";

interface QuestionNavProps {
  questions: Question[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function QuestionNav({
  questions,
  currentIndex,
  onSelect,
}: QuestionNavProps) {
  return (
    <div className="flex items-center gap-2">
      {questions.map((question, index) => (
        <Button
          key={question.id}
          variant="ghost"
          onClick={() => onSelect(index)}
          className={cn(
            "h-8 gap-1.5 rounded-full px-3 text-sm",
            currentIndex === index && "bg-accent",
          )}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs">
            {index + 1}
          </span>
          <span className="hidden sm:inline">{question.title}</span>
          {/* Status indicators would be dynamic based on user's progress */}
          {index === 0 ? (
            <Check className="h-3.5 w-3.5 text-[#7EBF8E]" />
          ) : (
            <Clock className="h-3.5 w-3.5 text-[#605F5B]" />
          )}
        </Button>
      ))}
    </div>
  );
}
