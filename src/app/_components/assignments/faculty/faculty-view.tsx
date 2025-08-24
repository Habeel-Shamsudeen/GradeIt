"use client";

import { cn, exportToCSV } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
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
import { AssignmentById, StudentProgress } from "@/lib/types/assignment-tyes";
import { getStudentAssignmentProgress } from "@/server/actions/submission-actions";
import { setStudentCookie } from "@/server/actions/utility-actions";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import { SubmissionStatus } from "@prisma/client";
import { StatusBadge } from "../../ui/status-badge";

interface FacultyViewProps {
  assignment: AssignmentById;
  classCode: string;
  initialStudents: StudentProgress[];
}

export function FacultyView({
  assignment,
  classCode,
  initialStudents,
}: FacultyViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentProgress[]>(initialStudents);
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
    (s) => s.status === SubmissionStatus.COMPLETED,
  ).length;
  const inProgressCount = students.filter(
    (s) => s.status === SubmissionStatus.IN_PROGRESS,
  ).length;
  const notStartedCount = students.filter(
    (s) => s.status === SubmissionStatus.NOT_STARTED,
  ).length;

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-foreground">
          {assignment.title}
        </h1>
        <p className="mt-1 text-muted-foreground">
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
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Total Students
            </CardTitle>
            <CardDescription>Number of enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-foreground">
              {totalStudents}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-status-passed" />
              Completed
            </CardTitle>
            <CardDescription>
              Students who completed all questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-foreground">
              {completedCount}
            </p>
            <Progress
              value={(completedCount / totalStudents) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-status-pending-foreground" />
              In Progress
            </CardTitle>
            <CardDescription>Students currently working</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-foreground">
              {inProgressCount}
            </p>
            <Progress
              value={(inProgressCount / totalStudents) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Not Started
            </CardTitle>
            <CardDescription>Students yet to begin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-foreground">
              {notStartedCount}
            </p>
            <Progress
              value={(notStartedCount / totalStudents) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="rounded-2xl border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Progress</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-9 border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1.5 border-border">
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
                <Link href={`/classes/${classCode}/${assignment.id}/grading`}>
                  <Button className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                    <BarChart3 className="h-4 w-4" />
                    Grading Table
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="gap-1.5 border-border"
                  onClick={() => exportToCSV(students)}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {student.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {student.questionsCompleted} /{" "}
                        {assignment.questions.length} Questions
                      </p>
                      {student.status === SubmissionStatus.COMPLETED && (
                        <p className="text-sm text-muted-foreground">
                          Score: {student.score}%
                        </p>
                      )}
                    </div>
                    <StatusBadge status={student.status} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground"
                      onClick={async () => {
                        await setStudentCookie(student.id);
                        window.location.href = `/classes/${classCode}/${assignment.id}/submissions`;
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
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
