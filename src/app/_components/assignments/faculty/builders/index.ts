import type { ComponentType } from "react";
import type { QuestionBuilderProps } from "./types";
import type { QuestionType } from "@/lib/types/assignment-tyes";
import { MCQBuilder } from "./mcq-builder";
import { MatchBuilder } from "./match-builder";
import { FillBlanksBuilder } from "./fill-blanks-builder";
import { OpenEndedBuilder } from "./open-ended-builder";

export type { QuestionBuilderProps } from "./types";
export { DEFAULT_QUESTION_BY_TYPE } from "./types";

const builderRegistry: Partial<
  Record<QuestionType, ComponentType<QuestionBuilderProps>>
> = {
  MCQ: MCQBuilder,
  MATCH_FOLLOWING: MatchBuilder,
  FILL_BLANKS: FillBlanksBuilder,
  OPEN_ENDED: OpenEndedBuilder,
  // CODING, CODE_DEBUG, CODE_FILL use the existing QuestionForm
  // CASE_STUDY, CHAIN_QUESTION, BLOCK_DIAGRAM use OpenEndedBuilder as fallback for now
  CASE_STUDY: OpenEndedBuilder,
  CHAIN_QUESTION: OpenEndedBuilder,
  BLOCK_DIAGRAM: OpenEndedBuilder,
};

export function getQuestionBuilder(
  type: QuestionType,
): ComponentType<QuestionBuilderProps> | null {
  return builderRegistry[type] ?? null;
}

const CODING_TYPES: QuestionType[] = ["CODING", "CODE_DEBUG", "CODE_FILL"];

export function isCodingBuilderType(type?: QuestionType): boolean {
  return CODING_TYPES.includes(type ?? "CODING");
}
