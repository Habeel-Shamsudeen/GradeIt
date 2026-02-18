/*
  Warnings:

  - Made the column `startDate` on table `Assignment` required. This step will fail if there are existing NULL values in that column.


*/
-- Backfill NULL startDate so ALTER COLUMN ... SET NOT NULL can succeed
UPDATE "Assignment"
SET "startDate" = COALESCE("startDate", "createdAt", NOW())
WHERE "startDate" IS NULL;

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "metricsWeight" SET DEFAULT 0.0,
ALTER COLUMN "testCaseWeight" SET DEFAULT 100.0;
