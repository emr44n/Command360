import type { StudioContent, StudioBranch } from '@/types/slide'

/**
 * Add a branch to the content. Returns a new StudioContent with the branch
 * appended to the `branches` array.
 */
export function addBranch(
  content: StudioContent,
  branch: StudioBranch
): StudioContent {
  const existing = content.branches ?? []
  return {
    ...content,
    branches: [...existing, branch],
  }
}

/**
 * Remove a branch by ID. Returns a new StudioContent without the branch.
 */
export function removeBranch(
  content: StudioContent,
  branchId: string
): StudioContent {
  if (!content.branches) return content
  return {
    ...content,
    branches: content.branches.filter((b) => b.id !== branchId),
  }
}

/**
 * Evaluate which branches should fire given a source event and condition.
 *
 * For `vote_result` branches the `conditionValue` is matched against the
 * branch's `conditionValue` (the winning option ID). A branch with no
 * `conditionValue` acts as a wildcard and always matches its condition type.
 *
 * Returns the target event IDs (in branch order) that should be triggered.
 */
export function evaluateBranches(
  content: StudioContent,
  sourceEventId: string,
  conditionType: StudioBranch['condition'],
  conditionValue?: string
): string[] {
  if (!content.branches) return []

  return content.branches
    .filter((b) => {
      if (b.sourceEventId !== sourceEventId) return false
      if (b.condition !== conditionType) return false

      // If the branch specifies a conditionValue it must match
      if (b.conditionValue && b.conditionValue !== conditionValue) return false

      return true
    })
    .map((b) => b.targetEventId)
}

/**
 * Get all branches that originate from a specific event.
 */
export function getBranchesForEvent(
  content: StudioContent,
  eventId: string
): StudioBranch[] {
  if (!content.branches) return []
  return content.branches.filter((b) => b.sourceEventId === eventId)
}

/**
 * Get all branches that target a specific event (useful for finding
 * what can lead *into* an event).
 */
export function getBranchesTargetingEvent(
  content: StudioContent,
  eventId: string
): StudioBranch[] {
  if (!content.branches) return []
  return content.branches.filter((b) => b.targetEventId === eventId)
}

/**
 * Update an existing branch by ID. Merges the partial fields into the
 * existing branch. Returns a new StudioContent.
 */
export function updateBranch(
  content: StudioContent,
  branchId: string,
  updates: Partial<Omit<StudioBranch, 'id'>>
): StudioContent {
  if (!content.branches) return content
  return {
    ...content,
    branches: content.branches.map((b) =>
      b.id === branchId ? { ...b, ...updates } : b
    ),
  }
}
