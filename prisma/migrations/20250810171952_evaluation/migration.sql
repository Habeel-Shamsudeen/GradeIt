/*
  Warnings:

  - You are about to drop the column `config` on the `AssignmentMetric` table. All the data in the column will be lost.
  - You are about to drop the column `plagiarismScore` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `isBonus` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `TestCase` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'TEST_CASES_EVALUATION_COMPLETE', 'EVALUATION_COMPLETE');

-- AlterTable
ALTER TABLE "AssignmentMetric" DROP COLUMN "config";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "plagiarismScore",
ADD COLUMN     "evaluationStatus" "EvaluationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "isBonus",
DROP COLUMN "weight";
