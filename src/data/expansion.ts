// ── ILLUSTRATIVE SAMPLE DATA (EXPANSION / "GLOBAL" VIEW) ─────────────────
// Strategic expansion-readiness content — NOT current operations and NOT legal
// advice. Illustrative sample material framing hypothetical future scope, for a
// prototype demo. Requires attorney verification.

export interface ExpansionRegion {
  region: string
  regimes: string[]
  note: string
}

export const EXPANSION_REGIONS: ExpansionRegion[] = [
  {
    region: 'European Union',
    regimes: ['GDPR — data protection & transfer'],
    note: 'Cited in the role brief. The foundational gate for any EU entry: consent UX, data residency, cross-border transfer.',
  },
  {
    region: 'EU — Financial / Operational',
    regimes: ['DORA — operational resilience', 'NIS2 — network & info security'],
    note: 'Data-sovereignty & security-resilience duties. Where forward-looking cryptographic-risk analysis (my differentiator) becomes directly relevant.',
  },
  {
    region: 'United Kingdom',
    regimes: ['UK GDPR', 'NCSC guidance'],
    note: 'Post-Brexit divergence; distinct security-posture expectations.',
  },
  {
    region: 'Canada (current)',
    regimes: ['PIPEDA', 'Quebec Law 25', 'Provincial privacy'],
    note: 'Already live. Provincial variation + Quebec French-language & privacy rules add real cross-border complexity today.',
  },
]
