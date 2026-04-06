"use client";

import { Separator } from "@/app/_components/ui/separator";
import {
  Question,
  CODING_QUESTION_TYPES,
  type QuestionType,
} from "@/lib/types/assignment-tyes";

interface QuestionDescriptionProps {
  question: Question;
  hideTitle?: boolean;
}

export function QuestionDescription({
  question,
  hideTitle = false,
}: QuestionDescriptionProps) {
  const isCoding = CODING_QUESTION_TYPES.includes(
    (question.type ?? "CODING") as QuestionType,
  );
  const visibleTestCases = question.testCases?.filter((tc) => !tc.hidden) ?? [];

  return (
    <div className="prose prose-slate max-w-none">
      {!hideTitle && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="m-0 text-2xl font-medium">{question.title}</h1>
          </div>
          <Separator className="my-4" />
        </>
      )}

      <div className="[&>h2]:text-lg [&>h2]:font-medium [&>p]:text-muted-foreground [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg">
        <div dangerouslySetInnerHTML={{ __html: question.description }} />

        {isCoding && visibleTestCases.length > 0 && (
          <>
            <h2>Example Test Cases:</h2>
            {visibleTestCases.map((testCase) => (
              <div
                key={testCase.id}
                className="mb-6 rounded-lg border border-border p-4"
              >
                <div className="mb-2">
                  <strong className="text-sm font-medium">Input:</strong>
                  <pre className="mt-1 rounded bg-muted p-2 text-sm">
                    {testCase.input}
                  </pre>
                </div>
                <div>
                  <strong className="text-sm font-medium">
                    Expected Output:
                  </strong>
                  <pre className="mt-1 rounded bg-muted p-2 text-sm">
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
