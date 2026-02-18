"use client";

import type { LucideIcon } from "lucide-react";
import {
  UserCircle,
  School,
  Calculator,
  Atom,
  TestTube,
  FlaskConical,
  GraduationCap,
  Library,
  BookOpen,
} from "lucide-react";

const iconComponentMap: Record<string, LucideIcon> = {
  CalculatorIcon: Calculator,
  Atom01Icon: Atom,
  TestTubeIcon: TestTube,
  Chemistry01Icon: FlaskConical,
  SchoolIcon: School,
  UniversityIcon: GraduationCap,
  LibraryIcon: Library,
  NotebookIcon: BookOpen,
  UserAccountIcon: UserCircle,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconComponentMap[iconName] ?? UserCircle;
};
