import { SubmissionStatus } from "@/app/generated/prisma/client";

export type QuestionType =
  | "CODING"
  | "MCQ"
  | "MATCH_FOLLOWING"
  | "FILL_BLANKS"
  | "OPEN_ENDED"
  | "CASE_STUDY"
  | "CHAIN_QUESTION"
  | "BLOCK_DIAGRAM"
  | "CODE_DEBUG"
  | "CODE_FILL";

export type AnswerEvaluationStatus =
  | "PENDING"
  | "AUTO_EVALUATED"
  | "LLM_EVALUATION_IN_PROGRESS"
  | "LLM_EVALUATION_FAILED"
  | "EVALUATION_COMPLETE"
  | "MANUAL_REVIEW_REQUIRED";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  CODING: "Coding",
  MCQ: "Multiple Choice",
  MATCH_FOLLOWING: "Match the Following",
  FILL_BLANKS: "Fill in the Blanks",
  OPEN_ENDED: "Open Ended",
  CASE_STUDY: "Case Study",
  CHAIN_QUESTION: "Chain Question",
  BLOCK_DIAGRAM: "Block Diagram",
  CODE_DEBUG: "Code Debugging",
  CODE_FILL: "Code Fill",
};

export const CODING_QUESTION_TYPES: QuestionType[] = [
  "CODING",
  "CODE_DEBUG",
  "CODE_FILL",
];

export interface Question {
  id: string;
  type?: QuestionType;
  title: string;
  description: string;
  language?: string | null;
  order?: number;
  points?: number;
  content?: Record<string, unknown> | null;
  answerKey?: Record<string, unknown> | null;
  sectionId?: string | null;
  parentQuestionId?: string | null;
  subQuestions?: Question[];
  testCases?: TestCase[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: Question[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  description?: string | null;
}

export interface EvaluationMetric {
  id: string;
  name: string;
  description?: string;
  weight: number;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | null;
  startDate: Date | null;
  allowLateSubmission: boolean;
  createdAt: Date;
  questionCount: number;
  submissionCount: number;
  copyPastePrevention: boolean;
  fullScreenEnforcement: boolean;
  metrics?: EvaluationMetric[];
  testCaseWeight?: number;
  metricsWeight?: number;
}

export interface AssignmentById extends Assignment {
  questions: Question[];
  sections?: Section[];
}

// -- JSONB content shapes --

export interface MCQContent {
  options: { id: string; text: string; image?: string | null }[];
  allowMultiple: boolean;
  shuffleOptions?: boolean;
}

export interface MCQAnswerKey {
  correctOptions: string[];
  explanation?: string;
}

export interface MCQResponse {
  selectedOptions: string[];
}

export interface MatchContent {
  leftItems: { id: string; text: string }[];
  rightItems: { id: string; text: string }[];
}

export interface MatchAnswerKey {
  correctPairs: { left: string; right: string | string[] }[];
  partialCredit?: boolean;
}

export interface MatchResponse {
  pairs: { left: string; right: string }[];
}

export interface FillBlanksContent {
  text: string;
  blanks: { id: string; hint?: string }[];
}

export interface FillBlanksAnswerKey {
  answers: {
    blankId: string;
    acceptedValues: string[];
    caseSensitive?: boolean;
  }[];
  partialCredit?: boolean;
}

export interface FillBlanksResponse {
  filledBlanks: { blankId: string; value: string }[];
}

export interface OpenEndedContent {
  prompt?: string;
  minWords?: number;
  maxWords?: number;
  attachmentsAllowed?: boolean;
}

export interface OpenEndedAnswerKey {
  rubric: string;
  sampleAnswer?: string;
  evaluationMethod: "LLM" | "MANUAL";
}

export interface OpenEndedResponse {
  text: string;
}

export interface BlockDiagramContent {
  instructions: string;
  initialNodes?: { id: string; label: string; x: number; y: number }[];
  initialEdges?: { from: string; to: string; label?: string }[];
}

export interface BlockDiagramAnswerKey {
  expectedNodes: { id: string; label: string }[];
  expectedEdges: { from: string; to: string; label?: string }[];
  evaluationMethod: "LLM" | "MANUAL";
}

export interface BlockDiagramResponse {
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { from: string; to: string; label?: string }[];
}

// -- Grading table types --

export interface GradingTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
}

export interface AssignmentMetricInfo {
  id: string;
  name: string;
  description?: string;
  weight: number;
}

export interface GradingTableHeaderData {
  id: string;
  title: string;
  testCaseWeight: number;
  metricsWeight: number;
  metrics: AssignmentMetricInfo[];
}

export interface GradingTableHeaderResponse {
  success: boolean;
  columns: GradingTableColumn[];
  assignment: GradingTableHeaderData;
  error?: string;
}

export interface GradingTableStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  overallScore: number;
  status: SubmissionStatus;
  submissions: GradingTableSubmission[];
  overallSubmission: GradingTableSubmission;
}

export interface GradingTableSubmission {
  id: string;
  studentId: string;
  testCaseScore: number;
  metricScores: GradingTableMetricScore[];
  totalScore: number;
  status: SubmissionStatus;
  submittedAt?: string;
}

export interface GradingTableMetricScore {
  metricId: string;
  metricName: string;
  score: number;
  weight: number;
}

export interface GradingTableData {
  students: GradingTableStudent[];
  metrics: AssignmentMetricInfo[];
}

export interface StudentProgress {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  score: number;
  questionsCompleted: number;
  submissions: any[];
}

export interface TransformStudentDataParams {
  studentData: StudentProgress[];
  assignmentData: GradingTableHeaderData;
}
