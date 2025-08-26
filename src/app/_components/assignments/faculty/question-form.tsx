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

interface QuestionFormProps {
  question: Question;
  onChange: (question: Question) => void;
}

export function QuestionForm({ question, onChange }: QuestionFormProps) {
  const updateField = (field: keyof Question, value: any) => {
    onChange({
      ...question,
      [field]: value,
    });
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
            value={question.language}
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

      <TestCasesList
        testCases={question.testCases}
        onTestCasesChange={(testCases) => updateField("testCases", testCases)}
        questionTitle={question.title}
        questionDescription={question.description}
        questionLanguage={question.language}
        questionId={question.id}
      />
    </div>
  );
}
