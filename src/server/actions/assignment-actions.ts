"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignmentSchema, AssignmentSchema } from "@/lib/validators/schema";
import { revalidatePath } from "next/cache";
import { getClassIdFromCode } from "./utility-actions";
import { SubmissionStatus } from "@prisma/client";

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
    console.log("validation", validation.data);

    const {
      title,
      description,
      dueDate,
      classCode,
      questions,
      metrics,
      copyPastePrevention,
      fullScreenEnforcement,
      testCaseWeight,
      metricsWeight,
    } = validation.data;

    const classroomId = await getClassIdFromCode(classCode);
    if (!classroomId) {
      return { status: "error", message: "Classroom not found" };
    }
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description: description ?? null,
        DueDate: dueDate ? new Date(dueDate) : null,
        classroomId,
        copyPastePrevention,
        fullScreenEnforcement,
        metricsWeight,
        testCaseWeight,
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

    //create a submission for each student in the class
    const students = await prisma.user.findMany({
      where: {
        enrolledClasses: {
          some: {
            id: classroomId,
          },
        },
      },
    });

    const submissions = await prisma.submission.createMany({
      data: students.map((student) => {
        return {
          studentId: student.id,
          assignmentId: assignment.id,
          status: SubmissionStatus.NOT_STARTED,
        };
      }),
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
        questions: true,
        submissions: {
          include: {
            codeSubmission: true,
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
      description: assignment.description ?? undefined,
      dueDate: assignment.DueDate ? new Date(assignment.DueDate) : null,
      questionCount: assignment.questions.length,
      submissionCount: assignment.submissions.reduce(
        (acc, submission) => acc + submission.codeSubmission.length,
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
            codeSubmission: true,
          },
        },
        submissions: {
          include: {
            codeSubmission: true,
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
      description: assignment.description ?? undefined,
      dueDate: assignment.DueDate ? new Date(assignment.DueDate) : null,
      questionCount: assignment.questions.length,
      submissionCount: assignment.submissions.reduce(
        (acc, submission) => acc + submission.codeSubmission.length,
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
