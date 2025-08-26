"use client";

import { AssignmentById } from "@/lib/types/assignment-tyes";

interface AssignmentHeaderProps {
  assignment: AssignmentById;
}

export function AssignmentHeader({ assignment }: AssignmentHeaderProps) {
  return (
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
  );
}
