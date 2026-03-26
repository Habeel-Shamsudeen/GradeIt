-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "metricsWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "testCaseWeight" DOUBLE PRECISION NOT NULL DEFAULT 100.0;

-- CreateTable
CREATE TABLE "QuestionMetric" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionMetric_questionId_metricId_key" ON "QuestionMetric"("questionId", "metricId");

-- AddForeignKey
ALTER TABLE "QuestionMetric" ADD CONSTRAINT "QuestionMetric_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionMetric" ADD CONSTRAINT "QuestionMetric_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "EvaluationMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
