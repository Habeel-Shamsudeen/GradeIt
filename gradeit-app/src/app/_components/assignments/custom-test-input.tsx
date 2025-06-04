"use client";
import { motion } from "framer-motion";
import { Textarea } from "@/app/_components/ui/textarea";

interface CustomTestInputProps {
  input: string;
  onInputChange: (value: string) => void;
  output: string | null;
  isRunning: boolean;
}

export function CustomTestInput({
  input,
  onInputChange,
  output,
  isRunning,
}: CustomTestInputProps) {
  return (
    <div className="h-80 overflow-y-auto bg-[#1E1E1E] text-white">
      <div className="p-4">
        <div className="mb-4">
          <label
            htmlFor="custom-input"
            className="mb-2 block text-sm font-medium text-[#A1A1A1]"
          >
            Input
          </label>
          <Textarea
            id="custom-input"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter your custom test input here..."
            className="h-24 resize-none border-[#2D2D2D] bg-[#2D2D2D] text-white placeholder:text-[#6D6D6D] focus-visible:ring-[#4D4D4D]"
            disabled={isRunning}
          />
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Enter input values separated by line breaks or spaces as required by
            your code.
          </p>
        </div>

        {output !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label className="mb-2 block text-sm font-medium text-[#A1A1A1]">
              Output
            </label>
            <div className="max-h-40 overflow-y-auto rounded bg-[#2D2D2D] p-3 font-mono text-sm">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </motion.div>
        )}

        {isRunning && (
          <div className="mt-4 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#A1A1A1] border-t-transparent"></div>
            <span className="ml-2 text-sm text-[#A1A1A1]">Running...</span>
          </div>
        )}

        {!output && !isRunning && (
          <div className="mt-4 text-center text-sm text-[#A1A1A1]">
            Click &quot;Run&quot; to execute your code with the custom input
          </div>
        )}
      </div>
    </div>
  );
}
