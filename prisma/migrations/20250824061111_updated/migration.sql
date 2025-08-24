/*
  Warnings:

  - You are about to drop the column `submissionId` on the `SubmissionMetricResult` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `TestCaseResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codeSubmissionId,metricId]` on the table `SubmissionMetricResult` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codeSubmissionId,testCaseId]` on the table `TestCaseResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codeSubmissionId` to the `SubmissionMetricResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codeSubmissionId` to the `TestCaseResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubmissionMetricResult" DROP CONSTRAINT "SubmissionMetricResult_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "TestCaseResult" DROP CONSTRAINT "TestCaseResult_submissionId_fkey";

-- DropIndex
DROP INDEX "SubmissionMetricResult_submissionId_metricId_key";

-- DropIndex
DROP INDEX "TestCaseResult_submissionId_testCaseId_key";

-- AlterTable
ALTER TABLE "CodeSubmission" ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "testCaseScore" SET DEFAULT 0,
ALTER COLUMN "metricScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "finalScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "SubmissionMetricResult" DROP COLUMN "submissionId",
ADD COLUMN     "codeSubmissionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "submissionId",
ADD COLUMN     "codeSubmissionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionMetricResult_codeSubmissionId_metricId_key" ON "SubmissionMetricResult"("codeSubmissionId", "metricId");

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseResult_codeSubmissionId_testCaseId_key" ON "TestCaseResult"("codeSubmissionId", "testCaseId");

-- AddForeignKey
ALTER TABLE "SubmissionMetricResult" ADD CONSTRAINT "SubmissionMetricResult_codeSubmissionId_fkey" FOREIGN KEY ("codeSubmissionId") REFERENCES "CodeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseResult" ADD CONSTRAINT "TestCaseResult_codeSubmissionId_fkey" FOREIGN KEY ("codeSubmissionId") REFERENCES "CodeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
