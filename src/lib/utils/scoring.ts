/**
 * Calculate quiz score based on time taken.
 * Full points for instant answer, half points for last-second answer.
 */
export function calculateQuizScore(
  timeLimitSeconds: number,
  timeTakenMs: number,
  maxPoints: number = 1000
): number {
  const timeLimitMs = timeLimitSeconds * 1000
  const clampedTime = Math.min(timeTakenMs, timeLimitMs)
  const timeRatio = 1 - clampedTime / timeLimitMs
  // Score ranges from 50% to 100% of max points based on speed
  const score = Math.round(maxPoints * (0.5 + 0.5 * timeRatio))
  return Math.max(0, score)
}
