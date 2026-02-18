import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssignmentLayout } from "@/app/_components/assignments/student/assignment-layout";
import { FacultyView } from "@/app/_components/assignments/faculty/faculty-view";
import { getUserRole } from "@/server/actions/user-actions";
import { getAssignmentById } from "@/server/actions/assignment-actions";
import { getStudentAssignmentProgress } from "@/server/actions/submission-actions";
import { StudentProgress } from "@/lib/types/assignment-tyes";

type AssignmentPageProps = {
  params: Promise<{ assignmentId: string; classCode: string }>;
};

export async function generateMetadata({
  params,
}: AssignmentPageProps): Promise<Metadata> {
  const { assignmentId } = await params;
  const { assignment } = await getAssignmentById(assignmentId);
  if (!assignment) {
    return { title: "Assignment | gradeIT" };
  }
  return {
    title: `${assignment.title} | gradeIT`,
    description: assignment.description ?? "Complete your coding assignment",
  };
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { assignmentId, classCode } = await params;
  const [{ assignment }, { role }, initialStudentData] = await Promise.all([
    getAssignmentById(assignmentId),
    getUserRole(),
    getStudentAssignmentProgress(assignmentId, classCode),
  ]);

  if (!assignment) {
    notFound();
  }

  if (role === "FACULTY") {
    return (
      <FacultyView
        assignment={assignment}
        classCode={classCode}
        initialStudents={initialStudentData}
      />
    );
  }

  return <AssignmentLayout assignment={assignment} classCode={classCode} />;
}
