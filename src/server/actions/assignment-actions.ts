"use server";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  assignmentSchema,
  assignmentUpdateSchema,
  AssignmentSchema,
  type AssignmentUpdateSchema,
} from "@/lib/validators/schema";
import { revalidatePath } from "next/cache";
import { getClassIdFromCode } from "./utility-actions";
import { Role, SubmissionStatus } from "@/app/generated/prisma/client";
import { GradingTableHeaderResponse } from "@/lib/types/assignment-tyes";
import {
  isAssignmentUpcoming,
  isAssignmentVisibleToStudent,
} from "@/lib/assignment-utils";

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
      startDate,
      allowLateSubmission,
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
        startDate: startDate ? new Date(startDate) : undefined,
        allowLateSubmission: allowLateSubmission ?? true,
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

export const updateAssignment = async (formData: AssignmentUpdateSchema) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const faculty = await prisma.user.findFirst({
      where: { id: session.user.id, role: "FACULTY" },
    });
    if (!faculty) {
      return { status: "error", message: "Unauthorized" };
    }

    const validation = assignmentUpdateSchema.safeParse(formData);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid input data",
        errors: validation.error.format(),
      };
    }

    const {
      assignmentId,
      title,
      description,
      dueDate,
      startDate,
      allowLateSubmission,
      questions,
      metrics,
      copyPastePrevention,
      fullScreenEnforcement,
      testCaseWeight,
      metricsWeight,
    } = validation.data;

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { classroom: true },
    });
    if (!assignment) {
      return { status: "error", message: "Assignment not found" };
    }
    if (assignment.classroom.facultyId !== session.user.id) {
      return { status: "error", message: "Unauthorized" };
    }
    if (assignment.startDate && new Date() >= new Date(assignment.startDate)) {
      return {
        status: "error",
        message: "Editing is not allowed after the assignment has started.",
      };
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.assignmentMetric.deleteMany({
          where: { assignmentId },
        });
        await tx.question.deleteMany({
          where: { assignmentId },
        });
        await tx.assignment.update({
          where: { id: assignmentId },
          data: {
            title,
            description: description ?? null,
            DueDate: dueDate ? new Date(dueDate) : null,
            startDate: startDate ? new Date(startDate) : undefined,
            allowLateSubmission: allowLateSubmission ?? true,
            copyPastePrevention,
            fullScreenEnforcement,
            testCaseWeight,
            metricsWeight,
          },
        });
        await tx.question.createMany({
          data: questions.map((q) => ({
            assignmentId,
            title: q.title,
            description: q.description,
            language: q.language,
          })),
        });
        const createdQuestions = await tx.question.findMany({
          where: { assignmentId },
          orderBy: { createdAt: "asc" },
        });
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const created = createdQuestions[i];
          if (!created) continue;
          await tx.testCase.createMany({
            data: q.testCases.map((tc) => ({
              questionId: created.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              hidden: tc.hidden,
            })),
          });
        }
        if (metrics?.length) {
          await tx.assignmentMetric.createMany({
            data: metrics.map((m) => ({
              assignmentId,
              metricId: m.id,
              weight: m.weight,
            })),
          });
        }
      },
      {
        timeout: 30_000, // 30s for large assignments (many questions/test cases)
      },
    );

    const classCode = assignment.classroom.code;
    revalidatePath(`/classes/${classCode}`);
    revalidatePath(`/classes/${classCode}/${assignmentId}`);
    revalidatePath(`/classes/${classCode}/${assignmentId}/edit`);
    return { status: "success" };
  } catch (error) {
    console.error("Failed to update assignment", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to update assignment",
    };
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Unauthorized" };
  }
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { classroom: true },
    });
    if (!assignment) {
      return { status: "error", message: "Assignment not found" };
    }
    if (assignment.classroom.facultyId !== session.user.id) {
      return { status: "error", message: "Unauthorized" };
    }
    await prisma.assignment.delete({
      where: { id: assignmentId },
    });
    const classCode = assignment.classroom.code;
    revalidatePath(`/classes/${classCode}`);
    revalidatePath(`/classes/${classCode}/${assignmentId}`);
    return { status: "success" };
  } catch (error) {
    console.error("Failed to delete assignment", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to delete assignment",
    };
  }
};

