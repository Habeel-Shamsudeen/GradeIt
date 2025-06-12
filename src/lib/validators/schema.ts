import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  classCode: z.string().min(1, "Classroom ID is required"),
  copyPastePrevention: z.boolean(),
  fullScreenEnforcement: z.boolean(),
  questions: z.array(
    z.object({
      title: z.string().min(1, "Question title is required"),
      description: z.string().min(1, "Question description is required"),
      language: z.string().min(1, "Programming language is required"),
      testCases: z.array(
        z.object({
          input: z.string().min(1, "Test case input is required"),
          expectedOutput: z.string().min(1, "Expected output is required"),
          hidden: z.boolean(),
        }),
      ),
    }),
  ),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;
