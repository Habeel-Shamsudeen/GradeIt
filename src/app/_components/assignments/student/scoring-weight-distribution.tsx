"use client";

import { Separator } from "@/app/_components/ui/separator";
import { EvaluationMetric } from "@/lib/types/assignment-tyes";
import { BarChart3 } from "lucide-react";

export interface ScoringWeightDistributionProps {
  testCaseWeight: number;
  metricsWeight: number;
  metrics: EvaluationMetric[];
}

export function ScoringWeightDistribution({
  testCaseWeight,
  metricsWeight,
  metrics,
}: ScoringWeightDistributionProps) {
  const hasMetrics = metrics.length > 0;
  const effectiveTestCaseWeight = hasMetrics ? testCaseWeight : 100;

  return (
    <>
      <Separator className="my-6" />
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-medium [&]:m-0">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          Scoring & weight distribution
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {hasMetrics
            ? "Your score is split between test cases and evaluation metrics."
            : "Your score is based entirely on passing test cases (hidden/sample tests)."}
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md bg-background/80 px-3 py-2 text-sm">
            <span className="font-medium text-foreground">
              Test cases (passing hidden/sample tests)
            </span>
            <span className="tabular-nums text-muted-foreground">
              {Math.round(effectiveTestCaseWeight)}%
            </span>
          </div>
          {hasMetrics && (
            <div className="rounded-md bg-background/80 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">
                Evaluation metrics (total)
              </span>
              <span className="ml-2 tabular-nums text-muted-foreground">
                {Math.round(metricsWeight)}%
              </span>
              <ul className="mt-2 list-none space-y-1.5 pl-0">
                {metrics.map((m) => {
                  const effectivePct = (m.weight / 100) * metricsWeight;
                  return (
                    <li
                      key={m.id}
                      className="flex items-center justify-between text-muted-foreground"
                    >
                      <span className="text-sm">
                        {m.name}
                        {m.description && (
                          <span className="ml-1.5 text-xs opacity-90">
                            — {m.description}
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">
                        {effectivePct % 1 === 0
                          ? Math.round(effectivePct)
                          : effectivePct.toFixed(1)}
                        %
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
