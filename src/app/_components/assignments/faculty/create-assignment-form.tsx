"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Code } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { QuestionForm } from "./question-form";
import { createAssignment } from "@/server/actions/assignment-actions";
import { Question } from "@/lib/types/assignment-tyes";
import { toast } from "sonner";
import { Switch } from "../../ui/switch";

interface CreateAssignmentFormProps {
  classCode: string;
}

export function CreateAssignmentForm({ classCode }: CreateAssignmentFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [copyPastePrevention, setCopypasteprevention] =
    useState<boolean>(false);
  const [fullScreenEnforcement, setFullScreenEnforcement] =
    useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      title: "",
      description: "",
      language: "Python",
      testCases: [
        {
          id: "1",
          input: "",
          expectedOutput: "",
          hidden: false,
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `${questions.length + 1}`,
        title: "",
        description: "",
        language: "python",
        testCases: [
          {
            id: "1",
            input: "",
            expectedOutput: "",
            hidden: false,
          },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createAssignment({
        title,
        description,
        dueDate,
        classCode,
        questions,
        copyPastePrevention,
        fullScreenEnforcement,
      });

      if (response.status === "success") {
        toast.success("Assignment created successfully!");
        router.push(`/classes/${classCode}`);
      } else {
        console.error(response.message);
        toast.warning("Failed to create assignment");
      }
    } catch (error) {
      console.error("Error creating class:", error);
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
                required
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Questions</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="gap-1 border border-border"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        <AnimatePresence>
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Accordion type="single" collapsible defaultValue={question.id}>
                <AccordionItem
                  value={question.id}
                  className="rounded-2xl border border-border bg-background"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {question.title || `Question ${index + 1}`}
                        </span>
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
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <QuestionForm
                      question={question}
                      onChange={(updatedQuestion) =>
                        updateQuestion(index, updatedQuestion)
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
          {loading ? "Creating..." : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
}
