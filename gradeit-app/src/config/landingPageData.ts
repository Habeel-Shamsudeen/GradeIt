"use client";
import {
  Code,
  CheckCircle,
  Users,
  Shield,
  BookOpen,
  FileCode,
  CheckSquare,
  Sparkles,
} from "lucide-react";
export const featureCards = [
  {
    icon: Code,
    title: "Integrated Code Editor",
    description:
      "A powerful editor with syntax highlighting and intelligent auto-completion for a seamless coding experience.",
  },
  {
    icon: CheckCircle,
    title: "Automated Grading",
    description:
      "Execute test cases and provide real-time feedback to students with detailed insights.",
  },
  {
    icon: Users,
    title: "Live Collaboration",
    description:
      "Track student progress in real-time with interactive monitoring tools.",
  },
  {
    icon: Shield,
    title: "Secure Environment",
    description:
      "Role-based access control with a robust backend for data security and privacy.",
  },
  {
    icon: Sparkles,
    title: "Plagiarism Detection",
    description:
      "Automatically detect code similarities between student submissions.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Analytics",
    description:
      "Gain insights into student performance and identify areas for improvement.",
  },
];

// Educator feature data
export const educatorFeatures = [
  {
    icon: FileCode,
    title: "Question Management",
    description:
      "Upload coding questions with multiple languages, problem statements, and test cases.",
  },
  {
    icon: Users,
    title: "Live Monitoring",
    description:
      "View real-time progress of students and access each student's editor instance.",
  },
  {
    icon: CheckSquare,
    title: "Automated Testing",
    description:
      "Evaluate solutions based on correctness, performance, and edge cases.",
  },
];

// Student feature data
export const studentFeatures = [
  {
    icon: Code,
    title: "Interactive Code Editor",
    description:
      "Integrated editor with real-time syntax highlighting and language-specific linting.",
  },
  {
    icon: CheckCircle,
    title: "Instant Feedback",
    description:
      "Test code with sample cases and view submission status immediately.",
  },
  {
    icon: Shield,
    title: "Restriction Notifications",
    description:
      "Clear messages when attempting restricted actions like pasting or right-clicking.",
  },
];

export const educatorSteps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Create a Classroom",
    description:
      "Set up your virtual classroom in minutes with customizable settings.",
  },
  {
    number: "02",
    icon: FileCode,
    title: "Assign Problems",
    description:
      "Create or import coding assignments with test cases and instructions.",
  },
  {
    number: "03",
    icon: CheckSquare,
    title: "Monitor & Grade",
    description:
      "Track student progress in real-time and review auto-graded submissions.",
  },
];

export const studentSteps = [
  {
    number: "01",
    icon: Users,
    title: "Join a Class",
    description:
      "Enter a class code or accept an invitation to join your instructor's classroom.",
  },
  {
    number: "02",
    icon: Code,
    title: "Solve Problems",
    description:
      "Write and test your code in our powerful integrated development environment.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Get Feedback",
    description:
      "Receive immediate feedback on your code with detailed explanations.",
  },
];

// Stats data
export const stats = [
  { value: "500+", label: "Educational Institutions" },
  { value: "50,000+", label: "Active Students" },
  { value: "1M+", label: "Assignments Completed" },
  { value: "20+", label: "Programming Languages" },
];
