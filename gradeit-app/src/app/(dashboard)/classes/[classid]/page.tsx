import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { AssignmentList } from "@/app/_components/assignments/assignment-list"
import { ClassHeader } from "@/app/_components/classes/class-header"
import { PeopleTab } from "@/app/_components/classes/people-tab"
import { GradesTab } from "@/app/_components/classes/grades-tab"
import { ClassSettingsTab } from "@/app/_components/classes/settings-tab"
import { getClassbyCode } from "@/server/actions/class-actions"
import { getUserRole } from "@/server/actions/user-actions"

export const metadata: Metadata = {
  title: "Class Details | gradeIT",
  description: "View and manage assignments for this class",
}

export default async function ClassPage({ params }: any ) {
  const {classid} = await params;
  const {classroom} = await getClassbyCode(classid);
  const {role} = await getUserRole();
  //const { students } = await getStudentsByClassId(classroom?.id);

  if(!classroom){
    return notFound()
  }

  return (
    <div className="flex flex-col">
      <ClassHeader classData={classroom} />
      <div className="mx-auto max-w-6xl w-full px-6 pt-6">
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="bg-[#F0EFEA] mb-6">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <AssignmentList classId={classid} role={role || "STUDENT"}/>
          </TabsContent>

          <TabsContent value="people">
            <PeopleTab classId={classid}/>
          </TabsContent>

          <TabsContent value="grades">
            <GradesTab classId={classid} />
          </TabsContent>

          <TabsContent value="settings">
            <ClassSettingsTab classId={classid} classData={classroom} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}