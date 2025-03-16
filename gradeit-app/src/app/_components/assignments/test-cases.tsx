"use client"

import { motion } from "framer-motion"
import { Check, X, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { TestCase } from "@/lib/types/assignment-tyes"

interface TestResult {
  id: string
  status: "passed" | "failed" | "running"
  runtime?: string
  memory?: string
  output?: string
  error?: string
}

interface TestCasesProps {
  testCases: TestCase[]
  results: TestResult[]
}

export function TestCases({ testCases, results }: TestCasesProps) {
  return (
    <div className="h-80 overflow-y-auto border-t border-[#2D2D2D] bg-[#1E1E1E]">
      <div className="sticky top-0 border-b border-[#2D2D2D] bg-[#1E1E1E] px-4 py-3">
        <h3 className="text-sm font-medium text-white">Test Results</h3>
      </div>

      <div className="divide-y divide-[#2D2D2D]">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  result.status === "passed" && "bg-[#7EBF8E]",
                  result.status === "failed" && "bg-[#D2886F]",
                  result.status === "running" && "bg-[#F1E6D0]",
                )}
              >
                {result.status === "passed" && <Check className="h-3.5 w-3.5 text-white" />}
                {result.status === "failed" && <X className="h-3.5 w-3.5 text-white" />}
                {result.status === "running" && <Clock className="h-3.5 w-3.5 text-[#3A3935]" />}
              </div>
              <div>
                <p className="text-sm text-white">
                  {result.status === "running" ? "Running code..." : `Test Case ${index + 1}`}
                </p>
                {result.status !== "running" && result.runtime && result.memory && (
                  <p className="text-xs text-[#A1A1A1]">
                    Runtime: {result.runtime} | Memory: {result.memory}
                  </p>
                )}
              </div>
            </div>

            {/* Output Section */}
            {result.status !== "running" && result.output && (
              <div className="mt-3 rounded-md bg-[#2A2A2A] p-3">
                <p className="mb-1 text-xs font-medium text-[#A1A1A1]">Output:</p>
                <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-white font-mono">
                  {result.output}
                </pre>
              </div>
            )}

            {/* Error Section */}
            {result.status === "failed" && result.error && (
              <div className="mt-3 rounded-md bg-[#2A2A2A] border border-[#D2886F]/20 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-3.5 w-3.5 text-[#D2886F]" />
                  <p className="text-xs font-medium text-[#D2886F]">Error:</p>
                </div>
                <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-[#D2886F] font-mono">
                  {result.error}
                </pre>
              </div>
            )}
          </motion.div>
        ))}

        {results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[#A1A1A1]">
            Run your code to see test results
          </div>
        )}
      </div>
    </div>
  )
}