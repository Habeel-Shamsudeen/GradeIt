"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/app/_components/ui/button";
import type { Section } from "@/lib/types/assignment-tyes";
import { ChevronRight } from "lucide-react";

interface SectionNavProps {
  sections: Section[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function SectionNav({
  sections,
  currentIndex,
  onSelect,
}: SectionNavProps) {
  if (sections.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-4 py-2 bg-muted/30">
      {sections.map((section, index) => (
        <div key={section.id} className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(index)}
            className={cn(
              "h-7 rounded-full px-3 text-xs font-medium transition-all",
              currentIndex === index
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : currentIndex > index
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/60 hover:text-muted-foreground",
            )}
          >
            <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-background/20 text-[10px]">
              {index + 1}
            </span>
            {section.title}
          </Button>
          {index < sections.length - 1 && (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
          )}
        </div>
      ))}
    </div>
  );
}
