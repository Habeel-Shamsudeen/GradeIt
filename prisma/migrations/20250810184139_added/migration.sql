/*
  Warnings:

  - Added the required column `assignmentId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EvaluationStatus" ADD VALUE 'TEST_CASES_EVALUATION_FAILED';
ALTER TYPE "EvaluationStatus" ADD VALUE 'LLM_EVALUATION_IN_PROGRESS';
ALTER TYPE "EvaluationStatus" ADD VALUE 'LLM_EVALUATION_FAILED';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
