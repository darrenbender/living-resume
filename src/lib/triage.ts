// ── TRIAGE LOGIC (single swap-point) ────────────────────────────────────
// The entire triage behavior lives behind `runTriage`. Today it is a simple
// client-side keyword match over the illustrative sample data. Later phases
// can replace THIS FUNCTION with a real AI-backed endpoint (which will need a
// backend host — GitHub Pages serves static files only). If/when that swap
// makes it async, update the single caller to await it.

import { DOMAINS, STATES } from '../data/jurisdictions'
import type { DomainKey } from '../data/jurisdictions'

export interface TriageHit {
  code: string
  name: string
  domain: DomainKey
  note: string
}

export interface TriageResult {
  hits: TriageHit[]
  /** Best-guess specialist domain to route to, if one is inferable. */
  primary: DomainKey | null
}

/**
 * Match a free-text launch question against the sample jurisdiction data.
 * Returns null for an empty query. Result is capped at 6 hits.
 */
export function runTriage(query: string): TriageResult | null {
  if (!query.trim()) return null
  const q = query.toLowerCase()
  const hits: TriageHit[] = []

  Object.entries(STATES).forEach(([code, s]) => {
    s.flags.forEach((f) => {
      const dm = DOMAINS[f.d]
      if (
        q.split(' ').some(
          (w) =>
            w.length > 2 &&
            (dm.label.toLowerCase().includes(w) ||
              f.note.toLowerCase().includes(w) ||
              s.name.toLowerCase().includes(w)),
        )
      ) {
        hits.push({ code, name: s.name, domain: f.d, note: f.note })
      }
    })
  })

  // Guess the primary specialist domain from the query text.
  let primary: DomainKey | null = null
  ;(Object.keys(DOMAINS) as DomainKey[]).forEach((d) => {
    if (
      q.includes(d) ||
      DOMAINS[d].label
        .toLowerCase()
        .split(' ')
        .some((w) => q.includes(w))
    ) {
      primary = d
    }
  })

  return { hits: hits.slice(0, 6), primary }
}
