export interface Question {
    id: string
    title: string
    description: string
    language: string
    testCases: TestCase[]
  }

export interface TestCase {
    id: string
    input: string
    expectedOutput: string
    hidden: boolean
  }

export interface Assignment {
    id: string
    title: string
    description: string
    dueDate: Date | null
    createdAt: Date
    questionCount: number
    submissionCount: number
}


export interface AssignmentById extends Assignment {
    questions: Question[]
}