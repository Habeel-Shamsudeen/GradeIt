-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CODING', 'MCQ', 'MATCH_FOLLOWING', 'FILL_BLANKS', 'OPEN_ENDED', 'CASE_STUDY', 'CHAIN_QUESTION', 'BLOCK_DIAGRAM', 'CODE_DEBUG', 'CODE_FILL');

-- CreateEnum
CREATE TYPE "AnswerEvaluationStatus" AS ENUM ('PENDING', 'AUTO_EVALUATED', 'LLM_EVALUATION_IN_PROGRESS', 'LLM_EVALUATION_FAILED', 'EVALUATION_COMPLETE', 'MANUAL_REVIEW_REQUIRED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "answerKey" JSONB,
ADD COLUMN     "content" JSONB,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parentQuestionId" TEXT,
ADD COLUMN     "points" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "sectionId" TEXT,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'CODING',
ALTER COLUMN "language" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "feedback" TEXT,
    "evaluationStatus" "AnswerEvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answer_submissionId_questionId_key" ON "Answer"("submissionId", "questionId");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parentQuestionId_fkey" FOREIGN KEY ("parentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
