import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssignmentLayout } from "@/app/_components/assignments/assignment-layout"
import { FacultyView } from "@/app/_components/assignments/faculty-view"
import { getUserRole } from "@/server/actions/user-actions"
import { getAssignmentById } from "@/server/actions/assignment-actions"

export const metadata: Metadata = {
  title: "Assignment | gradeIT",
  description: "Complete your coding assignment",
}

export default async function AssignmentPage({
  params,
}: {
  params: any
}) {
  const {assignmentId, classCode} = await params;
  const {assignment} = await getAssignmentById(assignmentId);
  const {role} = await getUserRole()


  if (!assignment) {
    notFound()
  }

  if ( role === "FACULTY") {
    return <FacultyView assignment={assignment} classCode={classCode} />
  }

  return <AssignmentLayout assignment={assignment} classCode={classCode} />
}

