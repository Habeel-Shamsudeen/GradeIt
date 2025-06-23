export interface TestResults {
  description: string;
  passed: boolean;
  isBonus: boolean;
  executionTime: number | null;
  error: string | null;
}

export interface judgeResult {
  stdout: string;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}

export interface CodeRunner {
  input: string;
  runtime: string;
  memory: string;
  status: string;
  output: string;
  error: string;
  hidden: boolean;
}