function formatAssignmentFromPrisma(assignment: {
  id: string;
  title: string;
  description: string | null;
  DueDate: Date | null;
  startDate: Date | null;
  allowLateSubmission: boolean;
  createdAt: Date;
  copyPastePrevention: boolean;
  fullScreenEnforcement: boolean;
  questions: unknown[];
  submissions: { codeSubmission: unknown[] }[];
}) {
  return {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description ?? undefined,
    dueDate: assignment.DueDate ? new Date(assignment.DueDate) : null,
    startDate: assignment.startDate ? new Date(assignment.startDate) : null,
    allowLateSubmission: assignment.allowLateSubmission,
    questionCount: assignment.questions.length,
    submissionCount: assignment.submissions.reduce(
      (acc, submission) => acc + submission.codeSubmission.length,
      0,
    ),
    createdAt: new Date(assignment.createdAt),
    copyPastePrevention: assignment.copyPastePrevention,
    fullScreenEnforcement: assignment.fullScreenEnforcement,
  };
}

export const getAssignments = async (
  classroomId: string,
  role?: Role | null,
) => {
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

    const formatted = assignments.map((a) => formatAssignmentFromPrisma(a));
    const effectiveRole = role ?? session.user.role ?? "STUDENT";

    if (effectiveRole === "STUDENT") {
      const now = new Date();
      const visible = formatted.filter((a) =>
        isAssignmentVisibleToStudent({
          startDate: a.startDate,
          dueDate: a.dueDate,
          allowLateSubmission: a.allowLateSubmission,
        }),
      );
      const upcoming = formatted.filter((a) =>
        isAssignmentUpcoming({ startDate: a.startDate }, now),
      );
      return {
        status: "success" as const,
        assignments: visible,
        upcomingAssignments: upcoming,
      };
    }

    return {
      status: "success" as const,
      assignments: formatted,
      upcomingAssignments: [],
    };
  } catch (error) {
    return { status: "failed", message: error };
  }
};

export const getAssignmentById = cache(async (assignmentId: string) => {
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
        metrics: {
          include: {
            metric: true,
          },
        },
      },
    });

    if (!assignment) {
      return { status: "error", message: "Assignment not found" };
    }

    if (session.user.role === "STUDENT") {
      const visible = isAssignmentVisibleToStudent({
        startDate: assignment.startDate,
        dueDate: assignment.DueDate,
        allowLateSubmission: assignment.allowLateSubmission,
      });
      if (!visible) {
        return { status: "error", message: "Assignment not found" };
      }
    }

    const metrics: {
      id: string;
      name: string;
      description?: string;
      weight: number;
    }[] = assignment.metrics.map((am) => ({
      id: am.metric.id,
      name: am.metric.name,
      description: am.metric.description ?? undefined,
      weight: am.weight,
    }));

    const dueDate = assignment.DueDate ? new Date(assignment.DueDate) : null;
    const startDate = assignment.startDate
      ? new Date(assignment.startDate)
      : null;

    const formattedAssignment = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description ?? undefined,
      dueDate,
      startDate,
      allowLateSubmission: assignment.allowLateSubmission,
      questionCount: assignment.questions.length,
      submissionCount: assignment.submissions.reduce(
        (acc, submission) => acc + submission.codeSubmission.length,
        0,
      ),
      createdAt: new Date(assignment.createdAt),
      questions: assignment.questions,
      copyPastePrevention: assignment.copyPastePrevention,
      fullScreenEnforcement: assignment.fullScreenEnforcement,
      testCaseWeight: assignment.testCaseWeight,
      metricsWeight: assignment.metricsWeight,
      metrics,
    };
    return { status: "success", assignment: formattedAssignment };
  } catch (error) {
    throw new Error("Failed to get assignment " + error);
  }
});

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
