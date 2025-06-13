"use client";

import {
  HugeiconsIcon,
  UserAccountIcon,
  SchoolIcon,
  CalculatorIcon,
  Atom01Icon,
  TestTube01Icon,
  Chemistry01Icon,
  UniversityIcon,
  LibrariesIcon,
  Notebook01Icon,
} from "hugeicons-react";

const iconComponentMap: Record<string, HugeiconsIcon> = {
  CalculatorIcon: CalculatorIcon as HugeiconsIcon,
  Atom01Icon: Atom01Icon as HugeiconsIcon,
  TestTubeIcon: TestTube01Icon as HugeiconsIcon,
  Chemistry01Icon: Chemistry01Icon as HugeiconsIcon,
  SchoolIcon: SchoolIcon as HugeiconsIcon,
  UniversityIcon: UniversityIcon as HugeiconsIcon,
  LibraryIcon: LibrariesIcon as HugeiconsIcon,
  NotebookIcon: Notebook01Icon as HugeiconsIcon,
  UserAccountIcon: UserAccountIcon as HugeiconsIcon,
};

export const getIconComponent = (iconName: string): HugeiconsIcon => {
  return iconComponentMap[iconName];
};
