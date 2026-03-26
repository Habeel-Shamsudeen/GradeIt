import type { ComponentType } from "react";
import type { QuestionRendererProps } from "./types";
import type { QuestionType } from "@/lib/types/assignment-tyes";
import { MCQRenderer } from "./mcq-renderer";
import { MatchRenderer } from "./match-renderer";
import { FillBlanksRenderer } from "./fill-blanks-renderer";
import { OpenEndedRenderer } from "./open-ended-renderer";
import { BlockDiagramRenderer } from "./block-diagram-renderer";
import { CaseStudyRenderer } from "./case-study-renderer";

export type { QuestionRendererProps } from "./types";

const rendererRegistry: Partial<
  Record<QuestionType, ComponentType<QuestionRendererProps>>
> = {
  MCQ: MCQRenderer,
  MATCH_FOLLOWING: MatchRenderer,
  FILL_BLANKS: FillBlanksRenderer,
  OPEN_ENDED: OpenEndedRenderer,
  BLOCK_DIAGRAM: BlockDiagramRenderer,
  CASE_STUDY: CaseStudyRenderer,
  CHAIN_QUESTION: OpenEndedRenderer,
};

export function getQuestionRenderer(
  type: QuestionType,
): ComponentType<QuestionRendererProps> | null {
  return rendererRegistry[type] ?? null;
}

const CODING_TYPES: QuestionType[] = ["CODING", "CODE_DEBUG", "CODE_FILL"];

export function isCodingQuestionType(type?: QuestionType): boolean {
  return CODING_TYPES.includes(type ?? "CODING");
}
