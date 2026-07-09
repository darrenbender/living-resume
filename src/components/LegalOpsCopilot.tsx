import { useState, useMemo, useEffect, createElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Info,
  X,
  Scale,
  Globe,
  Map as MapIcon,
  ListChecks,
  User,
  MousePointerClick,
} from 'lucide-react'
import { DOMAINS, STATES, TIER, ANTICIPATED } from '../data/jurisdictions'
import type { Domain, DomainKey, StateInfo, TierInfo, AnticipatedMarket } from '../data/jurisdictions'
import { RESEARCH } from '../data/research'
import { runTriage } from '../lib/triage'
import { ACCENT, ACCENT_DARK, INK } from '../theme'
import FootprintMap from './FootprintMap'
import ProductWorkstream from './ProductWorkstream'
import ExpansionView from './ExpansionView'
import ResearchLibrary from './ResearchLibrary'
import ResumeSection from './ResumeSection'

const NAV = [
  { id: 'footprint', label: 'Current Locations', Icon: MapIcon },
  { id: 'workstream', label: 'Product Workstream', Icon: ListChecks },
  { id: 'expansion', label: 'Expansion Horizon', Icon: Globe },
  { id: 'research', label: 'Law Library', Icon: Scale },
  { id: 'resume', label: 'Résumé', Icon: User },
] as const

// Clears the sticky header when an anchor is scrolled to; matches the
// IntersectionObserver rootMargin below.
const SCROLL_MARGIN = 132

// Law Library entry per domain (ids match domain keys for the 6 domains).
const RES_BY_ID: Record<string, (typeof RESEARCH)[number]> = {}
RESEARCH.forEach((r) => {
  RES_BY_ID[r.id] = r
})

const tierChipStyle = (on: boolean, t: TierInfo): CSSProperties => ({
  fontSize: 11.5,
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: 20,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  border: `1px solid ${on ? ACCENT_DARK : t.color + '55'}`,
  background: on ? ACCENT : t.bg,
  color: on ? 'white' : t.color,
})

const antChipStyle = (on: boolean): CSSProperties => ({
  fontSize: 11.5,
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: 20,
  cursor: 'pointer',
  border: `1px solid ${on ? '#4338ca' : '#c7d2fe'}`,
  background: on ? '#4338ca' : '#eef2ff',
  color: on ? 'white' : '#4338ca',
})

