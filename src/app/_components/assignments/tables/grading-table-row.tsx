"use client";

import { MoreHorizontal, Edit3 } from "lucide-react";
import { TableCell, TableRow } from "@/app/_components/ui/table";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Button } from "@/app/_components/ui/button";
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
import { StatusBadge } from "@/app/_components/ui/status-badge";
import { EditableScore } from "@/app/_components/ui/editable-score";
import {
  GradingTableColumn,
  GradingTableStudent,
} from "@/lib/types/assignment-tyes";

interface GradingTableRowProps {
  student: GradingTableStudent;
  columns: GradingTableColumn[];
  isSelected: boolean;
  onSelect: (studentId: string, checked: boolean) => void;
  onScoreChange?: (
    submissionId: string,
    metricId: string,
    newScore: number,
  ) => void;
}

export function GradingTableRow({
  student,
  columns,
  isSelected,
  onSelect,
  onScoreChange,
}: GradingTableRowProps) {
  return (
    <TableRow>
      {columns.map((column) => {
        if (column.key === "select") {
          return (
            <TableCell key={column.key}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelect(student.id, checked as boolean)
                }
              />
            </TableCell>
          );
        }

        if (column.key === "student") {
          return (
            <TableCell key={column.key}>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.email}
                  </div>
                </div>
              </div>
            </TableCell>
          );
        }

        if (column.key === "testCases") {
          return (
            <TableCell key={column.key}>
              <EditableScore
                value={student.submissions[0]?.testCaseScore || 0}
                onChange={(newScore) =>
                  onScoreChange?.(
                    student.submissions[0]?.id || "",
                    "testCases",
                    newScore,
                  )
                }
              />
            </TableCell>
          );
        }

        if (column.key.startsWith("metric_")) {
          const metricId = column.key.replace("metric_", "");
          const metricScore = student.submissions[0]?.metricScores.find(
            (m) => m.metricId === metricId,
          );
          return (
            <TableCell key={column.key}>
              <EditableScore
                value={metricScore?.score || 0}
                onChange={(newScore) =>
                  onScoreChange &&
                  onScoreChange(
                    student.submissions[0]?.id || "",
                    metricId,
                    newScore,
                  )
                }
              />
            </TableCell>
          );
        }

        if (column.key === "overallScore") {
          return (
            <TableCell key={column.key}>
              <div className="font-bold text-lg">
                {student.overallScore.toFixed(1)}%
              </div>
            </TableCell>
          );
        }

        if (column.key === "status") {
          return (
            <TableCell key={column.key}>
              <StatusBadge status={student.status} />
            </TableCell>
          );
        }

        if (column.key === "actions") {
          return (
            <TableCell key={column.key}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Scores
                  </DropdownMenuItem>
                  <DropdownMenuItem>View Submission</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          );
        }

        return <TableCell key={column.key}></TableCell>;
      })}
    </TableRow>
  );
}
