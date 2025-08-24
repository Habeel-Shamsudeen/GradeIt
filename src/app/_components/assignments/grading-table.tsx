"use client";

import React, { useState, useMemo } from "react";
import {
  GradingTableColumn,
  GradingTableData,
  GradingTableStudent,
  GradingTableSubmission,
} from "@/lib/types/assignment-tyes";
import { StatusBadge } from "@/app/_components/ui/status-badge";
import { EditableScore } from "@/app/_components/ui/editable-score";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Badge } from "@/app/_components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  MoreHorizontal,
  Download,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  Edit3,
  Check,
  X,
} from "lucide-react";

interface GradingTableProps {
  data: GradingTableData;
  columns?: GradingTableColumn[];
  assignmentId?: string;
  onScoreChange?: (
    submissionId: string,
    metricId: string,
    newScore: number,
  ) => void;
  onBulkAction?: (action: string, studentIds: string[]) => void;
}

export const GradingTable: React.FC<GradingTableProps> = ({
  data,
  columns,
  assignmentId,
  onScoreChange,
  onBulkAction,
}) => {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(),
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    scoreRange: "all",
  });

  const sortedData = useMemo(() => {
    if (!sortConfig) return data.students;

    return [...data.students].sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortConfig.key === "student") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortConfig.key === "overallScore") {
        aValue = a.overallScore;
        bValue = b.overallScore;
      } else if (sortConfig.key === "status") {
        aValue = a.status;
        bValue = b.status;
      } else if (sortConfig.key.startsWith("metric_")) {
        const metricId = sortConfig.key.replace("metric_", "");
        aValue =
          a.submissions[0]?.metricScores.find((m) => m.metricId === metricId)
            ?.score || 0;
        bValue =
          b.submissions[0]?.metricScores.find((m) => m.metricId === metricId)
            ?.score || 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data.students, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((student) => {
      // Search filter
      if (
        filters.search &&
        !student.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !student.email.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== "all") {
        const hasMatchingStatus = student.submissions.some(
          (sub) => sub.status === filters.status,
        );
        if (!hasMatchingStatus) return false;
      }

      // Score range filter
      if (filters.scoreRange !== "all") {
        const [min, max] = filters.scoreRange.split("-").map(Number);
        if (student.overallScore < min || student.overallScore > max)
          return false;
      }

      return true;
    });
  }, [sortedData, filters]);

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle bulk selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(filteredData.map((s) => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Student Name",
      "Email",
      "Overall Score",
      ...data.metrics.map((m) => `${m.name} (${m.weight}%)`),
      "Status",
    ];

    const rows = filteredData.map((student) => [
      student.name,
      student.email,
      student.overallScore.toFixed(1),
      ...data.metrics.map((metric) => {
        const score =
          student.submissions[0]?.metricScores.find(
            (m) => m.metricId === metric.id,
          )?.score || 0;
        return score.toString();
      }),
      student.submissions[0]?.status || "NOT_STARTED",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grading-table-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Use passed columns or generate default columns
  const tableColumns = columns || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Grading Table</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={filteredData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            {selectedStudents.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selectedStudents.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      onBulkAction?.("export", Array.from(selectedStudents))
                    }
                  >
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onBulkAction?.("comment", Array.from(selectedStudents))
                    }
                  >
                    Add Comment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="NOT_STARTED">Not Started</SelectItem>
              <SelectItem value="LATE_SUBMISSION">Late Submission</SelectItem>
              <SelectItem value="PARTIAL">Partial</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.scoreRange}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, scoreRange: value }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="90-100">90-100%</SelectItem>
              <SelectItem value="80-89">80-89%</SelectItem>
              <SelectItem value="70-79">70-79%</SelectItem>
              <SelectItem value="60-69">60-69%</SelectItem>
              <SelectItem value="0-59">0-59%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    style={{ width: column.width }}
                    className={
                      column.sortable ? "cursor-pointer hover:bg-muted" : ""
                    }
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.key === "select" ? (
                      <Checkbox
                        checked={
                          selectedStudents.size === filteredData.length &&
                          filteredData.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable &&
                          sortConfig?.key === column.key &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.id}>
                  {tableColumns.map((column) => {
                    if (column.key === "select") {
                      return (
                        <TableCell key={column.key}>
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onCheckedChange={(checked) =>
                              handleSelectStudent(
                                student.id,
                                checked as boolean,
                              )
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
                      const metricScore =
                        student.submissions[0]?.metricScores.find(
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
                              <DropdownMenuItem>
                                View Submission
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      );
                    }

                    return <TableCell key={column.key}></TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No students found matching the current filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
