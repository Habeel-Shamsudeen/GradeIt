"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { QuestionsList } from "./questions-list";
import {
  EvaluationMetrics,
  ExistingMetric,
  type EvaluationMetric,
} from "./evaluation-metrics";
import {
  createAssignment,
  updateAssignment,
} from "@/server/actions/assignment-actions";
import { AssignmentById, Question } from "@/lib/types/assignment-tyes";
import { toast } from "sonner";
import { Switch } from "../../ui/switch";

function toDateTimeLocal(d: Date | null): string {
  if (!d) return "";
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

function mapAssignmentToFormState(data: AssignmentById) {
  const questions: Question[] = data.questions.map((q, i) => ({
    id: String((q as { id?: string }).id ?? i + 1),
    title: q.title,
    description: q.description,
    language: q.language,
    testCases: (
      q as {
        testCases?: {
          id: string;
          input: string;
          expectedOutput: string;
          hidden: boolean;
        }[];
      }
    ).testCases?.map((tc, j) => ({
      id: tc?.id ?? String(j + 1),
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      hidden: tc.hidden,
    })) ?? [{ id: "1", input: "", expectedOutput: "", hidden: false }],
  }));
  return {
    title: data.title,
    description: data.description ?? "",
    dueDate: toDateTimeLocal(data.dueDate),
    startDate: toDateTimeLocal(data.startDate ?? null),
    allowLateSubmission: data.allowLateSubmission ?? true,
    copyPastePrevention: data.copyPastePrevention ?? false,
    fullScreenEnforcement: data.fullScreenEnforcement ?? false,
    metrics: data.metrics ?? [],
    testCaseWeight: data.testCaseWeight ?? 100,
    metricsWeight: data.metricsWeight ?? 0,
    questions:
      questions.length > 0
        ? questions
        : [
            {
              id: "1",
              title: "",
              description: "",
              language: "Python",
              testCases: [
                { id: "1", input: "", expectedOutput: "", hidden: false },
              ],
            },
          ],
  };
}

const defaultQuestions: Question[] = [
  {
    id: "1",
    title: "",
    description: "",
    language: "Python",
    testCases: [{ id: "1", input: "", expectedOutput: "", hidden: false }],
  },
];

interface CreateAssignmentFormProps {
  classCode: string;
  existingMetrics: ExistingMetric[];
  mode?: "create" | "edit";
  assignmentId?: string;
  initialData?: AssignmentById;
}

export function CreateAssignmentForm({
  classCode,
  existingMetrics,
  mode = "create",
  assignmentId,
  initialData,
}: CreateAssignmentFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && assignmentId && initialData;
  const initial = isEdit ? mapAssignmentToFormState(initialData) : null;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [allowLateSubmission, setAllowLateSubmission] = useState(
    initial?.allowLateSubmission ?? true,
  );
  const [copyPastePrevention, setCopypasteprevention] = useState(
    initial?.copyPastePrevention ?? false,
  );
  const [fullScreenEnforcement, setFullScreenEnforcement] = useState(
    initial?.fullScreenEnforcement ?? false,
  );
  const [metrics, setMetrics] = useState<EvaluationMetric[]>(
    initial?.metrics ?? [],
  );
  const [testCaseWeight, setTestCaseWeight] = useState(
    initial?.testCaseWeight ?? 100,
  );
  const [metricsWeight, setMetricsWeight] = useState(
    initial?.metricsWeight ?? 0,
  );
  const [questions, setQuestions] = useState<Question[]>(
    initial?.questions ?? defaultQuestions,
  );
  const [loading, setLoading] = useState(false);

  const handleWeightageChange = (
    newTestCaseWeight: number,
    newMetricsWeight: number,
  ) => {
    setTestCaseWeight(newTestCaseWeight);
    setMetricsWeight(newMetricsWeight);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && assignmentId) {
        const response = await updateAssignment({
          assignmentId,
          title,
          description,
          dueDate,
          startDate: startDate || undefined,
          allowLateSubmission,
          questions: questions as any,
          copyPastePrevention,
          fullScreenEnforcement,
          testCaseWeight,
          metricsWeight,
          metrics,
        });
        if (response.status === "success") {
          toast.success("Assignment updated successfully!");
          router.push(`/classes/${classCode}/${assignmentId}`);
        } else {
          toast.warning(response.message ?? "Failed to update assignment");
        }
      } else {
        const response = await createAssignment({
          title,
          description,
          dueDate,
          startDate: startDate || undefined,
          allowLateSubmission,
          classCode,
          questions: questions as any,
          copyPastePrevention,
          fullScreenEnforcement,
          testCaseWeight,
          metricsWeight,
          metrics,
        });
        if (response.status === "success") {
          toast.success("Assignment created successfully!");
          router.push(`/classes/${classCode}`);
        } else {
          console.error(response.message);
          toast.warning("Failed to create assignment");
        }
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="rounded-2xl border border-border bg-background">
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-foreground">
                Assignment Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Binary Search Trees Implementation"
                className="bg-background border border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed instructions for the assignment..."
                className="min-h-32 resize-y bg-background border border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate" className="text-foreground">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-background border border-border text-foreground"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startDate" className="text-foreground">
                Start Date (optional)
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-background border border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Assignment is hidden from students until this time. Leave empty
                to make it visible immediately.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="allowLateSubmission" className="text-foreground">
                Allow late submission
              </Label>
              <Switch
                checked={allowLateSubmission}
                onCheckedChange={setAllowLateSubmission}
              />
              <span className="text-sm text-muted-foreground">
                If disabled, assignment is hidden after the due date.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="copyPastePrevention"
                  className="text-foreground"
                >
                  Disable copy paste
                </Label>
                <Switch
                  checked={copyPastePrevention}
                  onCheckedChange={() => setCopypasteprevention((c) => !c)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="fullScreenEnforcement"
                  className="text-foreground"
                >
                  Full screen enforcement
                </Label>
                <Switch
                  checked={fullScreenEnforcement}
                  onCheckedChange={() => setFullScreenEnforcement((c) => !c)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EvaluationMetrics
        metrics={metrics}
        onMetricsChange={setMetrics}
        existingMetrics={existingMetrics}
        testCaseWeight={testCaseWeight}
        metricsWeight={metricsWeight}
        onWeightageChange={handleWeightageChange}
      />

      <QuestionsList questions={questions} onQuestionsChange={setQuestions} />

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border border-border text-foreground"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className=" bg-primary-button text-white hover:bg-primary-button-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save changes"
              : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
}
