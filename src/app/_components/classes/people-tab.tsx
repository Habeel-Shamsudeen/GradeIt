"use client";

import { useState } from "react";
import { Search, UserPlus, Mail, MoreVertical } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Members } from "@/lib/types/class-types";
import InvitePeopleDialog from "./Invite-dialog";
import { Role } from "@prisma/client";
import { removeStudentFromClass } from "@/server/actions/class-actions";
import { toast } from "sonner";

interface PeopleTabProps {
  classCode: string;
  teachers: Members[];
  students: Members[];
  role: Role;
}

export function PeopleTab({
  classCode,
  teachers,
  students,
  role,
}: PeopleTabProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemoveFromClass = async (studentId: string) => {
    try {
      const response = await removeStudentFromClass(classCode, studentId);
      if (response.status === "success") {
        toast.success("Student removed from class");
      } else {
        toast.error("Failed to remove student from class");
      }
    } catch (error) {
      toast.error("An error occurred while removing the student");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#605F5B]" />
          <Input
            placeholder="Search people..."
            className="pl-9 border-[#E6E4DD]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setInviteDialogOpen(true)}
          className="gap-1 whitespace-nowrap bg-primary-button text-white hover:bg-primary-button-hover transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Invite People
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium">Teachers</h3>
        </div>
        <div className="divide-y divide-[#E6E4DD]">
          {filteredTeachers.length === 0 ? (
            <div className="p-6 text-center text-[#605F5B]">
              No teachers found
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-4 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-[#E6E4DD]">
                    <AvatarImage src={teacher.image || ""} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name.charAt(0)}
                      {teacher.name.split(" ")[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#605F5B]"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-[#605F5B]"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium">Students</h3>
          <p className="text-sm text-[#605F5B]">{students.length} students</p>
        </div>
        <div className="divide-y divide-border">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-[#605F5B]">
              No students found
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={student.image || ""} alt={student.name} />
                    <AvatarFallback>
                      {student.name.charAt(0)}
                      {student.name.split(" ")[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-[#605F5B]">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#605F5B]"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-[#605F5B]"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>View submissions</DropdownMenuItem>
                      {role === "FACULTY" && (
                        <>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemoveFromClass(student.id)}
                          >
                            Remove from class
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <InvitePeopleDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        classCode={classCode}
      />
    </div>
  );
}
