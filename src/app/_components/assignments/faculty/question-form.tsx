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
import { Separator } from "@/app/_components/ui/separator";
import { Question } from "@/lib/types/assignment-tyes";
import { LANGUAGE_ID_MAP } from "@/config/constants";
import { LanguageIcon } from "../../ui/language-icon";
import { Language } from "@/lib/types/config-types";
import { TestCasesList } from "./test-cases-list";
import { Button } from "@/app/_components/ui/button";
import { Trash2 } from "lucide-react";

interface ExistingMetric {
  id: string;
  name: string;
  description?: string | null;
}

interface QuestionFormProps {
  question: Question;
  onChange: (question: Question) => void;
  existingMetrics?: ExistingMetric[];
}

export function QuestionForm({
  question,
  onChange,
  existingMetrics = [],
}: QuestionFormProps) {
  const updateField = (field: keyof Question, value: any) => {
    onChange({
      ...question,
      [field]: value,
    });
  };

  const questionMetrics = question.questionMetrics ?? [];
  const testCaseWeight = question.testCaseWeight ?? 100;
  const metricsWeight = question.metricsWeight ?? 0;

  const addMetric = (metricId: string) => {
    if (questionMetrics.some((m) => m.id === metricId)) return;
    const found = existingMetrics.find((m) => m.id === metricId);
    if (!found) return;
    updateField("questionMetrics", [
      ...questionMetrics,
      {
        id: found.id,
        name: found.name,
        description: found.description,
        weight: 0,
      },
    ]);
  };

  const removeMetric = (metricId: string) => {
    updateField(
      "questionMetrics",
      questionMetrics.filter((m) => m.id !== metricId),
    );
  };

  const updateMetricWeight = (metricId: string, weight: number) => {
    updateField(
      "questionMetrics",
      questionMetrics.map((m) => (m.id === metricId ? { ...m, weight } : m)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label
            htmlFor={`question-${question.id}-title`}
            className="text-foreground"
          >
            Question Title
          </Label>
          <Input
            id={`question-${question.id}-title`}
            value={question.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., Implement a Binary Search Tree"
            className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor={`question-${question.id}-description`}
            className="text-foreground"
          >
            Description
          </Label>
          <Textarea
            id={`question-${question.id}-description`}
            value={question.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Provide detailed instructions for this question..."
            className="min-h-32 resize-y bg-background border border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor={`question-${question.id}-language`}
            className="text-foreground"
          >
            Programming Language
          </Label>
          <Select
            value={question.language ?? "Python"}
            onValueChange={(value) => updateField("language", value)}
          >
            <SelectTrigger
              id={`question-${question.id}-language`}
              className="bg-background border border-border text-foreground"
            >
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(LANGUAGE_ID_MAP).map((language) => (
                <SelectItem key={language} value={language}>
                  <LanguageIcon language={language as Language} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-6 bg-border" />

      <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            Coding Scoring Configuration
          </h4>
          <p className="text-xs text-muted-foreground">
            This applies only to this coding question
          </p>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm">Test Cases vs Metrics</Label>
          <Input
            type="range"
            min={0}
            max={100}
            step={5}
            value={testCaseWeight}
            onChange={(e) => {
              const tc = Number(e.target.value);
              onChange({
                ...question,
                testCaseWeight: tc,
                metricsWeight: 100 - tc,
              });
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Test Cases: {testCaseWeight}%</span>
            <span>Metrics: {metricsWeight}%</span>
          </div>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm">Question Points</Label>
          <Input
            type="number"
            min={0}
            value={question.points ?? 100}
            onChange={(e) => updateField("points", Number(e.target.value) || 0)}
            className="max-w-32 bg-background"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm">Evaluation Metrics</Label>
          <Select onValueChange={addMetric}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Add a metric" />
            </SelectTrigger>
            <SelectContent>
              {existingMetrics
                .filter((m) => !questionMetrics.some((qm) => qm.id === m.id))
                .map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {questionMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex items-center gap-2 rounded-md border border-border bg-background p-2"
            >
              <span className="flex-1 text-sm">{metric.name}</span>
              <Input
                type="number"
                min={0}
                max={100}
                value={metric.weight}
                onChange={(e) =>
                  updateMetricWeight(metric.id, Number(e.target.value) || 0)
                }
                className="w-20 bg-background"
              />
              <span className="text-xs text-muted-foreground">%</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMetric(metric.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {questionMetrics.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No metrics selected. Scoring will use test cases only.
            </p>
          )}
        </div>
      </div>

      <TestCasesList
        testCases={question.testCases ?? []}
        onTestCasesChange={(testCases) => updateField("testCases", testCases)}
        questionTitle={question.title}
        questionDescription={question.description}
        questionLanguage={question.language ?? "Python"}
        questionId={question.id}
      />
    </div>
  );
}
