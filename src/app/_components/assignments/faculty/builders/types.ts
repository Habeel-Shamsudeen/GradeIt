import type { Question, QuestionType } from "@/lib/types/assignment-tyes";

export interface QuestionBuilderProps {
  question: Question;
  onChange: (question: Question) => void;
}

export const DEFAULT_QUESTION_BY_TYPE: Record<
  QuestionType,
  () => Partial<Question>
> = {
  CODING: () => ({
    type: "CODING",
    language: "Python",
    testCases: [{ id: "1", input: "", expectedOutput: "", hidden: false }],
  }),
  MCQ: () => ({
    type: "MCQ",
    content: {
      options: [
        { id: "a", text: "", image: null },
        { id: "b", text: "", image: null },
      ],
      allowMultiple: false,
      shuffleOptions: true,
    },
    answerKey: { correctOptions: [], explanation: "" },
  }),
  MATCH_FOLLOWING: () => ({
    type: "MATCH_FOLLOWING",
    content: {
      leftItems: [
        { id: "l1", text: "" },
        { id: "l2", text: "" },
      ],
      rightItems: [
        { id: "r1", text: "" },
        { id: "r2", text: "" },
      ],
    },
    answerKey: { correctPairs: [], partialCredit: true },
  }),
  FILL_BLANKS: () => ({
    type: "FILL_BLANKS",
    content: {
      text: "",
      blanks: [{ id: "blank_1", hint: "" }],
    },
    answerKey: {
      answers: [
        { blankId: "blank_1", acceptedValues: [""], caseSensitive: false },
      ],
      partialCredit: true,
    },
  }),
  OPEN_ENDED: () => ({
    type: "OPEN_ENDED",
    content: {
      prompt: "",
      minWords: 0,
      maxWords: 0,
      attachmentsAllowed: false,
    },
    answerKey: { rubric: "", sampleAnswer: "", evaluationMethod: "LLM" },
  }),
  CASE_STUDY: () => ({
    type: "CASE_STUDY",
    content: { caseText: "", attachments: [] },
    answerKey: {},
  }),
  CHAIN_QUESTION: () => ({
    type: "CHAIN_QUESTION",
    content: { dependsOn: "", context: "" },
    answerKey: {},
  }),
  BLOCK_DIAGRAM: () => ({
    type: "BLOCK_DIAGRAM",
    content: { instructions: "", initialNodes: [], initialEdges: [] },
    answerKey: {
      expectedNodes: [],
      expectedEdges: [],
      evaluationMethod: "LLM",
    },
  }),
  CODE_DEBUG: () => ({
    type: "CODE_DEBUG",
    language: "Python",
    content: { buggyCode: "", hints: [] },
    testCases: [{ id: "1", input: "", expectedOutput: "", hidden: false }],
  }),
  CODE_FILL: () => ({
    type: "CODE_FILL",
    language: "Python",
    content: { starterCode: "", hints: [] },
    testCases: [{ id: "1", input: "", expectedOutput: "", hidden: false }],
  }),
};
