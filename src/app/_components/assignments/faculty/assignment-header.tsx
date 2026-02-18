"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { AssignmentById } from "@/lib/types/assignment-tyes";
import { deleteAssignment } from "@/server/actions/assignment-actions";
import { toast } from "sonner";

interface AssignmentHeaderProps {
  assignment: AssignmentById;
  classCode: string;
}

export function AssignmentHeader({
  assignment,
  classCode,
}: AssignmentHeaderProps) {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const canEdit =
    !assignment.startDate || new Date() < new Date(assignment.startDate);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteAssignment(assignment.id);
      if (result.status === "success") {
        toast.success("Assignment deleted.");
        router.push(`/classes/${classCode}`);
      } else {
        toast.error(result.message ?? "Failed to delete assignment");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-medium text-foreground">
          {assignment.title}
        </h1>
        <div className="mt-1 space-y-0.5 text-muted-foreground">
          {assignment.startDate && (
            <p>
              Starts{" "}
              {new Date(assignment.startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          )}
          <p>
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
      </div>
      <div className="flex shrink-0 gap-2">
        {canEdit && (
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/classes/${classCode}/${assignment.id}/edit`}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit assignment
            </Link>
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-border bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                assignment and all associated questions and student submissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border text-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
