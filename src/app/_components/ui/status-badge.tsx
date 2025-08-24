import { Badge } from "./badge";
import { SubmissionStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: SubmissionStatus | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return {
          color:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
          label: "Not Started",
        };
      case "IN_PROGRESS":
        return {
          color:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
          label: "In Progress",
        };
      case "LATE_SUBMISSION":
        return {
          color:
            "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
          label: "Late Submission",
        };
      case "COMPLETED":
        return {
          color:
            "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
          label: "Completed",
        };
      case "PARTIAL":
        return {
          color:
            "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
          label: "Partial",
        };
      case "FAILED":
        return {
          color:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
          label: "Failed",
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`${config.color} hover:opacity-80 transition-opacity ${className}`}
    >
      {config.label}
    </Badge>
  );
}
