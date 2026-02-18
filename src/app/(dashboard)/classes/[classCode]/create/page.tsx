import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateAssignmentForm } from "@/app/_components/assignments/faculty/create-assignment-form";
import { PageHeader } from "@/app/_components/page-header";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/server/actions/user-actions";
import { getUserMetrics } from "@/server/actions/metric-actions";

export const metadata: Metadata = {
  title: "Create Assignment | gradeIT",
  description: "Create a new coding assignment for your class",
};

export default async function CreateAssignmentPage({
  params,
}: {
  params: Promise<{ classCode: string }>;
}) {
  const { classCode } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/classes");
  }
  const [{ role }, { metrics }] = await Promise.all([
    getUserRole(),
    getUserMetrics(),
  ]);
  if (role !== "FACULTY") {
    redirect(`/classes/${classCode}`);
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <PageHeader
        heading="Create Assignment"
        text="Create a new coding assignment for your students."
      />
      <div className="mt-8">
        <CreateAssignmentForm
          classCode={classCode}
          existingMetrics={metrics ?? []}
        />
      </div>
    </div>
  );
}
