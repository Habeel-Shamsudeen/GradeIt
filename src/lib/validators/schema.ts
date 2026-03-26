import { z } from "zod";

const dateRefinement = (data: { startDate?: string; dueDate?: string }) => {
  if (!data.startDate || !data.dueDate) return true;
  return new Date(data.startDate) < new Date(data.dueDate);
};

// -- Per-type question schemas --

const testCaseSchema = z.object({
  input: z.string().min(1, "Test case input is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
  hidden: z.boolean(),
});

const baseCodingFields = {
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  language: z.string().min(1, "Programming language is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z
    .object({
      starterCode: z.string().optional(),
      buggyCode: z.string().optional(),
      hints: z.array(z.string()).optional(),
    })
    .optional(),
  answerKey: z.record(z.string(), z.unknown()).optional(),
  testCases: z.array(testCaseSchema),
};

const codingQuestionSchema = z.object({
  type: z.literal("CODING"),
  ...baseCodingFields,
});

const codeDebugQuestionSchema = z.object({
  type: z.literal("CODE_DEBUG"),
  ...baseCodingFields,
});

const codeFillQuestionSchema = z.object({
  type: z.literal("CODE_FILL"),
  ...baseCodingFields,
});

const mcqQuestionSchema = z.object({
  type: z.literal("MCQ"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    options: z
      .array(
        z.object({
          id: z.string(),
          text: z.string().min(1, "Option text is required"),
          image: z.string().nullable().optional(),
        }),
      )
      .min(2, "At least 2 options required"),
    allowMultiple: z.boolean().default(false),
    shuffleOptions: z.boolean().default(true),
  }),
  answerKey: z.object({
    correctOptions: z.array(z.string()).min(1, "At least one correct option"),
    explanation: z.string().optional(),
  }),
});

const matchQuestionSchema = z.object({
  type: z.literal("MATCH_FOLLOWING"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    leftItems: z
      .array(z.object({ id: z.string(), text: z.string().min(1) }))
      .min(2),
    rightItems: z
      .array(z.object({ id: z.string(), text: z.string().min(1) }))
      .min(2),
  }),
  answerKey: z.object({
    correctPairs: z.array(
      z.object({
        left: z.string(),
        right: z.union([z.string(), z.array(z.string())]),
      }),
    ),
    partialCredit: z.boolean().default(true),
  }),
});

const fillBlanksQuestionSchema = z.object({
  type: z.literal("FILL_BLANKS"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    text: z.string().min(1, "Template text is required"),
    blanks: z
      .array(z.object({ id: z.string(), hint: z.string().optional() }))
      .min(1),
  }),
  answerKey: z.object({
    answers: z.array(
      z.object({
        blankId: z.string(),
        acceptedValues: z.array(z.string()).min(1),
        caseSensitive: z.boolean().default(false),
      }),
    ),
    partialCredit: z.boolean().default(true),
  }),
});

const openEndedQuestionSchema = z.object({
  type: z.literal("OPEN_ENDED"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    prompt: z.string().optional(),
    minWords: z.number().min(0).optional(),
    maxWords: z.number().min(0).optional(),
    attachmentsAllowed: z.boolean().default(false),
  }),
  answerKey: z.object({
    rubric: z.string().min(1, "Rubric is required for evaluation"),
    sampleAnswer: z.string().optional(),
    evaluationMethod: z.enum(["LLM", "MANUAL"]).default("LLM"),
  }),
});

const caseStudyQuestionSchema = z.object({
  type: z.literal("CASE_STUDY"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    caseText: z.string().min(1),
    attachments: z.array(z.string()).optional(),
  }),
  answerKey: z.record(z.string(), z.unknown()).optional(),
});

const chainQuestionSchema = z.object({
  type: z.literal("CHAIN_QUESTION"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    dependsOn: z.string().optional(),
    context: z.string().optional(),
  }),
  answerKey: z.record(z.string(), z.unknown()).optional(),
});

const blockDiagramQuestionSchema = z.object({
  type: z.literal("BLOCK_DIAGRAM"),
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  points: z.number().min(0).default(100),
  order: z.number().default(0),
  sectionId: z.string().optional(),
  content: z.object({
    instructions: z.string().min(1),
    initialNodes: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          x: z.number(),
          y: z.number(),
        }),
      )
      .optional(),
    initialEdges: z
      .array(
        z.object({
          from: z.string(),
          to: z.string(),
          label: z.string().optional(),
        }),
      )
      .optional(),
  }),
  answerKey: z.object({
    expectedNodes: z.array(z.object({ id: z.string(), label: z.string() })),
    expectedEdges: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string().optional(),
      }),
    ),
    evaluationMethod: z.enum(["LLM", "MANUAL"]).default("LLM"),
  }),
});

export const questionSchema = z.discriminatedUnion("type", [
  codingQuestionSchema,
  codeDebugQuestionSchema,
  codeFillQuestionSchema,
  mcqQuestionSchema,
  matchQuestionSchema,
  fillBlanksQuestionSchema,
  openEndedQuestionSchema,
  caseStudyQuestionSchema,
  chainQuestionSchema,
  blockDiagramQuestionSchema,
]);

export type QuestionSchema = z.infer<typeof questionSchema>;

// -- Section schema --

export const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional(),
  order: z.number().default(0),
  questions: z.array(questionSchema),
});

export type SectionSchema = z.infer<typeof sectionSchema>;

// Legacy coding-only question (used when type is omitted for backward compat)
const legacyCodingQuestionSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  description: z.string().min(1, "Question description is required"),
  language: z.string().min(1, "Programming language is required"),
  testCases: z.array(testCaseSchema),
});

const questionsField = z.union([
  z.array(questionSchema),
  z.array(legacyCodingQuestionSchema),
]);

const baseAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  allowLateSubmission: z.boolean().default(true),
  classCode: z.string().min(1, "Classroom ID is required"),
  copyPastePrevention: z.boolean(),
  fullScreenEnforcement: z.boolean(),
  testCaseWeight: z.number().min(0).max(100).default(100),
  metricsWeight: z.number().min(0).max(100).default(0),
  metrics: z
    .array(
      z.object({
        id: z.string().min(1, "Metric ID is required"),
        name: z.string().min(1, "Metric name is required"),
        description: z.string().optional(),
        weight: z.number().min(0).max(100, "Weight must be between 0 and 100"),
      }),
    )
    .optional(),
  sections: z.array(sectionSchema).optional(),
  questions: questionsField,
});

export const assignmentSchema = baseAssignmentSchema.refine(dateRefinement, {
  message: "Start date must be before due date",
  path: ["startDate"],
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const assignmentUpdateSchema = baseAssignmentSchema
  .omit({ classCode: true })
  .extend({ assignmentId: z.string().min(1, "Assignment ID is required") })
  .refine(dateRefinement, {
    message: "Start date must be before due date",
    path: ["startDate"],
  });

export type AssignmentUpdateSchema = z.infer<typeof assignmentUpdateSchema>;

// -- Answer validation schemas --

export const mcqResponseSchema = z.object({
  selectedOptions: z.array(z.string()).min(1),
});

export const matchResponseSchema = z.object({
  pairs: z.array(z.object({ left: z.string(), right: z.string() })),
});

export const fillBlanksResponseSchema = z.object({
  filledBlanks: z.array(z.object({ blankId: z.string(), value: z.string() })),
});

export const openEndedResponseSchema = z.object({
  text: z.string().min(1),
});

export const blockDiagramResponseSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    }),
  ),
});
