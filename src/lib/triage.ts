// ── TRIAGE LOGIC (single swap-point) ────────────────────────────────────
// The entire triage behavior lives behind `runTriage`. Today it is a simple
// client-side keyword match over the illustrative sample data. Later phases
// can replace THIS FUNCTION with a real AI-backed endpoint (which will need a
// backend host — GitHub Pages serves static files only). If/when that swap
// makes it async, update the single caller to await it.

import { DOMAINS, STATES } from '../data/jurisdictions'
import type { DomainKey } from '../data/jurisdictions'

// Common words dropped before matching so "the app" / "for a new launch" don't
// score against every flag.
const STOP = new Set([
  'the', 'and', 'for', 'with', 'new', 'can', 'are', 'our', 'you', 'your', 'from',
  'that', 'this', 'into', 'app', 'launch', 'question', 'about', 'would', 'could',
  'should', 'when', 'where', 'what', 'how', 'who', 'why', 'a', 'an', 'of', 'to',
  'in', 'on', 'is', 'it', 'we', 'be', 'or', 'at', 'as', 'by', 'my', 'me', 'do',
  'does',
])

export interface TriageHit {
  code: string
  name: string
  domain: DomainKey
  note: string
  /** Number of query tokens matched in (domain label + note + state name). */
  score: number
}

export interface TriageResult {
  hits: TriageHit[]
  /** Best-guess specialist domain to route to, if one is inferable. */
  primary: DomainKey | null
  /** True when the query was non-empty but every token was a stopword. */
  thin: boolean
}

/**
 * Match a free-text launch question against the sample jurisdiction data.
 * Returns null for an empty query, a `thin` result when only stopwords remain,
 * otherwise scored hits (capped at 6) ranked by keyword-match strength.
 */
export function runTriage(query: string): TriageResult | null {
  if (!query.trim()) return null

  const words = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
  if (!words.length) return { hits: [], primary: null, thin: true }

  const hits: TriageHit[] = []
  Object.entries(STATES).forEach(([code, s]) => {
    s.flags.forEach((f) => {
      const dm = DOMAINS[f.d]
      const hay = `${dm.label} ${f.note} ${s.name}`.toLowerCase()
      let score = 0
      words.forEach((w) => {
        if (hay.includes(w)) score++
      })
      if (score > 0) hits.push({ code, name: s.name, domain: f.d, note: f.note, score })
    })
  })
  hits.sort((a, b) => b.score - a.score)

  // Primary domain: a token matching the domain key or label scores +2; each
  // domain also accrues 0.3 × the total hit-score it contributed.
  let primary: DomainKey | null = null
  let best = 0
  ;(Object.keys(DOMAINS) as DomainKey[]).forEach((d) => {
    const label = DOMAINS[d].label.toLowerCase()
    let sc = 0
    words.forEach((w) => {
      if (d.includes(w) || label.includes(w)) sc += 2
    })
    sc += hits.filter((h) => h.domain === d).reduce((acc, h) => acc + h.score, 0) * 0.3
    if (sc > best) {
      best = sc
      primary = d
    }
  })

  return { hits: hits.slice(0, 6), primary, thin: false }
}
