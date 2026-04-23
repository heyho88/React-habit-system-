const BASE = '/images/categories'

const IMAGES: Record<string, string> = {
  body:    `${BASE}/body.webp`,
  health:  `${BASE}/body.webp`,
  sleep:   `${BASE}/sleep.webp`,
  digital: `${BASE}/digital.webp`,
  reading: `${BASE}/reading.webp`,
  mental:  `${BASE}/mental.webp`,
  routine: `${BASE}/routine.webp`,
  space:   `${BASE}/routine.webp`,
  morning: `${BASE}/morning.webp`,
  evening: `${BASE}/evening.webp`,
}

export function getCategoryImage(id: string | null | undefined): string | null {
  if (!id) return null
  return IMAGES[id] ?? null
}
