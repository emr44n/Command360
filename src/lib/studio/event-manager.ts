import type { StudioContent, StudioTimelineEvent } from '@/types/slide'

/**
 * Look up a single timeline event by ID.
 */
export function getEventById(
  content: StudioContent,
  eventId: string
): StudioTimelineEvent | undefined {
  return content.timelineEvents?.find((e) => e.id === eventId)
}

/**
 * Return all timeline events belonging to a specific category.
 */
export function getEventsInCategory(
  content: StudioContent,
  categoryId: string
): StudioTimelineEvent[] {
  if (!content.timelineEvents) return []
  return content.timelineEvents.filter((e) => e.categoryId === categoryId)
}

/**
 * Return all timeline events that have no category assigned.
 */
export function getUncategorisedEvents(
  content: StudioContent
): StudioTimelineEvent[] {
  if (!content.timelineEvents) return []
  return content.timelineEvents.filter(
    (e) => e.categoryId === undefined || e.categoryId === null
  )
}
