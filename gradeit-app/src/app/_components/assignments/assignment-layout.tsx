"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Maximize2, Minimize2, FileText } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { QuestionDescription } from "./question-description"
import { CodeEditor } from "./code-editor"
import { TestCases } from "./test-cases"
import { QuestionNav } from "./question-nav"
import { AssignmentById } from "@/lib/types/assignment-tyes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { CustomTestInput } from "./custom-test-input"
import { LANGUAGE_ID_MAP } from "@/config/constants"


interface AssignmentLayoutProps {
  assignment: AssignmentById
  classId: string
}

export function AssignmentLayout({ assignment, classId }: AssignmentLayoutProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const [testResults, setTestResults] = useState<any[]>([])
  const [customInput, setCustomInput] = useState("")
  const [customOutput, setCustomOutput] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"testcases" | "custom">("testcases")

  const currentQuestion = assignment.questions[currentQuestionIndex]

  const handleRunTests = async () => {
    setIsRunning(true);
  
    try {
      console.log("Submitting code:", code);
  
      // Submit code to Judge0 API
      const submitResponse = await fetch(`https://judge0.p.rapidapi.com/submissions?base64_encoded=true&fields=*`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-rapidapi-key': '56f2a4b8damsh8b3e0adffcf7f4cp1e1e1djsnb985a953e3d3',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          language_id: LANGUAGE_ID_MAP[currentQuestion.language as keyof typeof LANGUAGE_ID_MAP],
          source_code: btoa(code), // Convert code to Base64
          stdin: btoa(customInput), // Provide input if needed
        }),
      });
  
      const submitData = await submitResponse.json();
      if (!submitData.token) {
        throw new Error("Failed to retrieve submission token.");
      }
  
      console.log("Submission token:", submitData.token);
  
      // Polling to get execution results
      let resultData;
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds between requests
  
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${submitData.token}?base64_encoded=true&fields=*`, {
          method: "GET",
          headers: {
            'x-rapidapi-key': '56f2a4b8damsh8b3e0adffcf7f4cp1e1e1djsnb985a953e3d3',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        });
  
        resultData = await resultResponse.json();
  
        if (resultData.status && resultData.status.id >= 3) {
          // Status >= 3 means execution is completed
          break;
        }
      }
  
      console.log("Execution Result:", resultData);
  
      if (resultData.stdout) {
        testResults.push({
          output: atob(resultData.stdout),
          status: resultData.status.id,
        });
        console.log("Output:", atob(resultData.stdout)); // Decode Base64 output
      } else if (resultData.stderr) {
        console.error("Error:", atob(resultData.stderr));
      } else {
        console.error("Execution failed:", resultData);
      }
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunning(false);
    }
  };
  

  const handleSubmit = async () => {
    setIsRunning(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRunning(false)
  }

  return (
<div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Panel */}
      <motion.div
        initial={false}
        animate={{
          width: isDescriptionExpanded ? "100%" : "40%",
        }}
        transition={{ duration: 0.2 }}
        className="relative flex h-full flex-col border-r border-[#E6E4DD] bg-white"
      >
        <div className="flex items-center justify-between border-b border-[#E6E4DD] px-4 py-2">
          <QuestionNav
            questions={assignment.questions}
            currentIndex={currentQuestionIndex}
            onSelect={setCurrentQuestionIndex}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-[#E6E4DD]"
              onClick={() => (window.location.href = `/classes/${classId}/${assignment.id}/submissions`)}
            >
              <FileText className="h-4 w-4" />
              <span>Submissions</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="h-8 w-8 rounded-full"
            >
              {isDescriptionExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <QuestionDescription question={currentQuestion} />
        </div>

        <AnimatePresence>
          {!isDescriptionExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -right-6 top-1/2 z-10"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDescriptionExpanded(true)}
                className="h-12 w-12 rounded-full bg-white shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Panel */}
      <AnimatePresence>
        {!isDescriptionExpanded && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col bg-[#1E1E1E]"
          >
            <CodeEditor
              code={code}
              onChange={setCode}
              language={currentQuestion.language}
              onRun={activeTab === "testcases" ? handleRunTests : handleRunTests}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              disableCopyPaste={assignment.copyPastePrevention}
            />

            <div className="border-t border-[#2D2D2D]">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "testcases" | "custom")}
                className="w-full"
              >
                <div className="border-b border-[#2D2D2D] px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger
                      value="testcases"
                      className="data-[state=active]:bg-[#2D2D2D] data-[state=active]:text-white text-[#A1A1A1]"
                    >
                      Test Cases
                    </TabsTrigger>
                    <TabsTrigger
                      value="custom"
                      className="data-[state=active]:bg-[#2D2D2D] data-[state=active]:text-white text-[#A1A1A1]"
                    >
                      Custom Input
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="testcases" className="mt-0">
                  <TestCases results={testResults} testCases={currentQuestion.testCases} />
                </TabsContent>

                <TabsContent value="custom" className="mt-0">
                  <CustomTestInput
                    input={customInput}
                    onInputChange={setCustomInput}
                    output={customOutput}
                    isRunning={isRunning}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

