"use client";

import { GradingTable } from "@/app/_components/assignments/grading-table";
import { toast } from "sonner";

// Sample data for testing
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

export default function GradingTablePage() {
  const handleScoreChange = (
    submissionId: string,
    metricId: string,
    newScore: number,
  ) => {
    toast.success(`Score updated: ${newScore} for metric ${metricId}`);
    console.log("Score change:", { submissionId, metricId, newScore });
    // Here you would typically call an API to update the score
  };

  const handleBulkAction = (action: string, studentIds: string[]) => {
    toast.success(
      `${action} action performed on ${studentIds.length} students`,
    );
    console.log("Bulk action:", { action, studentIds });
    // Here you would typically call an API to perform bulk actions
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grading Table Demo</h1>
          <p className="text-muted-foreground mt-2">
            Interactive grading table with editable scores, sorting, filtering,
            and export capabilities
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Features:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>
              • <strong>Editable Scores:</strong> Click on any score to edit it
              inline
            </li>
            <li>
              • <strong>Sorting:</strong> Click column headers to sort by any
              metric
            </li>
            <li>
              • <strong>Filtering:</strong> Search students, filter by status or
              score range
            </li>
            <li>
              • <strong>Bulk Actions:</strong> Select multiple students for
              batch operations
            </li>
            <li>
              • <strong>Export:</strong> Download table data as CSV
            </li>
            <li>
              • <strong>Mobile Responsive:</strong> Horizontal scroll for many
              metrics
            </li>
          </ul>
        </div>

        <GradingTable
          data={sampleData}
          onScoreChange={handleScoreChange}
          onBulkAction={handleBulkAction}
        />
      </div>
    </div>
  );
}
