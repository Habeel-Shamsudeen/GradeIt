"use client";

import {
  GradingTableData,
  GradingTableStudent,
} from "@/lib/types/assignment-tyes";

// Export to CSV utility function
export function exportGradingTableToCSV(
  filteredData: GradingTableStudent[],
  data: GradingTableData,
): void {
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
}
