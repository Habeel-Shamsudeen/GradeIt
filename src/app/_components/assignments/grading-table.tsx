"use client";

import React, { useState, useMemo } from "react";
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

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Metric {
  id: string;
  name: string;
  weight: number;
}

interface Submission {
  id: string;
  studentId: string;
  testCaseScore: number;
  metricScores: {
    metricId: string;
    metricName: string;
    score: number;
    weight: number;
  }[];
  totalScore: number;
  status: "completed" | "in_progress" | "not_started" | "failed";
  submittedAt: string;
}

interface GradingTableData {
  students: (Student & {
    submissions: Submission[];
    overallScore: number;
  })[];
  metrics: Metric[];
}

interface EditableScoreProps {
  value: number;
  onChange: (newScore: number) => void;
  maxScore?: number;
  className?: string;
}

// Editable Score Component
const EditableScore: React.FC<EditableScoreProps> = ({
  value,
  onChange,
  maxScore = 100,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (tempValue >= 0 && tempValue <= maxScore) {
      onChange(tempValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-semibold";
    if (score >= 80) return "text-blue-600 font-semibold";
    if (score >= 70) return "text-yellow-600 font-semibold";
    if (score >= 60) return "text-orange-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(Number(e.target.value))}
            min={0}
            max={maxScore}
            className="w-16 h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleSave}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleCancel}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`cursor-pointer hover:bg-muted p-1 rounded transition-colors ${getScoreColor(value)} ${className}`}
          onClick={() => setIsEditing(true)}
        >
          {value}
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-100 text-green-800", label: "Completed" };
      case "in_progress":
        return { color: "bg-yellow-100 text-yellow-800", label: "In Progress" };
      case "not_started":
        return { color: "bg-gray-100 text-gray-800", label: "Not Started" };
      case "failed":
        return { color: "bg-red-100 text-red-800", label: "Failed" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: status };
    }
  };

  const config = getStatusConfig(status);
  return <Badge className={config.color}>{config.label}</Badge>;
};

// Main Grading Table Component
interface GradingTableProps {
  data: GradingTableData;
  onScoreChange?: (
    submissionId: string,
    metricId: string,
    newScore: number,
  ) => void;
  onBulkAction?: (action: string, studentIds: string[]) => void;
}

export const GradingTable: React.FC<GradingTableProps> = ({
  data,
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

  const sampleData = {
    students: [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "",
        overallScore: 87.5,
        submissions: [
          {
            id: "sub1",
            studentId: "1",
            questionId: "q1",
            questionTitle: "Fibonacci Sequence",
            testCaseScore: 85,
            metricScores: [
              {
                metricId: "metric1",
                metricName: "Code Quality",
                score: 90,
                weight: 30,
              },
              {
                metricId: "metric2",
                metricName: "Algorithm Efficiency",
                score: 85,
                weight: 40,
              },
              {
                metricId: "metric3",
                metricName: "Documentation",
                score: 80,
                weight: 30,
              },
            ],
            totalScore: 87.5,
            status: "completed" as const,
            submittedAt: "2024-01-15T10:30:00Z",
          },
        ],
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "",
        overallScore: 92.0,
        submissions: [
          {
            id: "sub2",
            studentId: "2",
            questionId: "q1",
            questionTitle: "Fibonacci Sequence",
            testCaseScore: 95,
            metricScores: [
              {
                metricId: "metric1",
                metricName: "Code Quality",
                score: 95,
                weight: 30,
              },
              {
                metricId: "metric2",
                metricName: "Algorithm Efficiency",
                score: 90,
                weight: 40,
              },
              {
                metricId: "metric3",
                metricName: "Documentation",
                score: 95,
                weight: 30,
              },
            ],
            totalScore: 92.0,
            status: "completed" as const,
            submittedAt: "2024-01-15T11:15:00Z",
          },
        ],
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        avatar: "",
        overallScore: 65.0,
        submissions: [
          {
            id: "sub3",
            studentId: "3",
            questionId: "q1",
            questionTitle: "Fibonacci Sequence",
            testCaseScore: 60,
            metricScores: [
              {
                metricId: "metric1",
                metricName: "Code Quality",
                score: 70,
                weight: 30,
              },
              {
                metricId: "metric2",
                metricName: "Algorithm Efficiency",
                score: 60,
                weight: 40,
              },
              {
                metricId: "metric3",
                metricName: "Documentation",
                score: 65,
                weight: 30,
              },
            ],
            totalScore: 65.0,
            status: "completed" as const,
            submittedAt: "2024-01-15T14:20:00Z",
          },
        ],
      },
      {
        id: "4",
        name: "Alice Brown",
        email: "alice.brown@example.com",
        avatar: "",
        overallScore: 0,
        submissions: [
          {
            id: "sub4",
            studentId: "4",
            questionId: "q1",
            questionTitle: "Fibonacci Sequence",
            testCaseScore: 0,
            metricScores: [
              {
                metricId: "metric1",
                metricName: "Code Quality",
                score: 0,
                weight: 30,
              },
              {
                metricId: "metric2",
                metricName: "Algorithm Efficiency",
                score: 0,
                weight: 40,
              },
              {
                metricId: "metric3",
                metricName: "Documentation",
                score: 0,
                weight: 30,
              },
            ],
            totalScore: 0,
            status: "not_started" as const,
            submittedAt: "",
          },
        ],
      },
      {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        avatar: "",
        overallScore: 45.0,
        submissions: [
          {
            id: "sub5",
            studentId: "5",
            questionId: "q1",
            questionTitle: "Fibonacci Sequence",
            testCaseScore: 40,
            metricScores: [
              {
                metricId: "metric1",
                metricName: "Code Quality",
                score: 50,
                weight: 30,
              },
              {
                metricId: "metric2",
                metricName: "Algorithm Efficiency",
                score: 40,
                weight: 40,
              },
              {
                metricId: "metric3",
                metricName: "Documentation",
                score: 45,
                weight: 30,
              },
            ],
            totalScore: 45.0,
            status: "failed" as const,
            submittedAt: "2024-01-15T16:45:00Z",
          },
        ],
      },
    ],
    metrics: [
      { id: "metric1", name: "Code Quality", weight: 30 },
      { id: "metric2", name: "Algorithm Efficiency", weight: 40 },
      { id: "metric3", name: "Documentation", weight: 30 },
    ],
  };

  // Sorting function
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
      } else if (sortConfig.key.startsWith("metric_")) {
        const metricId = sortConfig.key.replace("metric_", "");
        aValue =
          a.submissions[0]?.metricScores.find((m) => m.metricId === metricId)
            ?.score || 0;
        bValue =
          b.submissions[0]?.metricScores.find((m) => m.metricId === metricId)
            ?.score || 0;
      } else {
        aValue = a[sortConfig.key as keyof typeof a];
        bValue = b[sortConfig.key as keyof typeof b];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data.students, sortConfig]);

  // Filtering function
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
      student.submissions[0]?.status || "not_started",
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

  // Generate table columns
  const columns = [
    {
      key: "select",
      label: "",
      sortable: false,
      width: "50px",
    },
    {
      key: "student",
      label: "Student",
      sortable: true,
      width: "200px",
    },
    ...data.metrics.map((metric) => ({
      key: `metric_${metric.id}`,
      label: `${metric.name} (${metric.weight}%)`,
      sortable: true,
      width: "120px",
    })),
    {
      key: "overallScore",
      label: "Overall Score",
      sortable: true,
      width: "120px",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "120px",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      width: "100px",
    },
  ];

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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
                {columns.map((column) => (
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
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.has(student.id)}
                      onCheckedChange={(checked) =>
                        handleSelectStudent(student.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
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

                  {data.metrics.map((metric) => {
                    const metricScore =
                      student.submissions[0]?.metricScores.find(
                        (m) => m.metricId === metric.id,
                      );
                    return (
                      <TableCell key={metric.id}>
                        <EditableScore
                          value={metricScore?.score || 0}
                          onChange={(newScore) =>
                            onScoreChange?.(
                              student.submissions[0]?.id || "",
                              metric.id,
                              newScore,
                            )
                          }
                        />
                      </TableCell>
                    );
                  })}

                  <TableCell>
                    <div className="font-bold text-lg">
                      {student.overallScore.toFixed(1)}%
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={student.submissions[0]?.status || "not_started"}
                    />
                  </TableCell>

                  <TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Comment</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
