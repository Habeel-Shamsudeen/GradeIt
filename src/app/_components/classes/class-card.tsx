"use client";

import Link from "next/link";
import { MoreVertical, Users, FolderClosed } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/_components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { UserClassroom } from "@/lib/types/class-types";

interface ClassCardProps extends UserClassroom {
  backgroundColor: string;
}

export function ClassCard({
  code,
  name,
  section,
  facultyName,
  backgroundColor,
}: ClassCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-[#E6E4DD] bg-white transition-all hover:shadow-lg dark:bg-white/[0.02]">
      <Link href={`/classes/${code}`} className="absolute inset-0 z-10">
        <span className="sr-only">View class</span>
      </Link>

      <CardHeader className="relative h-32 p-0">
        <div className="absolute inset-0 z-0" style={{ backgroundColor }}></div>
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium">{name}</h3>
              <p className="text-sm opacity-90">{section}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="z-20 h-8 w-8 shrink-0 rounded-full text-white/90 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Copy class code</DropdownMenuItem>
                <DropdownMenuItem>Edit class details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Archive class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm opacity-90">{facultyName}</p>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Access assignments, view grades, and collaborate with your classmates.
        </p>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 p-2">
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-2 px-3 py-2 text-[#605F5B] hover:text-[#141413]"
        >
          <Users className="h-4 w-4" />
          <span className="text-sm">People</span>
        </Button>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-2 px-3 py-2 text-[#605F5B] hover:text-[#141413]"
        >
          <FolderClosed className="h-4 w-4" />
          <span className="text-sm">Files</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
