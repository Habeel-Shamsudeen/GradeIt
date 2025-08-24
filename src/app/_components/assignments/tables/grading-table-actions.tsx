"use client";

import { Download } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  GradingTableData,
  GradingTableStudent,
} from "@/lib/types/assignment-tyes";

interface GradingTableActionsProps {
  selectedStudents: Set<string>;
  filteredData: GradingTableStudent[];
  data: GradingTableData;
  onBulkAction?: (action: string, studentIds: string[]) => void;
  onExport: () => void;
}

export function GradingTableActions({
  selectedStudents,
  filteredData,
  data,
  onBulkAction,
  onExport,
}: GradingTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
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
  );
}
