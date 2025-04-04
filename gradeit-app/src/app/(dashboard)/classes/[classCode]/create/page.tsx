import type { Metadata } from "next"
import { CreateAssignmentForm } from "@/app/_components/assignments/create-assignment-form"
import { PageHeader } from "@/app/_components/page-header"
import { auth } from "@/lib/auth";
import { getUserRole } from "@/server/actions/user-actions";
import Loading from "../../loading";

export const metadata: Metadata = {
  title: "Create Assignment | gradeIT",
  description: "Create a new coding assignment for your class",
}

export default async function CreateAssignmentPage({ params }: any) {
  const { classCode } = await params;
  const session = await auth();
  if(!session?.user){
    return <Loading/>
  }
  const { role } = await getUserRole();
  if(role !== "FACULTY"){
    return <div>You are not authorized to create assignments</div>
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <PageHeader heading="Create Assignment" text="Create a new coding assignment for your students." />
      <div className="mt-8">
        <CreateAssignmentForm classCode={classCode} />
      </div>
    </div>
  )
}

