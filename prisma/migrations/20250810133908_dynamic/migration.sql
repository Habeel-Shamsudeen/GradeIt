-- CreateTable
CREATE TABLE "EvaluationMetric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentMetric" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionMetricResult" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionMetricResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionMetricResult_submissionId_metricId_key" ON "SubmissionMetricResult"("submissionId", "metricId");

-- AddForeignKey
ALTER TABLE "EvaluationMetric" ADD CONSTRAINT "EvaluationMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentMetric" ADD CONSTRAINT "AssignmentMetric_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentMetric" ADD CONSTRAINT "AssignmentMetric_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "EvaluationMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionMetricResult" ADD CONSTRAINT "SubmissionMetricResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionMetricResult" ADD CONSTRAINT "SubmissionMetricResult_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "EvaluationMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
