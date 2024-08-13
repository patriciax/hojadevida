import type { CvEvent, CvEventReference } from '~/types/cvfy'

export function orderEvents(arr: CvEvent[]): CvEvent[] {
  return [...arr].sort(
    (a, b) => new Date(b.from).getTime() - new Date(a.from).getTime(),
  )
}

export function orderEventsREF(arr: CvEventReference[]): CvEventReference[] {
  return [...arr]
}
