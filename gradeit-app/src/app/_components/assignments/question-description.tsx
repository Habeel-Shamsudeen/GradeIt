"use client";
import { Separator } from "@/app/_components/ui/separator";
import { Question } from "@/lib/types/assignment-tyes";

interface QuestionDescriptionProps {
  question: Question;
}

export function QuestionDescription({ question }: QuestionDescriptionProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="flex items-center justify-between">
        <h1 className="m-0 text-2xl font-medium text-[#141413]">
          {question.title}
        </h1>
        {/* <Badge
          className={cn(
            "px-3 py-1",
            question.difficulty === "Easy" && "bg-[#7EBF8E] hover:bg-[#6CAF7E]",
            question.difficulty === "Medium" && "bg-[#F1E6D0] text-[#3A3935] hover:bg-[#EBDBBC]",
            question.difficulty === "Hard" && "bg-[#D2886F] hover:bg-[#C27A63]",
          )}
        >
          {question.difficulty}
        </Badge> */}
      </div>

      {/* <div className="mt-4 flex gap-4 text-sm text-[#605F5B]">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>Time Limit: {question.timeLimit}ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-4 w-4" />
          <span>Memory Limit: {question.memoryLimit}MB</span>
        </div>
      </div> */}

      <Separator className="my-4 bg-[#E6E4DD]" />

      <div className="[&>h2]:text-lg [&>h2]:font-medium [&>h2]:text-[#141413] [&>p]:text-[#605F5B] [&>pre]:bg-[#F0EFEA] [&>pre]:p-4 [&>pre]:rounded-lg">
        <div dangerouslySetInnerHTML={{ __html: question.description }} />

        <h2>Example Test Cases:</h2>
        {question.testCases
          .filter((testCase) => !testCase.hidden)
          .map((testCase) => (
            <div
              key={testCase.id}
              className="mb-6 rounded-lg border border-[#E6E4DD] p-4"
            >
              <div className="mb-2">
                <strong className="text-sm font-medium text-[#141413]">
                  Input:
                </strong>
                <pre className="mt-1 rounded bg-[#F0EFEA] p-2 text-sm">
                  {testCase.input}
                </pre>
              </div>
              <div>
                <strong className="text-sm font-medium text-[#141413]">
                  Expected Output:
                </strong>
                <pre className="mt-1 rounded bg-[#F0EFEA] p-2 text-sm">
                  {testCase.expectedOutput}
                </pre>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
