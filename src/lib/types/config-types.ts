export interface NavGroupInterface {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export interface WebhookPayload {
  codeSubmissionId: string;
  testCaseId: string;
  questionId: string;
}

export enum Language {
  Assembly = "Assembly",
  Bash = "Bash",
  C = "C",
  "C++" = "C++",
  Go = "Go",
  Java = "Java",
  JavaScript = "JavaScript",
  TypeScript = "TypeScript",
  Rust = "Rust",
  Python = "Python",
  "Python for ML" = "Python for ML",
}
