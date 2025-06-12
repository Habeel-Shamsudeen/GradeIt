import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssignmentLayout } from "@/app/_components/assignments/assignment-layout";
import { FacultyView } from "@/app/_components/assignments/faculty-view";
import { getUserRole } from "@/server/actions/user-actions";
import { getAssignmentById } from "@/server/actions/assignment-actions";
import { getStudentAssignmentProgress } from "@/server/actions/submission-actions";

export const metadata: Metadata = {
  title: "Assignment | gradeIT",
  description: "Complete your coding assignment",
};

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ assignmentId: string; classCode: string }>;
}) {
  const { assignmentId, classCode } = await params;
  const { assignment } = await getAssignmentById(assignmentId);
  const { role } = await getUserRole();
  const initialStudentData = await getStudentAssignmentProgress(
    assignmentId,
    classCode
  );

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
