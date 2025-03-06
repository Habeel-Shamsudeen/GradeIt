"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Beaker } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { Textarea } from "@/app/_components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { Checkbox } from "@/app/_components/ui/checkbox"
import { Card, CardContent } from "@/app/_components/ui/card"
import { Separator } from "@/app/_components/ui/separator"
import { Question, TestCase } from "@/lib/types/assignment-tyes"
import { LANGUAGE_ID_MAP } from "@/config/constants"

interface QuestionFormProps {
  question: Question
  onChange: (question: Question) => void
}

export function QuestionForm({ question, onChange }: QuestionFormProps) {
  const updateField = (field: keyof Question, value: any) => {
    onChange({
      ...question,
      [field]: value,
    })
  }

  const addTestCase = () => {
    updateField("testCases", [
      ...question.testCases,
      {
        id: `${question.testCases.length + 1}`,
        input: "",
        expectedOutput: "",
        hidden: false,
      },
    ])
  }

  const removeTestCase = (index: number) => {
    if (question.testCases.length > 1) {
      updateField(
        "testCases",
        question.testCases.filter((_, i) => i !== index),
      )
    }
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const newTestCases = [...question.testCases]
    newTestCases[index] = {
      ...newTestCases[index],
      [field]: value,
    }
    updateField("testCases", newTestCases)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor={`question-${question.id}-title`}>Question Title</Label>
          <Input
            id={`question-${question.id}-title`}
            value={question.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., Implement a Binary Search Tree"
            className="border-[#E6E4DD]"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`question-${question.id}-description`}>Description</Label>
          <Textarea
            id={`question-${question.id}-description`}
            value={question.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Provide detailed instructions for this question..."
            className="min-h-32 resize-y border-[#E6E4DD]"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`question-${question.id}-language`}>Programming Language</Label>
          <Select value={question.language} onValueChange={(value) => updateField("language", value)}>
            <SelectTrigger id={`question-${question.id}-language`} className="border-[#E6E4DD]">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(LANGUAGE_ID_MAP).map((language) => (
                <SelectItem key={language} value={language}>{language}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-6 bg-[#E6E4DD]" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-medium text-[#141413]">
            <Beaker className="h-4 w-4 text-[#605F5B]" />
            Test Cases
          </h3>
          <Button type="button" variant="outline" onClick={addTestCase} className="gap-1 border-[#E6E4DD]">
            <Plus className="h-4 w-4" />
            Add Test Case
          </Button>
        </div>

        <AnimatePresence>
          {question.testCases.map((testCase, index) => (
            <motion.div
              key={testCase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-xl border-[#E6E4DD] bg-[#FAFAF8]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between pb-3">
                    <h4 className="text-sm font-medium text-[#141413]">Test Case {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`test-case-${question.id}-${testCase.id}-hidden`}
                          checked={testCase.hidden}
                          onCheckedChange={(checked) => updateTestCase(index, "hidden", checked === true)}
                        />
                        <Label
                          htmlFor={`test-case-${question.id}-${testCase.id}-hidden`}
                          className="text-xs font-normal"
                        >
                          Hidden from students
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestCase(index)}
                        className="h-7 w-7 rounded-full p-0 text-[#605F5B] hover:bg-[#F0EFEA] hover:text-[#141413]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove test case</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor={`test-case-${question.id}-${testCase.id}-input`} className="text-xs">
                        Input
                      </Label>
                      <Textarea
                        id={`test-case-${question.id}-${testCase.id}-input`}
                        value={testCase.input}
                        onChange={(e) => updateTestCase(index, "input", e.target.value)}
                        placeholder="Input for this test case..."
                        className="h-24 resize-none border-[#E6E4DD] text-sm"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`test-case-${question.id}-${testCase.id}-output`} className="text-xs">
                        Expected Output
                      </Label>
                      <Textarea
                        id={`test-case-${question.id}-${testCase.id}-output`}
                        value={testCase.expectedOutput}
                        onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                        placeholder="Expected output for this test case..."
                        className="h-24 resize-none border-[#E6E4DD] text-sm"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

