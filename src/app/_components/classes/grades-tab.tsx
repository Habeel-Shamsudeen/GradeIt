"use client";

import { useState } from "react";
import { Search, Download, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Progress } from "@/app/_components/ui/progress";

// Mock data for demonstration
const assignments = [
  { id: "1", title: "Binary Search Trees Implementation" },
  { id: "2", title: "Sorting Algorithms Analysis" },
  { id: "3", title: "Graph Algorithms" },
];

const students = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    grades: [
      { assignmentId: "1", score: 92, total: 100, submitted: true },
      { assignmentId: "2", score: 88, total: 100, submitted: true },
      { assignmentId: "3", score: null, total: 100, submitted: false },
    ],
  },
];

export function GradesTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const calculateAverage = (student: (typeof students)[0]) => {
    const submittedGrades = student.grades.filter(
      (grade) => grade.submitted && grade.score !== null,
    );
    if (submittedGrades.length === 0) return null;

    const total = submittedGrades.reduce((sum, grade) => sum + grade.score!, 0);
    return Math.round(total / submittedGrades.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#605F5B]" />
          <Input
            placeholder="Search students..."
            className="pl-9 border-[#E6E4DD]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1 border-[#E6E4DD]">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Students</DropdownMenuItem>
              <DropdownMenuItem>Missing Submissions</DropdownMenuItem>
              <DropdownMenuItem>Graded</DropdownMenuItem>
              <DropdownMenuItem>Not Graded</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-1 border-[#E6E4DD]">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6E4DD] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#FAFAF8]">
              <TableRow>
                <TableHead className="w-[250px] font-medium">Student</TableHead>
                {assignments.map((assignment) => (
                  <TableHead key={assignment.id} className="font-medium">
                    <div className="flex items-center gap-1">
                      <span className="truncate max-w-[150px]">
                        {assignment.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        <span className="sr-only">Sort</span>
                      </Button>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <span>Average</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      <span className="sr-only">Sort</span>
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={assignments.length + 2}
                    className="h-24 text-center"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-[#E6E4DD]">
                          <AvatarImage
                            src={student.avatar}
                            alt={student.name}
                          />
                          <AvatarFallback>
                            {student.name.charAt(0)}
                            {student.name.split(" ")[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#141413]">
                            {student.name}
                          </p>
                          <p className="text-xs text-[#605F5B]">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {assignments.map((assignment) => {
                      const grade = student.grades.find(
                        (g) => g.assignmentId === assignment.id,
                      );
                      return (
                        <TableCell key={`${student.id}-${assignment.id}`}>
                          {grade?.submitted ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {grade.score}/{grade.total}
                                </span>
                                <span className="text-xs text-[#605F5B]">
                                  {Math.round(
                                    (grade.score! / grade.total) * 100,
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={(grade.score! / grade.total) * 100}
                                className="h-1.5"
                                //@ts-ignore recheck
                                indicatorClassName={
                                  grade.score! / grade.total >= 0.9
                                    ? "bg-[#7EBF8E]"
                                    : grade.score! / grade.total >= 0.7
                                      ? "bg-[#F1E6D0]"
                                      : "bg-[#D2886F]"
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-[#605F5B]">
                              Not submitted
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      {calculateAverage(student) !== null ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-medium">
                            {calculateAverage(student)}%
                          </span>
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              calculateAverage(student)! >= 90
                                ? "bg-[#7EBF8E]"
                                : calculateAverage(student)! >= 70
                                  ? "bg-[#F1E6D0]"
                                  : "bg-[#D2886F]"
                            }`}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-[#605F5B]">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
