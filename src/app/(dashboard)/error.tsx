"use client";

import { useEffect } from "react";
import { Button } from "@/app/_components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="max-w-md text-center text-muted-foreground">
        An error occurred while loading this page. You can try again.
      </p>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  );
}
