"use client";

import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { AssignmentById } from "@/lib/types/assignment-tyes";
import { getStudentAssignmentProgress } from "@/server/actions/submission-actions";
import { setStudentCookie } from "@/server/utils";
interface FacultyViewProps {
  assignment: AssignmentById;
  classCode: string;
  initialStudents: any[];
}

// Mock data for demonstration
// const students = [
//   {
//     id: "1",
//     name: "Alex Chen",
//     email: "alex.chen@university.edu",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "completed",
//     submittedAt: "2024-03-04T15:30:00",
//     score: 95,
//     questionsCompleted: 2,
//   },
//   {
//     id: "2",
//     name: "Jamie Smith",
//     email: "jamie.smith@university.edu",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "in_progress",
//     submittedAt: null,
//     score: null,
//     questionsCompleted: 1,
//   },
//   {
//     id: "3",
//     name: "Taylor Johnson",
//     email: "taylor.johnson@university.edu",
//     avatar: "/placeholder.svg?height=40&width=40",
//     status: "not_started",
//     submittedAt: null,
//     score: null,
//     questionsCompleted: 0,
//   },
// ]

export function FacultyView({
  assignment,
  classCode,
  initialStudents,
}: FacultyViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [students, setStudents] = useState(initialStudents);
  const [loading, setLoading] = useState(false);

  // Load student progress data
  const loadStudentProgress = async () => {
    try {
      setLoading(true);
      const data = await getStudentAssignmentProgress(assignment.id, classCode);
      setStudents(data);
    } catch (error) {
      console.error("Failed to load student progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentProgress();
  }, [assignment.id, classCode]);

  const totalStudents = students.length;
  const completedCount = students.filter(
    (s) => s.status === "completed"
  ).length;
  const inProgressCount = students.filter(
    (s) => s.status === "in_progress"
  ).length;
  const notStartedCount = students.filter(
    (s) => s.status === "not_started"
  ).length;

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[#141413]">
          {assignment.title}
        </h1>
        <p className="mt-1 text-[#605F5B]">
          Due{" "}
          {assignment.dueDate
            ? new Date(assignment.dueDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : "No due date"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="rounded-2xl border-[#E6E4DD]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#605F5B]" />
              Total Students
            </CardTitle>
            <CardDescription>Number of enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E6E4DD]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#7EBF8E]" />
              Completed
            </CardTitle>
            <CardDescription>
              Students who completed all questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">{completedCount}</p>
            <Progress
              value={(completedCount / totalStudents) * 100}
              className="mt-2 "
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E6E4DD]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#F1E6D0]" />
              In Progress
            </CardTitle>
            <CardDescription>Students currently working</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">{inProgressCount}</p>
            <Progress
              value={(inProgressCount / totalStudents) * 100}
              className="mt-2 "
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E6E4DD]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-[#D2886F]" />
              Not Started
            </CardTitle>
            <CardDescription>Students yet to begin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">{notStartedCount}</p>
            <Progress
              value={(notStartedCount / totalStudents) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="rounded-2xl border-[#E6E4DD]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Progress</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#605F5B]" />
                  <Input
                    placeholder="Search students..."
                    className="pl-9 border-[#E6E4DD]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-1.5 border-[#E6E4DD]"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Students</DropdownMenuItem>
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>In Progress</DropdownMenuItem>
                    <DropdownMenuItem>Not Started</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="gap-1.5 border-[#E6E4DD]">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#E6E4DD]">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-[#E6E4DD]">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#141413]">
                        {student.name}
                      </p>
                      <p className="text-sm text-[#605F5B]">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#141413]">
                        {student.questionsCompleted} /{" "}
                        {assignment.questions.length} Questions
                      </p>
                      {student.status === "completed" && (
                        <p className="text-sm text-[#605F5B]">
                          Score: {student.score}%
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex h-8 items-center rounded-full px-3 text-sm",
                        student.status === "completed" &&
                          "bg-[#7EBF8E]/10 text-[#7EBF8E]",
                        student.status === "in_progress" &&
                          "bg-[#F1E6D0]/10 text-[#3A3935]",
                        student.status === "not_started" &&
                          "bg-[#D2886F]/10 text-[#D2886F]"
                      )}
                    >
                      {student.status === "completed" && "Completed"}
                      {student.status === "in_progress" && "In Progress"}
                      {student.status === "not_started" && "Not Started"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-[#605F5B]"
                      onClick={async () =>{
                        await setStudentCookie(student.id);
                        window.location.href = `/classes/${classCode}/${assignment.id}/submissions`
                      }
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="py-8 text-center text-[#605F5B]">
                  No students found matching your search
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
