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
import { ExistingMetric, type EvaluationMetric } from "./evaluation-metrics";
import {
  createAssignment,
  updateAssignment,
} from "@/server/actions/assignment-actions";
import { AssignmentById, Question } from "@/lib/types/assignment-tyes";
import { toast } from "sonner";
import { Switch } from "../../ui/switch";
import { Badge } from "@/app/_components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

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
  const CODING_TYPES = new Set(["CODING", "CODE_DEBUG", "CODE_FILL"]);
  const mappedQuestions: Question[] = data.questions.map((q, i) => {
    const isCoding = CODING_TYPES.has(q.type ?? "CODING");
    return {
      id: String((q as { id?: string }).id ?? i + 1),
      type: q.type ?? "CODING",
      title: q.title,
      description: q.description,
      language: isCoding ? (q.language ?? "Python") : undefined,
      order: q.order ?? i,
      points: q.points ?? 100,
      testCaseWeight: isCoding ? (q.testCaseWeight ?? 100) : undefined,
      metricsWeight: isCoding ? (q.metricsWeight ?? 0) : undefined,
      questionMetrics: isCoding
        ? ((q as { questionMetrics?: any[] }).questionMetrics?.map((m) => ({
            id: m.metricId ?? m.metric?.id ?? m.id,
            name: m.metric?.name ?? m.name,
            description: m.metric?.description ?? m.description,
            weight: m.weight ?? 0,
          })) ?? [])
        : [],
      content: (q.content as any) ?? null,
      answerKey: (q.answerKey as any) ?? null,
      sectionId: q.sectionId ?? null,
      testCases: isCoding
        ? ((
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
          })) ?? [{ id: "1", input: "", expectedOutput: "", hidden: false }])
        : undefined,
    };
  });
  const sections =
    data.sections?.map((s, idx) => ({
      id: s.id ?? `section-${idx + 1}`,
      title: s.title,
      description: s.description ?? "",
      order: s.order ?? idx,
    })) ?? [];

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
    sections,
    questions:
      mappedQuestions.length > 0
        ? mappedQuestions
        : [
            {
              id: "1",
              title: "",
              description: "",
              type: "CODING" as const,
              language: "Python",
              points: 100,
              testCaseWeight: 100,
              metricsWeight: 0,
              questionMetrics: [],
              content: null,
              answerKey: null,
              sectionId: sections[0]?.id ?? null,
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
    type: "CODING",
    language: "Python",
    points: 100,
    testCaseWeight: 100,
    metricsWeight: 0,
    questionMetrics: [],
    sectionId: null,
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
  const [sections, setSections] = useState<
    { id: string; title: string; description?: string; order: number }[]
  >(
    initial?.sections ?? [
      { id: "section-1", title: "Section 1", description: "", order: 0 },
    ],
  );
  const [questions, setQuestions] = useState<Question[]>(
    initial?.questions ?? defaultQuestions,
  );
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const totalPoints = questions.reduce((acc, q) => acc + (q.points ?? 0), 0);
  const sectionPoints = sections.map((section) => ({
    sectionId: section.id,
    total: questions
      .filter((q) => q.sectionId === section.id)
      .reduce((acc, q) => acc + (q.points ?? 0), 0),
  }));
  const typeDistribution = questions.reduce<Record<string, number>>(
    (acc, q) => {
      const type = q.type ?? "CODING";
      acc[type] = (acc[type] ?? 0) + (q.points ?? 0);
      return acc;
    },
    {},
  );

  const addSection = () => {
    const nextIndex = sections.length + 1;
    setSections((prev) => [
      ...prev,
      {
        id: `section-${Date.now()}`,
        title: `Section ${nextIndex}`,
        description: "",
        order: prev.length,
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        sectionId: q.sectionId === sectionId ? null : q.sectionId,
      })),
    );
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
          sections: sections.map((s, i) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            order: i,
            questions: questions.filter((q) => q.sectionId === s.id),
          })) as any,
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
          sections: sections.map((s, i) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            order: i,
            questions: questions.filter((q) => q.sectionId === s.id),
          })) as any,
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

  const updateQuestionPoints = (questionId: string, points: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, points } : q)),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={currentStep === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep(1)}
          >
            1. Details
          </Button>
          <Button
            type="button"
            variant={currentStep === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep(2)}
          >
            2. Build
          </Button>
          <Button
            type="button"
            variant={currentStep === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep(3)}
          >
            3. Review
          </Button>
        </div>
        <Badge variant="secondary">Total points: {totalPoints}</Badge>
      </div>

      {currentStep === 1 && (
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
                  Assignment is hidden from students until this time. Leave
                  empty to make it visible immediately.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="allowLateSubmission"
                  className="text-foreground"
                >
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
      )}

      {currentStep === 2 && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="rounded-2xl border border-border bg-background">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Sections</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addSection}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="rounded-lg border border-border bg-muted/20 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? { ...s, title: e.target.value }
                                : s,
                            ),
                          )
                        }
                        className="h-8 bg-background text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(section.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {
                        questions.filter((q) => q.sectionId === section.id)
                          .length
                      }{" "}
                      question(s)
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                Drag-reorder is available via up/down controls inside each
                question card.
              </div>
            </CardContent>
          </Card>

          <QuestionsList
            questions={questions}
            sections={sections}
            existingMetrics={existingMetrics}
            onQuestionsChange={setQuestions}
          />
        </div>
      )}

      {currentStep === 3 && (
        <Card className="rounded-2xl border border-border bg-background">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Review and Publish</h3>
              <p className="text-sm text-muted-foreground">
                Verify structure, point distribution, and scoring setup before
                publishing.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Sections</p>
                <p className="text-xl font-semibold">{sections.length}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Questions</p>
                <p className="text-xl font-semibold">{questions.length}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Total Points</p>
                <p className="text-xl font-semibold">{totalPoints}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <h4 className="text-sm font-semibold">Section scoring</h4>
              {sections.map((section) => {
                const questionsInSection = questions.filter(
                  (q) => q.sectionId === section.id,
                );
                const subtotal =
                  sectionPoints.find((s) => s.sectionId === section.id)
                    ?.total ?? 0;
                return (
                  <div
                    key={section.id}
                    className="rounded-md border border-border bg-muted/20 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{section.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Subtotal: {subtotal} pts
                      </p>
                    </div>
                    {questionsInSection.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No questions in this section.
                      </p>
                    ) : (
                      questionsInSection.map((q, idx) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-xs text-muted-foreground">
                            Q{idx + 1}: {q.title || "Untitled question"}
                          </span>
                          <Input
                            type="number"
                            min={0}
                            value={q.points ?? 100}
                            onChange={(e) =>
                              updateQuestionPoints(
                                q.id,
                                Number(e.target.value) || 0,
                              )
                            }
                            className="h-8 w-28 bg-background text-xs"
                          />
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <p className="text-sm font-semibold">Grand Total</p>
                <div className="text-right">
                  <p className="text-sm font-semibold">{totalPoints} pts</p>
                  {totalPoints !== 100 && (
                    <p className="text-xs text-amber-600">
                      Recommended total is 100 points.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <h4 className="text-sm font-semibold">
                Point distribution by type
              </h4>
              {Object.entries(typeDistribution).map(([type, pts]) => {
                const pct = totalPoints > 0 ? (pts / totalPoints) * 100 : 0;
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{type}</span>
                      <span>
                        {pts} pts ({pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded bg-muted">
                      <div
                        className="h-2 rounded bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
          disabled={currentStep === 1}
          className="border border-border text-foreground"
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.min(3, s + 1) as 1 | 2 | 3)}
          disabled={currentStep === 3}
          className="border border-border text-foreground"
        >
          Next
        </Button>
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