function SectionHead({
  num,
  numColor,
  title,
  extra,
  divider,
  first = false,
}: {
  num: string
  numColor: string
  title: string
  extra?: ReactNode
  divider: string
  first?: boolean
}) {
  return (
    <div
      style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: first ? '26px 20px 4px' : '30px 20px 4px',
        borderTop: first ? undefined : '1px solid #e2e8f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', paddingTop: first ? 0 : 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: numColor }}>{num}</span>
        <span style={{ fontSize: 20, fontWeight: 700 }}>{title}</span>
        {extra}
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${divider}, transparent)`, marginTop: 12 }} />
    </div>
  )
}

export default function LegalOpsCopilot() {
  const [selected, setSelected] = useState<string>('CA')
  const [query, setQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState<DomainKey | null>(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [routed, setRouted] = useState<DomainKey | null>(null)
  const [activeSection, setActiveSection] = useState('footprint')
  const [hintDismissed, setHintDismissed] = useState(false)
  const [hoveredFlag, setHoveredFlag] = useState<number | null>(null)

  const st: StateInfo | undefined = STATES[selected]
  const ant: AnticipatedMarket | undefined = ANTICIPATED[selected]
  const isAnticipated = !!ant
  const tier: TierInfo | null = st ? TIER[st.tier] : null

  // Triage is isolated behind runTriage() — swap that for an AI endpoint later.
  const triage = useMemo(() => runTriage(query), [query])

  const select = (code: string) => {
    setSelected(code)
    setDomainFilter(null)
    setRouted(null)
    setHintDismissed(true)
  }

  const markSeen = () => {
    try {
      localStorage.setItem('pc_seen_welcome', '1')
    } catch {
      /* ignore */
    }
  }
  const closeModal = () => {
    markSeen()
    setShowAbout(false)
    setShowWelcome(false)
  }

  // Welcome panel on first visit only (per browser).
  useEffect(() => {
    try {
      if (!localStorage.getItem('pc_seen_welcome')) setShowWelcome(true)
    } catch {
      /* ignore */
    }
  }, [])

  // Scroll-spy: highlight the nav item for whichever section is in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length) setActiveSection(visible[0].target.id)
      },
      { rootMargin: `-${SCROLL_MARGIN}px 0px -55% 0px`, threshold: 0 },
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const visibleFlags =
    !isAnticipated && st ? (domainFilter ? st.flags.filter((f) => f.d === domainFilter) : st.flags) : []

  const routeBrief = () => {
    setRouted(visibleFlags[0]?.d ?? null)
    try {
      window.location.hash = 'resume'
    } catch {
      /* ignore */
    }
  }

  // Brief header — current jurisdiction vs anticipated market
  const briefName = isAnticipated ? ant!.name : st ? st.name : ''
  const briefSubtitle = isAnticipated ? 'Anticipated market · expansion readiness' : 'Sample issue-spot brief'
  const badgeText = isAnticipated ? 'Anticipated' : tier ? `${tier.label} risk` : ''
  const badgeColor = isAnticipated ? '#4338ca' : tier ? tier.color : '#64748b'
  const badgeBg = isAnticipated ? '#eef2ff' : tier ? tier.bg : '#f1f5f9'
  const badgeBorder = isAnticipated ? '#c7d2fe' : tier ? tier.color + '44' : '#e2e8f0'

  const isWelcome = showWelcome && !showAbout
  const modalTitle = isWelcome ? 'Welcome to the Product Counsel demo' : "How this works — and what it won't do"

  const usCodes = Object.keys(STATES).filter((c) => STATES[c].country !== 'CA')

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, Arial", background: "#f8fafc", minHeight: "100%", color: INK }}>
      {/* Frozen header + nav */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: INK, color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Scale size={22} color={ACCENT} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Product Counsel — Concept Demo</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>A visual extension of my résumé · illustrative concept, not a finished tool</div>
            </div>
          </div>
          <button onClick={() => setShowAbout(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13 }}>
            <Info size={15} /> How this works / limits
          </button>
        </div>
        {/* section nav (scroll-spy, underline style) */}
        <nav style={{ display: "flex", gap: 22, padding: "0 20px 10px", flexWrap: "wrap", justifyContent: "center" }}>
          {NAV.map(({ id, label, Icon }) => {
            const on = activeSection === id
            return (
              <a
                key={id}
                href={"#" + id}
                aria-current={on ? "true" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
                  padding: "6px 2px 7px", textDecoration: "none",
                  color: on ? "white" : "#cbd5e1",
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid " + (on ? ACCENT : "transparent"),
                  borderRadius: 0,
                  transition: "color .15s, border-color .15s",
                }}
              >
                <Icon size={13} /> {label}
              </a>
            )
          })}
        </nav>
      </header>

      {/* Disclaimer banner */}
      <div style={{ background: "#fef3c7", borderBottom: "1px solid #fde68a", padding: "8px 20px", fontSize: 12.5, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
        <AlertTriangle size={15} />
        <span><strong>Prototype — illustrative sample content only.</strong> Not legal advice, not authoritative. Every output is a draft issue-spot for a human attorney to review.</span>
      </div>

      {/* ===== SECTION 01: Current Locations ===== */}
      <section id="footprint" style={{ scrollMarginTop: SCROLL_MARGIN }}>
        <SectionHead
          first
          num="01 · LOCATIONS"
          numColor={ACCENT}
          title="Current Locations"
          divider="#cbd5e1"
          extra={<span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>· current footprint & anticipated expansion</span>}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, padding: "16px 20px 20px", alignItems: "flex-start" }}>
          {/* Left: triage + locations selector + brief */}
          <div style={{ flex: "1 1 380px", minWidth: 320 }}>
            {/* Triage search */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Ask a product-launch question</div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "2px 7px", borderRadius: 10 }}>KEYWORD TRIAGE · SAMPLE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 8, padding: "8px 12px" }}>
                <Search size={16} color="#64748b" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Product-launch triage question"
                  placeholder="e.g. 'alcohol delivery in Pennsylvania' or 'privacy for a new health vertical'"
                  style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontSize: 13.5, color: "#0f172a" }}
                />
                {query && <X size={15} color="#94a3b8" style={{ cursor: "pointer" }} onClick={() => setQuery("")} />}
              </div>

              {triage && (
                <div style={{ marginTop: 12, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                  {triage.primary && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 10px", borderRadius: 8, background: DOMAINS[triage.primary].color + "12" }}>
                      {createElement(DOMAINS[triage.primary].icon, { size: 16, color: DOMAINS[triage.primary].color })}
                      <span style={{ fontSize: 13 }}>Likely specialist: <strong>{DOMAINS[triage.primary].label}</strong></span>
                      <button onClick={() => setRouted(triage.primary)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DOMAINS[triage.primary].color, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                        Route <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Related sample flags, ranked by match:</div>
                  {triage.thin && <div style={{ fontSize: 13, color: "#94a3b8" }}>Add a specific term — a legal domain (e.g. privacy, alcohol) or a jurisdiction (e.g. California).</div>}
                  {!triage.thin && triage.hits.length === 0 && <div style={{ fontSize: 13, color: "#94a3b8" }}>No sample matches — a human attorney would scope this manually.</div>}
                  {triage.hits.map((h, i) => (
                    <div key={i} style={{ fontSize: 12.5, padding: "6px 0", borderBottom: "1px solid #f8fafc", display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontWeight: 700, minWidth: 34, color: DOMAINS[h.domain].color }}>{h.code}</span>
                      <span style={{ color: "#475569", flex: 1 }}>{h.note}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", background: "#f8fafc", border: "1px solid #eef2f6", borderRadius: 8, padding: "1px 6px" }} title="keyword match strength">×{h.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Locations selector */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 14 }}>Pick a location for its sample brief.</div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: ACCENT }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#64748b" }}>CURRENT FOOTPRINT</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: ACCENT_DARK, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1px 7px", borderRadius: 10 }}>live</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", margin: "0 0 6px 2px" }}>United States</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 11 }}>
                  {usCodes.map((c) => {
                    const s = STATES[c]
                    const t = TIER[s.tier]
                    const on = selected === c
                    return (
                      <button key={c} onClick={() => select(c)} aria-pressed={on} aria-label={`${s.name}, ${t.label} risk, ${s.flags.length} sample flags`} style={tierChipStyle(on, t)}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: on ? "#ffffff" : t.color }} />{s.name}
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", margin: "0 0 6px 2px" }}>Canada</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["QC", "ON"].map((c) => {
                    const s = STATES[c]
                    const t = TIER[s.tier]
                    const on = selected === c
                    const label = s.name.replace(" (Canada)", "")
                    return (
                      <button key={c} onClick={() => select(c)} aria-pressed={on} aria-label={`${label}, ${t.label} risk, ${s.flags.length} sample flags`} style={tierChipStyle(on, t)}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: on ? "#ffffff" : t.color }} />{label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: "#4338ca" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#64748b" }}>ANTICIPATED EXPANSION</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#4338ca", background: "#eef2ff", border: "1px solid #c7d2fe", padding: "1px 7px", borderRadius: 10 }}>NOT CURRENT</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.keys(ANTICIPATED).map((c) => {
                    const on = selected === c
                    return (
                      <button key={c} onClick={() => select(c)} aria-pressed={on} aria-label={`${ANTICIPATED[c].name}, anticipated market`} style={antChipStyle(on)}>{ANTICIPATED[c].name}</button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Brief panel */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginTop: 16 }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{briefName}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{briefSubtitle}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 20, whiteSpace: "nowrap", color: badgeColor, background: badgeBg, border: "1px solid " + badgeBorder }}>{badgeText}</div>
              </div>

              {!isAnticipated && (
                <>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "12px 18px 4px" }}>
                    <button onClick={() => setDomainFilter(null)} aria-label="Show all domains" aria-pressed={domainFilter === null} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 20, cursor: "pointer", border: "1px solid #e2e8f0", background: domainFilter === null ? ACCENT : "white", color: domainFilter === null ? "white" : "#475569" }}>All</button>
                    {(Object.entries(DOMAINS) as [DomainKey, Domain][]).map(([k, v]) => {
                      const on = domainFilter === k
                      return (
                        <button key={k} onClick={() => setDomainFilter(k)} aria-label={"Filter by " + v.label} aria-pressed={on} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, border: "1px solid " + v.color + "44", background: on ? v.color : v.color + "10", color: on ? "white" : v.color }}>
                          {createElement(v.icon, { size: 12 })} {v.label}
                        </button>
                      )
                    })}
                  </div>

                  <div style={{ padding: "8px 18px 18px" }}>
                    {visibleFlags.map((f, i) => {
                      const dm = DOMAINS[f.d]
                      const res = RES_BY_ID[f.d]
                      const showPop = hoveredFlag === i && !!res
                      return (
                        <div key={i} onMouseEnter={() => setHoveredFlag(i)} onMouseLeave={() => setHoveredFlag(null)} style={{ position: "relative", display: "flex", gap: 10, padding: "12px 0", borderBottom: i < visibleFlags.length - 1 ? "1px solid #f8fafc" : undefined }}>
                          <div style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: dm.color + "14" }}>
                            {createElement(dm.icon, { size: 16, color: dm.color })}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 600, color: dm.color }}>{dm.label}</span>
                              <Scale size={11} style={{ color: "#cbd5e1" }} aria-hidden="true" />
                            </div>
                            <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.45 }}>{f.note}</div>
                          </div>
                          {showPop && res && (
                            <div style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: 2, zIndex: 20, background: "white", border: "1px solid " + res.color + "44", borderRadius: 10, boxShadow: "0 10px 28px rgba(15,23,42,.16)", padding: "12px 14px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7, flexWrap: "wrap" }}>
                                <Scale size={13} style={{ color: res.color }} />
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: "#94a3b8" }}>LAW LIBRARY</span>
                                <span style={{ fontSize: 12.5, fontWeight: 700, color: res.color }}>{res.title}</span>
                              </div>
                              <ul style={{ margin: "0 0 6px", paddingLeft: 16 }}>
                                {res.issues.slice(0, 3).map((iss, j) => (
                                  <li key={j} style={{ fontSize: 11.5, color: "#475569", lineHeight: 1.45, marginBottom: 4 }}>{iss}</li>
                                ))}
                              </ul>
                              <a href="#research" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: res.color, textDecoration: "none" }}>View in Law Library <ArrowRight size={11} /></a>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    <button onClick={routeBrief} style={{ marginTop: 14, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: ACCENT, color: "white", border: "none", borderRadius: 9, padding: 11, cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}>
                      Route to specialist for confirmation <ArrowRight size={15} />
                    </button>

                    {routed && (
                      <div style={{ marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "12px 14px", fontSize: 12.5, color: "#166534", display: "flex", gap: 8 }}>
                        <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>Draft issue-spot routed to <strong>{DOMAINS[routed]?.label || "specialist"}</strong> counsel. In production this creates a ticket + attaches the preliminary brief for human review before any advice is finalized.</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {isAnticipated && ant && (
                <div style={{ padding: "14px 18px 18px" }}>
                  <div style={{ background: "#eef2ff", border: "1px dashed #a5b4fc", borderRadius: 9, padding: "10px 12px", fontSize: 12, color: "#3730a3", display: "flex", gap: 8, marginBottom: 14 }}>
                    <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>Strategic readiness, not a current market — regimes that would activate on expansion. Illustrative; requires attorney verification.</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#94a3b8", marginBottom: 8 }}>REGIMES THAT WOULD ACTIVATE</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {ant.regimes.map((rg, j) => (
                      <span key={j} style={{ fontSize: 12, fontWeight: 600, color: "#4338ca", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 20, padding: "3px 10px" }}>{rg}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55, marginBottom: 16 }}>{ant.note}</div>
                  <a href="#expansion" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#4338ca", textDecoration: "none", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 9, padding: "10px 14px" }}>See Expansion Horizon <ArrowRight size={14} /></a>
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, lineHeight: 1.5 }}>
              Human-in-the-loop by design: the tool drafts and routes; it never delivers final legal advice. Sample data is illustrative and public-information-based.
            </div>
          </div>

          {/* Right: geographic map (supporting visual) */}
          <div style={{ flex: "1 1 420px", minWidth: 320, position: "sticky", top: 148 }}>
            <div style={{ position: "relative", background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <MapIcon size={15} color="#94a3b8" />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#475569" }}>Current footprint · geographic view</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>Click a shaded jurisdiction, or use the chips above. UK & EU are anticipated markets, not on this map.</span>
              </div>
              {!hintDismissed && (
                <div className="sc-pulse" style={{ position: "absolute", top: 58, left: "50%", transform: "translateX(-50%)", zIndex: 5, display: "flex", alignItems: "center", gap: 7, background: "#0f172a", color: "white", fontSize: 12, fontWeight: 600, padding: "7px 13px", borderRadius: 999, animation: "scpulse 2s ease-out infinite", pointerEvents: "none" }}>
                  <MousePointerClick size={14} style={{ color: ACCENT }} /> Pick a jurisdiction
                </div>
              )}
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <FootprintMap selected={selected} onSelect={select} />
              </div>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                {Object.values(TIER).map((v) => (
                  <div key={v.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: v.bg, border: "1px solid " + v.color }} /> {v.label}
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: ACCENT }} /> Selected
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#fbfcfd", border: "1px solid #e2e8f0" }} /> Not in sample
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#cbd3dc", border: "1px dashed #94a3b8" }} /> Adjacent (Mexico)
                </div>
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 9, lineHeight: 1.5 }}>Tiers show <strong>illustrative regulatory complexity</strong> — Elevated (most complex) · Moderate · Baseline (most standard). Not a formal risk assessment.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 02: Product Workstream ===== */}
      <section id="workstream" style={{ scrollMarginTop: SCROLL_MARGIN }}>
        <SectionHead
          num="02 · IN FLIGHT"
          numColor="#0d9488"
          title="Product Workstream"
          divider="#99f6e4"
          extra={<span style={{ fontSize: 10, fontWeight: 700, background: "#ccfbf1", color: "#0f766e", padding: "2px 8px", borderRadius: 10 }}>CAPER CARTS · STOREFRONT PRO · CLAUDE</span>}
        />
        <ProductWorkstream />
      </section>

      {/* ===== SECTION 03: Expansion Horizon ===== */}
      <section id="expansion" style={{ scrollMarginTop: SCROLL_MARGIN }}>
        <SectionHead
          num="03 · STRATEGIC"
          numColor="#4338ca"
          title="Expansion Horizon"
          divider="#c7d2fe"
          extra={<span style={{ fontSize: 10, fontWeight: 700, background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: 10 }}>NOT CURRENT FOOTPRINT</span>}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <ExpansionView />
        </div>
      </section>

      {/* ===== SECTION 04: Law Library ===== */}
      <section id="research" style={{ scrollMarginTop: SCROLL_MARGIN }}>
        <SectionHead num="04 · STUDY MAP" numColor="#0284c7" title="Law Library" divider="#bae6fd" />
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <ResearchLibrary />
        </div>
      </section>

      {/* ===== SECTION 05: Why I'm a fit ===== */}
      <section id="resume" style={{ scrollMarginTop: SCROLL_MARGIN }}>
        <SectionHead
          num="05 · FIT"
          numColor={ACCENT}
          title="Why I'm a fit"
          divider="#cbd5e1"
          extra={<span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>· the person behind the prototype</span>}
        />
        <ResumeSection />
      </section>

      {/* Welcome / About modal */}
      {(showAbout || showWelcome) && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 14, maxWidth: 560, width: "100%", padding: 24, maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{modalTitle}</div>
              <X size={20} style={{ cursor: "pointer", flexShrink: 0 }} onClick={closeModal} />
            </div>
            <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>
              {isWelcome && (
                <>
                  <p style={{ marginTop: 0 }}>Welcome. This is a working concept demo — a visual extension of my résumé for the Product Counsel role. It shows how I'd approach the seat, not a finished product.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, margin: "14px 0", padding: 14, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#94a3b8" }}>WHAT'S INSIDE</div>
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}><MapIcon size={15} style={{ color: "#2f9e44", marginTop: 2, flexShrink: 0 }} /><span><strong>Current Locations</strong> — current footprint (US, Canada) plus anticipated expansion (UK, EU), each with a sample brief.</span></div>
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}><ListChecks size={15} style={{ color: "#0d9488", marginTop: 2, flexShrink: 0 }} /><span><strong>Product Workstream</strong> — how I'd sit with the Caper Carts and Storefront Pro teams.</span></div>
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}><Globe size={15} style={{ color: "#4338ca", marginTop: 2, flexShrink: 0 }} /><span><strong>Expansion Horizon</strong> — regimes that would activate on international growth.</span></div>
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}><Scale size={15} style={{ color: "#0284c7", marginTop: 2, flexShrink: 0 }} /><span><strong>Law Library</strong> — a self-directed study map of the e-commerce legal stack.</span></div>
                  </div>
                </>
              )}
              <p style={{ marginTop: 0 }}><strong>Purpose.</strong> An internal workspace that helps product and legal teams spot jurisdictional issues early and route them to the right specialist — turning legal from a bottleneck into a fast first-pass triage layer.</p>
              <p><strong>Design principle: human-in-the-loop.</strong> It drafts preliminary issue-spots and routes them. It never issues final legal advice, and nothing here is consumer-facing.</p>
              <p><strong>What I'd never let it do without review:</strong></p>
              <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                <li>Give end users or the public legal conclusions (UPL / reliance risk).</li>
                <li>Present AI output as authoritative without attorney sign-off.</li>
                <li>Auto-approve a launch based on a "low risk" tag.</li>
                <li>Store or surface confidential data without access controls.</li>
              </ul>
              <p><strong>How AI fits.</strong> AI accelerates the first draft — summarizing issues, suggesting the likely specialist, keeping briefs current — while attorneys validate. The value is velocity with judgment preserved, which is exactly the efficiency mandate this kind of role calls for.</p>
              <p style={{ marginBottom: 0, color: "#94a3b8", fontSize: 12 }}>Built as an interview prototype from public information. All legal content is illustrative sample material, not advice.</p>
            </div>
            {isWelcome && (
              <button onClick={closeModal} style={{ marginTop: 18, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: ACCENT, color: "white", border: "none", borderRadius: 9, padding: 12, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Explore the demo <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
