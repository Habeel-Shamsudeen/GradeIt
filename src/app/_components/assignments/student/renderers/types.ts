import type { QuestionType } from "@/lib/types/assignment-tyes";

export interface QuestionRendererProps {
  question: {
    id: string;
    type?: QuestionType;
    title: string;
    description: string;
    content?: Record<string, unknown> | null;
    answerKey?: Record<string, unknown> | null;
    points?: number;
    language?: string | null;
    testCases?: {
      id: string;
      input: string;
      expectedOutput: string;
      hidden: boolean;
      description?: string | null;
    }[];
  };
  value: unknown;
  onChange: (value: unknown) => void;
  readOnly?: boolean;
  showFeedback?: boolean;
  feedback?: { score: number; feedback: string } | null;
}
