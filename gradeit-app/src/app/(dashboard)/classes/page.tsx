import type { Metadata } from "next"
import { ClassGrid } from "@/app/_components/classes/class-grid"
import { PageHeader } from "@/app/_components/page-header"
import { getUserClasses } from "@/server/actions/class-actions"
import { auth } from "@/lib/auth"
import Loading from "./loading"

export const metadata: Metadata = {
  title: "Classes | gradeIT",
  description: "Manage and access your coding classes",
}

export default async function ClassesPage() {
  const session = await auth();
  if(!session?.user){
    return <Loading/>
  }
  const {classes, role } = await getUserClasses();
  return (
    <div className="flex flex-col gap-8 p-6 py-0">
      <PageHeader heading="Classes" text="Access and manage your coding classes." />
      <ClassGrid classes={classes || []} role={role || "STUDENT"}/>
    </div>
  )
}