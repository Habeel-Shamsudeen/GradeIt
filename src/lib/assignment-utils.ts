/**
 * Assignment visibility and state utilities.
 * Single source of truth for when students can see assignments.
 */

export interface AssignmentVisibilityInput {
  startDate: Date | null;
  dueDate: Date | null;
  allowLateSubmission: boolean;
}

/**
 * Whether a student can see and access this assignment (list + detail).
 * Faculty always see everything; this is for student view.
 */
export function isAssignmentVisibleToStudent(
  input: AssignmentVisibilityInput,
  now: Date = new Date(),
): boolean {
  const { startDate, dueDate, allowLateSubmission } = input;

  // Not yet started
  if (startDate && now < startDate) {
    return false;
  }

  // Past due and late submission not allowed
  if (!allowLateSubmission && dueDate && now > dueDate) {
    return false;
  }

  return true;
}

/**
 * Whether this assignment is "upcoming" for a student (has a future start date).
 * Used to show preview cards. Faculty may also use this for badges.
 */
export function isAssignmentUpcoming(
  input: { startDate: Date | null },
  now: Date = new Date(),
): boolean {
  return !!input.startDate && now < input.startDate;
}
