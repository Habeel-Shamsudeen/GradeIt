"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignmentSchema, AssignmentSchema } from "@/lib/validators/schema";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { getClassIdFromCode } from "./utility-actions";
import { SubmissionStatus } from "@prisma/client";
import { GradingTableHeaderResponse } from "@/lib/types/assignment-tyes";

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
    revalidatePath(`/classes/${classCode}`); // Refresh page-level cache
    revalidateTag(`assignments:class:${classCode}`); // Invalidate assignment list for this class
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
    const read = unstable_cache(
      async () => {
        return prisma.assignment.findMany({
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
      },
      ["getAssignments", classroomId],
      { revalidate: 300, tags: [`assignments:class:${classroomId}`] },
    );
    const assignments = await read();

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
    const read = unstable_cache(
      async () => {
        return prisma.assignment.findUnique({
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
      },
      ["getAssignmentById", assignmentId],
      { revalidate: 120, tags: [`assignment:${assignmentId}`] },
    );
    const assignment = await read();

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

export const getAssignmentGradingTableHeader = async (
  assignmentId: string,
): Promise<GradingTableHeaderResponse> => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        metrics: {
          include: {
            metric: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    // Construct the columns array
    const columns = [
      {
        key: "select",
        label: "",
        sortable: false,
        width: "50px",
      },
      {
        key: "student",
        label: "Student",
        sortable: true,
        width: "200px",
      },
      ...(assignment.testCaseWeight > 0
        ? [
            {
              key: "testCases",
              label: `Test Cases (${assignment.testCaseWeight}%)`,
              sortable: true,
              width: "120px",
            },
          ]
        : []),
      ...assignment.metrics.map((assignmentMetric) => ({
        key: `metric_${assignmentMetric.metric.id}`,
        label: `${assignmentMetric.metric.name} (${assignmentMetric.weight * (assignment.metricsWeight / 100)}%)`,
        sortable: true,
        width: "120px",
      })),
      {
        key: "overallScore",
        label: "Overall Score",
        sortable: true,
        width: "120px",
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        width: "120px",
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        width: "100px",
      },
    ];

    return {
      success: true,
      columns,
      assignment: {
        id: assignment.id,
        title: assignment.title,
        testCaseWeight: assignment.testCaseWeight,
        metricsWeight: assignment.metricsWeight,
        metrics: assignment.metrics.map((am) => ({
          id: am.metric.id,
          name: am.metric.name,
          description: am.metric.description || undefined,
          weight: am.weight,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching assignment grading table header:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch assignment grading table header",
      columns: [],
      assignment: {
        id: "",
        title: "",
        testCaseWeight: 0,
        metricsWeight: 0,
        metrics: [],
      },
    };
  }
};
