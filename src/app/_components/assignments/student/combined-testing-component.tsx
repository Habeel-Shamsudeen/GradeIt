"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Clock,
  AlertCircle,
  Play,
  FormInputIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/app/_components/ui/textarea";
import { TestCase } from "@/lib/types/assignment-tyes";
import { Button } from "@/app/_components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { CodeRunner } from "@/lib/types/code-types";

interface CombinedTestingProps {
  testCases: TestCase[];
  results: CodeRunner[];
  customInput: string;
  onCustomInputChange: (value: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  codeStatus: string;
}

export function CombinedTesting({
  testCases,
  results,
  customInput,
  onCustomInputChange,
  onRunCode,
  isRunning,
  codeStatus,
}: CombinedTestingProps) {
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const filteredResults = results.filter((result) => !result.hidden);
  console.log("filteredResults", filteredResults);

  return (
    <div className="h-80 overflow-y-auto border-t border-[#2D2D2D] bg-[#1E1E1E]">
      <div className="sticky top-0 border-b border-[#2D2D2D] bg-[#1E1E1E] px-4 py-3 flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">Test Results</h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "border-[#2D2D2D] bg-[#2D2D2D] text-white hover:bg-[#3D3D3D] focus-visible:ring-[#4D4D4D]",
              isCustomInputOpen && "bg-[#3D3D3D]",
            )}
            onClick={() => setIsCustomInputOpen(!isCustomInputOpen)}
          >
            <FormInputIcon className="h-4 w-4 mr-1" />
            Custom Input
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#2D2D2D] bg-[#2D2D2D] text-white hover:bg-[#3D3D3D] focus-visible:ring-[#4D4D4D]"
            onClick={onRunCode}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {isCustomInputOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-[#2D2D2D] p-4"
        >
          <div className="flex flex-col space-y-3">
            <div>
              <label
                htmlFor="custom-input"
                className="mb-2 block text-sm font-medium text-[#A1A1A1]"
              >
                Custom Input
              </label>
              <Textarea
                id="custom-input"
                value={customInput}
                onChange={(e) => onCustomInputChange(e.target.value)}
                placeholder="Enter your custom test input here..."
                className="h-24 resize-none border-[#2D2D2D] bg-[#2D2D2D] text-white placeholder:text-[#6D6D6D] focus-visible:ring-[#4D4D4D]"
                disabled={isRunning}
              />
              <p className="mt-1 text-xs text-[#A1A1A1]">
                Enter input values separated by line breaks or spaces as
                required by your code.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="divide-y divide-[#2D2D2D]">
        {filteredResults.length > 0 ? (
          filteredResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    result?.status === "passed" && "bg-[#7EBF8E]",
                    result?.status === "failed" && "bg-[#D2886F]",
                    result?.status === "running" && "bg-[#F1E6D0]",
                  )}
                >
                  {result?.status === "passed" && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                  {result?.status === "failed" && (
                    <X className="h-3.5 w-3.5 text-white" />
                  )}
                  {result?.status === "running" && (
                    <Clock className="h-3.5 w-3.5 text-[#3A3935]" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white">
                    {result?.status === "running"
                      ? "Running code..."
                      : `Test Case ${index + 1}`}
                  </p>
                  {testCases[index] && testCases[index].hidden && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      Hidden
                    </span>
                  )}
                  {result?.status !== "running" &&
                    result?.runtime &&
                    result?.memory && (
                      <p className="text-xs text-[#A1A1A1]">
                        Runtime: {result.runtime} | Memory: {result.memory}
                      </p>
                    )}
                </div>
              </div>

              {result?.input?.length >= 0 && (
                <Accordion type="single" collapsible className="mt-2">
                  <AccordionItem value="input" className="border-[#2D2D2D]">
                    <AccordionTrigger className="py-2 text-xs text-[#A1A1A1] hover:text-white">
                      Input
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="bg-[#2A2A2A] p-2 rounded text-xs text-white font-mono whitespace-pre-wrap">
                        {result?.input}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Output Section */}
              {result?.status !== "running" && result?.output && (
                <div className="mt-3 rounded-md bg-[#2A2A2A] p-3">
                  <p className="mb-1 text-xs font-medium text-[#A1A1A1]">
                    Output:
                  </p>
                  <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-white font-mono">
                    {result.output}
                  </pre>
                </div>
              )}

              {/* Error Section */}
              {result?.status === "failed" && result?.error && (
                <div className="mt-3 rounded-md bg-[#2A2A2A] border border-[#D2886F]/20 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-3.5 w-3.5 text-[#D2886F]" />
                    <p className="text-xs font-medium text-[#D2886F]">Error:</p>
                  </div>
                  <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-[#D2886F] font-mono">
                    {result?.error}
                  </pre>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-[#A1A1A1]">
            {isRunning ? (
              <div className="flex flex-col items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#A1A1A1] border-t-transparent mb-2"></div>
                <span>{codeStatus}</span>
              </div>
            ) : (
              "Run your code to see test results"
            )}
          </div>
        )}
      </div>
    </div>
  );
}
