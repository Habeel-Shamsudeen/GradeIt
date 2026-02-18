"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import { getAssignmentsByClassCode } from "@/server/actions/assignment-actions";
import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type AssignmentItem = { id: string; title: string };

export function SidebarAssignments() {
  const pathname = usePathname();
  const [data, setData] = useState<{
    assignments: AssignmentItem[];
    className: string | null;
  } | null>(null);

  const segments = pathname.split("/").filter(Boolean);
  const isClassRoute = segments[0] === "classes" && segments[1];
  const classCode = isClassRoute ? segments[1] : null;
  const assignmentIdFromPath = isClassRoute && segments[2] ? segments[2] : null;

  useEffect(() => {
    if (!classCode) {
      setData(null);
      return;
    }
    let cancelled = false;
    getAssignmentsByClassCode(classCode).then((result) => {
      if (cancelled || result.status !== "success") {
        if (!cancelled) setData(null);
        return;
      }
      setData({
        assignments: result.assignments,
        className: result.className,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [classCode]);

  if (!classCode || !data?.assignments.length) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-bold text-sidebar-primary-foreground">
        {data.className ? `Assignments · ${data.className}` : "Assignments"}
      </SidebarGroupLabel>
      <SidebarMenu className="text-sidebar-primary-foreground">
        {data.assignments.map((a) => (
          <SidebarMenuItem key={a.id}>
            <SidebarMenuButton
              asChild
              isActive={
                pathname === `/classes/${classCode}/${a.id}` ||
                pathname.startsWith(`/classes/${classCode}/${a.id}/`)
              }
              tooltip={a.title}
            >
              <Link href={`/classes/${classCode}/${a.id}`}>
                <span className="truncate text-sm font-medium">{a.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
