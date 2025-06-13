import { darkCardColors, lightCardColors } from "@/config/constants";
import { getAssigmentTitleFromId, getClassNameFromCode } from "@/server/utils";
import { type ClassValue, clsx } from "clsx";
import { randomUUID } from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  for (let i = 0; i < paths.length; i++) {
    let label = paths[i];
    const href = `/${paths.slice(0, i + 1).join("/")}`;
    const isLast = i === paths.length - 1;

    if (i === 1) {
      const className = await getClassNameFromCode(paths[i]);
      if (className) label = className;
    }

    if (i === 2) {
      const assignmentTitle = await getAssigmentTitleFromId(paths[i]);
      if (assignmentTitle) label = assignmentTitle;
    }

    breadcrumbs.push({ href, label, isLast });
  }

  return breadcrumbs;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function snakeCase(string: string) {
  return string.toLowerCase().replace(/ /g, "_");
}

export function kebabCase(string: string) {
  return string.toLowerCase().replace(/ /g, "-");
}

export const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

export function formatNumberShort(num: number | string): string {
  // Convert string numbers with commas to number type
  const normalizedNum =
    typeof num === "string" ? Number(num.replace(/,/g, "")) : num;

  const lookup = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];

  const item = lookup.find((item) => Math.abs(normalizedNum) >= item.value);

  if (item) {
    const formattedNum = (normalizedNum / item.value)
      .toFixed(1)
      .replace(/\.0$/, "");
    return `${formattedNum}${item.symbol}`;
  }

  return normalizedNum.toString();
}

export const absoluteUrl = (path: string) => {
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString();
};

export const getCardBgColor = (theme: string | undefined) => {
  const palette = theme === "dark" ? darkCardColors : lightCardColors;
  return palette[Math.floor(Math.random() * palette.length)];
};

export const generateClassroomCode = () => {
  return randomUUID().slice(0, 6);
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export function mapStatus(status: string): "passed" | "failed" | "running" {
  switch (status) {
    case "PASSED":
      return "passed";
    case "PENDING":
      return "running";
    default:
      return "failed";
  }
}

export const exportToCSV = (students: any[]) => {
  if (!students.length) {
    alert("No data available to export.");
    return;
  }

  // Convert JSON to CSV format
  const headers = [
    "ID",
    "Name",
    "Email",
    "Avatar",
    "Status",
    "Submitted At",
    "Score",
    "Questions Completed",
  ];
  const csvRows = [
    headers.join(","), // Add headers
    ...students.map((student) =>
      [
        student.id,
        student.name,
        student.email,
        student.avatar,
        student.status,
        student.submittedAt,
        student.score,
        student.questionsCompleted,
      ].join(","),
    ),
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  // Create a hidden download link
  const a = document.createElement("a");
  a.href = url;
  a.download = "students_submissions.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getRandomEducationIcon = (): string => {
  const educationIcons = [
    "CalculatorIcon",
    "Atom01Icon",
    "TestTubeIcon",
    "Chemistry01Icon",
    "SchoolIcon",
    "UniversityIcon",
    "LibraryIcon",
    "NotebookIcon",
    "UserAccountIcon",
  ];

  const randomIndex = Math.floor(Math.random() * educationIcons.length);
  return educationIcons[randomIndex];
};
