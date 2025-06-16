export interface NavGroupInterface {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export interface WebhookPayload {
  submissionId: string;
  testCaseId: string;
  questionId: string;
}
