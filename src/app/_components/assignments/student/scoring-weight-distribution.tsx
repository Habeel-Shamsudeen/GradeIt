"use client";

import { Separator } from "@/app/_components/ui/separator";
import { Question } from "@/lib/types/assignment-tyes";
import { BarChart3 } from "lucide-react";

export interface ScoringWeightDistributionProps {
  questions: Question[];
}

export function ScoringWeightDistribution({
  questions,
}: ScoringWeightDistributionProps) {
  const totalPoints = questions.reduce((acc, q) => acc + (q.points ?? 0), 0);
  const typeBuckets = questions.reduce<Record<string, number>>((acc, q) => {
    const type = q.type ?? "CODING";
    acc[type] = (acc[type] ?? 0) + (q.points ?? 0);
    return acc;
  }, {});

  return (
    <>
      <Separator className="my-6" />
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-medium [&]:m-0">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          Scoring distribution
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Final score is the weighted average of all question scores by points.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-sm">
            <span className="font-medium text-foreground">Total points</span>
            <span className="tabular-nums text-muted-foreground">
              {totalPoints}
            </span>
          </div>
          {Object.entries(typeBuckets).map(([type, points]) => {
            const pct = totalPoints > 0 ? (points / totalPoints) * 100 : 0;
            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{type}</span>
                <span className="tabular-nums text-muted-foreground">
                  {points} pts ({pct.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
