"use client";

import { useState } from "react";
import {
  updateStudentScore,
  performBulkAction,
} from "@/server/actions/grading-actions";
import { toast } from "sonner";
import { GradingTable } from "./grading-table";
import {
  GradingTableColumn,
  GradingTableData,
  GradingTableStudent,
} from "@/lib/types/assignment-tyes";

interface GradingTableClientProps {
  data: GradingTableData;
  columns: GradingTableColumn[];
  assignmentId: string;
}

export function GradingTableClient({
  data,
  columns,
  assignmentId,
}: GradingTableClientProps) {
  const [gradingData, setGradingData] = useState<GradingTableData>(data);

  const handleScoreChange = async (
    submissionId: string,
    metricId: string,
    newScore: number,
  ) => {
    try {
      const result = await updateStudentScore(submissionId, metricId, newScore);

      if (result.success) {
        setGradingData((prev) => ({
          ...prev,
          students: prev.students.map((student) => ({
            ...student,
            submissions: student.submissions.map((sub) => {
              if (sub.id === submissionId) {
                if (metricId === "testCases") {
                  return {
                    ...sub,
                    testCaseScore: newScore,
                  };
                } else {
                  return {
                    ...sub,
                    metricScores: sub.metricScores.map((metric) => {
                      if (metric.metricId === metricId) {
                        return { ...metric, score: newScore };
                      }
                      return metric;
                    }),
                  };
                }
              }
              return sub;
            }),
          })),
        }));

        toast.success("Score updated successfully");
      } else {
        toast.error(result.error || "Failed to update score");
      }
    } catch (error) {
      console.error("Failed to update score:", error);
      toast.error("Failed to update score");
    }
  };

  const handleBulkAction = async (action: string, studentIds: string[]) => {
    try {
      const result = await performBulkAction(action, studentIds, assignmentId);

      if (result.success) {
        toast.success(
          `${action} action performed on ${studentIds.length} students`,
        );
      } else {
        toast.error(result.error || "Failed to perform bulk action");
      }
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
      toast.error("Failed to perform bulk action");
    }
  };

  return (
    <GradingTable
      data={gradingData}
      columns={columns}
      assignmentId={assignmentId}
      onScoreChange={handleScoreChange}
      onBulkAction={handleBulkAction}
    />
  );
}
