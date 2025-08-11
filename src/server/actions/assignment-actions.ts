"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignmentSchema, AssignmentSchema } from "@/lib/validators/schema";
import { revalidatePath } from "next/cache";
import { getClassIdFromCode } from "./utility-actions";

export const createAssignment = async (formData: AssignmentSchema) => {
  const session = await auth();
  if (!session?.user) {
    console.log("unauthorized");
    throw new Error("Unauthorized");
  }
  try {
    const faculty = await prisma.user.findUnique({
      where: {
        id: session.user.id,
        role: "FACULTY",
      },
    });
    if (!faculty) {
      console.log("unauthorized not faculty");
      throw new Error("Unauthorized");
    }

    const validation = assignmentSchema.safeParse(formData);
    if (!validation.success) {
      console.log("validation errors", validation.error.format());
      return {
        status: "error",
        message: "Invalid input data",
        errors: validation.error.format(),
      };
    }

    const {
      title,
      description,
      dueDate,
      classCode,
      questions,
      metrics,
      copyPastePrevention,
      fullScreenEnforcement,
    } = validation.data;

    const classroomId = await getClassIdFromCode(classCode);
    if (!classroomId) {
      return { status: "error", message: "Classroom not found" };
    }
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        DueDate: dueDate ? new Date(dueDate) : null,
        classroomId,
        copyPastePrevention,
        fullScreenEnforcement,
        metrics: metrics
          ? {
              create: metrics.map((metric) => ({
                metricId: metric.id,
                weight: metric.weight,
              })),
            }
          : undefined,
        questions: {
          create: questions.map((question) => ({
            title: question.title,
            description: question.description,
            language: question.language,
            testCases: {
              create: question.testCases.map((testCase) => ({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                hidden: testCase.hidden,
              })),
            },
          })),
        },
      },
    });
    console.log("success", assignment);
    revalidatePath(`/classes/${classCode}`); // Refresh cache for updated data
    return { status: "success", assignment };
  } catch (error) {
    throw new Error("Failed to create assignment" + error);
  }
};

export const getAssignments = async (classroomId: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        classroomId,
      },
      include: {
        questions: {
          include: {
            Submission: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.DueDate ? new Date(assignment.DueDate) : null,
      questionCount: assignment.questions.length,
      submissionCount: assignment.questions.reduce(
        (acc, question) => acc + question.Submission.length,
        0,
      ),
      createdAt: new Date(assignment.createdAt),
      copyPastePrevention: assignment.copyPastePrevention,
      fullScreenEnforcement: assignment.fullScreenEnforcement,
    }));

    return { status: "success", assignments: formattedAssignments };
  } catch (error) {
    return { status: "failed", message: error };
  }
};

export const getAssignmentById = async (assignmentId: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        questions: {
          include: {
            testCases: true,
            Submission: true,
          },
        },
      },
    });

    if (!assignment) {
      return { status: "error", message: "Assignment not found" };
    }

    const formattedAssignment = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.DueDate ? new Date(assignment.DueDate) : null,
      questionCount: assignment.questions.length,
      submissionCount: assignment.questions.reduce(
        (acc, question) => acc + question.Submission.length,
        0,
      ),
      createdAt: new Date(assignment.createdAt),
      questions: assignment.questions,
      copyPastePrevention: assignment.copyPastePrevention,
      fullScreenEnforcement: assignment.fullScreenEnforcement,
    };
    return { status: "success", assignment: formattedAssignment };
  } catch (error) {
    throw new Error("Failed to get assignment " + error);
  }
};
