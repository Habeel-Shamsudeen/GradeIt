import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CreateAssignmentForm } from "@/app/_components/assignments/faculty/create-assignment-form";
import { PageHeader } from "@/app/_components/page-header";
import { Button } from "@/app/_components/ui/button";
import { auth } from "@/lib/auth";
import { getAssignmentById } from "@/server/actions/assignment-actions";
import { getUserRole } from "@/server/actions/user-actions";
import { getUserMetrics } from "@/server/actions/metric-actions";
import type { AssignmentById } from "@/lib/types/assignment-tyes";

type EditAssignmentPageProps = {
  params: Promise<{ classCode: string; assignmentId: string }>;
};

export async function generateMetadata({
  params,
}: EditAssignmentPageProps): Promise<Metadata> {
  const { assignmentId } = await params;
  const result = await getAssignmentById(assignmentId);
  const assignment = result.status === "success" ? result.assignment : null;
  if (!assignment) {
    return { title: "Edit Assignment | gradeIT" };
  }
  return {
    title: `Edit ${assignment.title} | gradeIT`,
    description: `Edit assignment ${assignment.title}`,
  };
}

export default async function EditAssignmentPage({
  params,
}: EditAssignmentPageProps) {
  const { classCode, assignmentId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/classes");
  }
  const [result, { role }, { metrics }] = await Promise.all([
    getAssignmentById(assignmentId),
    getUserRole(),
    getUserMetrics(),
  ]);

  if (role !== "FACULTY") {
    redirect(`/classes/${classCode}`);
  }
  if (result.status !== "success" || !result.assignment) {
    notFound();
  }

  const assignment = result.assignment;
  const now = new Date();
  const started =
    assignment.startDate != null && now >= new Date(assignment.startDate);

  if (started) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <PageHeader
          heading="Editing disabled"
          text="This assignment has already started. Editing is not allowed after the start time to avoid affecting students who have already begun submitting."
        />
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/classes/${classCode}/${assignmentId}`}>
            Back to assignment
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <PageHeader
        heading="Edit Assignment"
        text={`Edit "${assignment.title}". Changes will apply immediately.`}
      />
      <div className="mt-8">
        <CreateAssignmentForm
          classCode={classCode}
          existingMetrics={metrics ?? []}
          mode="edit"
          assignmentId={assignmentId}
          initialData={assignment as unknown as AssignmentById}
        />
      </div>
    </div>
  );
}
