"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Code,
  ListChecks,
  Link2,
  Type,
  FileText,
  GitBranch,
  Box,
  Bug,
  FileCode,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { QuestionForm } from "./question-form";
import {
  Question,
  QuestionType,
  QUESTION_TYPE_LABELS,
} from "@/lib/types/assignment-tyes";
import {
  getQuestionBuilder,
  isCodingBuilderType,
  DEFAULT_QUESTION_BY_TYPE,
} from "./builders";
import { Badge } from "@/app/_components/ui/badge";

const QUESTION_TYPE_ICONS: Record<QuestionType, typeof Code> = {
  CODING: Code,
  MCQ: ListChecks,
  MATCH_FOLLOWING: Link2,
  FILL_BLANKS: Type,
  OPEN_ENDED: FileText,
  CASE_STUDY: FileText,
  CHAIN_QUESTION: GitBranch,
  BLOCK_DIAGRAM: Box,
  CODE_DEBUG: Bug,
  CODE_FILL: FileCode,
};

interface QuestionsListProps {
  questions: Question[];
  sections: { id: string; title: string }[];
  existingMetrics: { id: string; name: string; description?: string | null }[];
  onQuestionsChange: (questions: Question[]) => void;
}

export function QuestionsList({
  questions,
  sections,
  existingMetrics,
  onQuestionsChange,
}: QuestionsListProps) {
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lastAddedQuestionId = useRef<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string>("1");

  useEffect(() => {
    if (lastAddedQuestionId.current) {
      requestAnimationFrame(() => {
        const questionElement =
          questionRefs.current[lastAddedQuestionId.current!];
        if (questionElement) {
          questionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          lastAddedQuestionId.current = null;
        }
      });
    }
  }, [questions]);

  const addQuestion = (type: QuestionType = "CODING") => {
    const defaults = DEFAULT_QUESTION_BY_TYPE[type]();
    const newQuestion: Question = {
      id: `${Date.now()}`,
      title: "",
      description: "",
      sectionId: sections[0]?.id ?? null,
      ...defaults,
    };
    lastAddedQuestionId.current = newQuestion.id;
    setOpenAccordion(newQuestion.id);
    onQuestionsChange([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      onQuestionsChange(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    onQuestionsChange(newQuestions);
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= questions.length) return;
    const next = [...questions];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onQuestionsChange(next);
  };

  const changeQuestionType = (index: number, newType: QuestionType) => {
    const q = questions[index];
    const defaults = DEFAULT_QUESTION_BY_TYPE[newType]();
    updateQuestion(index, {
      ...q,
      ...defaults,
      id: q.id,
      title: q.title,
      description: q.description,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">Questions</h2>
        <div className="flex items-center gap-2">
          <Select onValueChange={(val) => addQuestion(val as QuestionType)}>
            <SelectTrigger className="w-48 border-border">
              <SelectValue placeholder="Add question..." />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]
              ).map(([type, label]) => {
                const Icon = QUESTION_TYPE_ICONS[type];
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestion("CODING")}
            className="gap-1 border border-border"
          >
            <Plus className="h-4 w-4" />
            Coding Q
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {questions.map((question, index) => {
          const qType = (question.type ?? "CODING") as QuestionType;
          const Icon = QUESTION_TYPE_ICONS[qType] ?? Code;
          const isCoding = isCodingBuilderType(qType);
          const Builder = !isCoding ? getQuestionBuilder(qType) : null;

          return (
            <motion.div
              key={question.id}
              ref={(el) => {
                questionRefs.current[question.id] = el;
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Accordion
                type="single"
                collapsible
                value={openAccordion}
                onValueChange={setOpenAccordion}
              >
                <AccordionItem
                  value={question.id}
                  className="rounded-2xl border border-border bg-background"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {question.title || `Question ${index + 1}`}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {QUESTION_TYPE_LABELS[qType]}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(index);
                        }}
                        className="mr-2 h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove question</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(index, -1);
                        }}
                        className="mr-1 h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move up</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(index, 1);
                        }}
                        className="mr-2 h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move down</span>
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="mb-4 flex flex-wrap gap-3">
                      <Select
                        value={qType}
                        onValueChange={(val) =>
                          changeQuestionType(index, val as QuestionType)
                        }
                      >
                        <SelectTrigger className="w-48 bg-background border-border text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            Object.entries(QUESTION_TYPE_LABELS) as [
                              QuestionType,
                              string,
                            ][]
                          ).map(([type, label]) => (
                            <SelectItem key={type} value={type}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={question.sectionId ?? "none"}
                        onValueChange={(val) =>
                          updateQuestion(index, {
                            ...question,
                            sectionId: val === "none" ? null : val,
                          })
                        }
                      >
                        <SelectTrigger className="w-48 bg-background border-border text-sm">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Section</SelectItem>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {isCoding ? (
                      <QuestionForm
                        question={question}
                        existingMetrics={existingMetrics}
                        onChange={(updatedQuestion) =>
                          updateQuestion(index, updatedQuestion)
                        }
                      />
                    ) : Builder ? (
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">
                              Question Title
                            </label>
                            <input
                              value={question.title}
                              onChange={(e) =>
                                updateQuestion(index, {
                                  ...question,
                                  title: e.target.value,
                                })
                              }
                              placeholder="e.g., Select the correct answer"
                              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">
                              Description
                            </label>
                            <textarea
                              value={question.description}
                              onChange={(e) =>
                                updateQuestion(index, {
                                  ...question,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Provide instructions for this question..."
                              className="flex min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground resize-y"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">
                              Question Points
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={question.points ?? 100}
                              onChange={(e) =>
                                updateQuestion(index, {
                                  ...question,
                                  points: Number(e.target.value) || 0,
                                })
                              }
                              className="flex h-10 w-40 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>
                        <Builder
                          question={question}
                          onChange={(q) => updateQuestion(index, q)}
                        />
                      </div>
                    ) : (
                      <QuestionForm
                        question={question}
                        existingMetrics={existingMetrics}
                        onChange={(updatedQuestion) =>
                          updateQuestion(index, updatedQuestion)
                        }
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
