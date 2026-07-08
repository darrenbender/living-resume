import { useState, useMemo, createElement } from 'react'
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Info,
  X,
  Scale,
  Globe,
  BookOpen,
} from 'lucide-react'
import { DOMAINS, STATES, TIER } from '../data/jurisdictions'
import type { Domain, DomainKey } from '../data/jurisdictions'
import { runTriage } from '../lib/triage'
import FootprintMap from './FootprintMap'
import ExpansionView from './ExpansionView'
import ResearchLibrary from './ResearchLibrary'

type View = 'us' | 'global' | 'research'

export default function LegalOpsCopilot() {
  const [selected, setSelected] = useState<string>('CA')
  const [query, setQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState<DomainKey | null>(null)
  const [showAbout, setShowAbout] = useState(false)
  const [routed, setRouted] = useState<DomainKey | null>(null)
  const [view, setView] = useState<View>('us')

  const state = STATES[selected]

  // Triage is isolated behind runTriage() — swap that for an AI endpoint later.
  const triageResult = useMemo(() => runTriage(query), [query])

  const visibleFlags = domainFilter ? state.flags.filter((f) => f.d === domainFilter) : state.flags

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, Arial", background: "#f8fafc", minHeight: "100%", color: "#0f172a" }}>
      {/* Header */}
      <div style={{ background: "#0f172a", color: "white", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Scale size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Legal-Ops Copilot</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Internal jurisdiction issue-spotter · product & legal teams</div>
          </div>
        </div>
        <button onClick={() => setShowAbout(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13 }}>
          <Info size={15} /> How this works / limits
        </button>
      </div>

      {/* Disclaimer banner */}
      <div style={{ background: "#fef3c7", borderBottom: "1px solid #fde68a", padding: "8px 20px", fontSize: 12.5, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
        <AlertTriangle size={15} />
        <span><strong>Prototype — illustrative sample content only.</strong> Not legal advice, not authoritative. Every output is a draft issue-spot for a human attorney to review.</span>
      </div>

      {/* Footprint toggle: current vs expansion */}
      <div style={{ display: "flex", gap: 8, padding: "14px 20px 0", flexWrap: "wrap" }}>
        <button onClick={() => setView("us")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid #e2e8f0", background: view === "us" ? "#0f172a" : "white", color: view === "us" ? "white" : "#475569" }}>
          <Scale size={14} /> Current Footprint · US &amp; Canada
        </button>
        <button onClick={() => setView("global")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid #e2e8f0", background: view === "global" ? "#0f172a" : "white", color: view === "global" ? "white" : "#475569" }}>
          <Globe size={14} /> Expansion Horizon <span style={{ fontSize: 10, fontWeight: 700, background: "#e0e7ff", color: "#4338ca", padding: "1px 6px", borderRadius: 10 }}>STRATEGIC</span>
        </button>
        <button onClick={() => setView("research")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid #e2e8f0", background: view === "research" ? "#0f172a" : "white", color: view === "research" ? "white" : "#475569" }}>
          <BookOpen size={14} /> Research Library
        </button>
      </div>

      {view === "research" ? (
        <ResearchLibrary />
      ) : view === "global" ? (
        <ExpansionView />
      ) : (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 20, alignItems: "flex-start" }}>
        {/* Left: map + triage */}
        <div style={{ flex: "1 1 420px", minWidth: 320 }}>
          {/* Triage search */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#475569" }}>Ask a product-launch question (triage)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 8, padding: "8px 12px" }}>
              <Search size={16} color="#64748b" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'alcohol delivery in Pennsylvania' or 'privacy for a new health vertical'"
                style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontSize: 13.5 }}
              />
              {query && <X size={15} color="#94a3b8" style={{ cursor: "pointer" }} onClick={() => setQuery("")} />}
            </div>

            {triageResult && (
              <div style={{ marginTop: 12, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                {triageResult.primary && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 10px", background: DOMAINS[triageResult.primary].color + "12", borderRadius: 8 }}>
                    {createElement(DOMAINS[triageResult.primary].icon, { size: 16, color: DOMAINS[triageResult.primary].color })}
                    <span style={{ fontSize: 13 }}>Likely specialist: <strong>{DOMAINS[triageResult.primary].label}</strong></span>
                    <button onClick={() => setRouted(triageResult.primary)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DOMAINS[triageResult.primary].color, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      Route <ArrowRight size={13} />
                    </button>
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Related sample flags:</div>
                {triageResult.hits.length === 0 && <div style={{ fontSize: 13, color: "#94a3b8" }}>No sample matches — a human attorney would scope this manually.</div>}
                {triageResult.hits.map((h, i) => (
                  <div key={i} style={{ fontSize: 12.5, padding: "6px 0", borderBottom: "1px solid #f8fafc", display: "flex", gap: 8 }}>
                    <span style={{ fontWeight: 600, color: DOMAINS[h.domain].color, minWidth: 34 }}>{h.code}</span>
                    <span style={{ color: "#475569" }}>{h.note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Geographic map */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#475569" }}>Operating footprint · US &amp; Canada</div>
            <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 12 }}>Click a shaded jurisdiction for its sample issue-spot brief. Color = illustrative risk tier. Unshaded states are not in this sample set.</div>

            {/* Canada band — clickable provinces */}
            <div style={{ padding: "8px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>🍁</span>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155" }}>Canada</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#0891b2", background: "#ecfeff", padding: "2px 7px", borderRadius: 10, border: "1px solid #a5f3fc" }}>live footprint</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["QC", "ON"].map((code) => {
                  const s = STATES[code]
                  const t = TIER[s.tier]
                  const active = selected === code
                  return (
                    <button
                      key={code}
                      onClick={() => { setSelected(code); setDomainFilter(null); setRouted(null); }}
                      style={{
                        flex: 1, padding: "8px 10px", borderRadius: 7, cursor: "pointer",
                        border: active ? "2px solid #0f172a" : "1px solid " + t.color + "66",
                        background: active ? "#0f172a" : t.bg,
                        color: active ? "white" : t.color,
                        fontWeight: 600, fontSize: 12, textAlign: "left",
                      }}
                    >
                      {s.name.replace(" (Canada)", "")} <span style={{ fontSize: 10, opacity: 0.8 }}>· {s.flags.length}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Real geographic map (US states + Canadian provinces) */}
            <FootprintMap
              selected={selected}
              onSelect={(code) => { setSelected(code); setDomainFilter(null); setRouted(null); }}
            />

            {/* legend */}
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
              {Object.entries(TIER).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: v.bg, border: "1px solid " + v.color }} /> {v.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f1f5f9", border: "1px solid #cbd5e1" }} /> Not in sample
              </div>
            </div>
          </div>
        </div>

        {/* Right: brief panel */}
        <div style={{ flex: "1 1 360px", minWidth: 300 }}>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{state.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Sample issue-spot brief</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TIER[state.tier].color, background: TIER[state.tier].bg, padding: "5px 10px", borderRadius: 20, border: "1px solid " + TIER[state.tier].color + "44" }}>
                {TIER[state.tier].label} risk
              </div>
            </div>

            {/* domain filter chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "12px 18px 4px" }}>
              <button onClick={() => setDomainFilter(null)} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 20, cursor: "pointer", border: "1px solid #e2e8f0", background: domainFilter === null ? "#0f172a" : "white", color: domainFilter === null ? "white" : "#475569" }}>All</button>
              {(Object.entries(DOMAINS) as [DomainKey, Domain][]).map(([k, v]) => (
                <button key={k} onClick={() => setDomainFilter(k)} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 20, cursor: "pointer", border: "1px solid " + v.color + "44", background: domainFilter === k ? v.color : v.color + "10", color: domainFilter === k ? "white" : v.color, display: "flex", alignItems: "center", gap: 4 }}>
                  {createElement(v.icon, { size: 12 })} {v.label}
                </button>
              ))}
            </div>

            <div style={{ padding: "8px 18px 18px" }}>
              {visibleFlags.map((f, i) => {
                const dm = DOMAINS[f.d]
                return (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: i < visibleFlags.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: dm.color + "14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {createElement(dm.icon, { size: 16, color: dm.color })}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: dm.color, marginBottom: 2 }}>{dm.label}</div>
                      <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.45 }}>{f.note}</div>
                    </div>
                  </div>
                )
              })}

              {/* route to specialist */}
              <button
                onClick={() => setRouted(visibleFlags[0]?.d ?? null)}
                style={{ marginTop: 14, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#0f172a", color: "white", border: "none", borderRadius: 9, padding: "11px", cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}
              >
                Route to specialist for confirmation <ArrowRight size={15} />
              </button>

              {routed && (
                <div style={{ marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "12px 14px", fontSize: 12.5, color: "#166534", display: "flex", gap: 8 }}>
                  <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>Draft issue-spot routed to <strong>{DOMAINS[routed]?.label || "specialist"}</strong> counsel. In production this creates a ticket + attaches the preliminary brief for human review before any advice is finalized.</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, lineHeight: 1.5 }}>
            Human-in-the-loop by design: the tool drafts and routes; it never delivers final legal advice. Sample data is illustrative and public-information-based.
          </div>
        </div>
      </div>
      )}

      {/* About modal */}
      {showAbout && (
        <div onClick={() => setShowAbout(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 14, maxWidth: 540, width: "100%", padding: 24, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>How this works — and what it won't do</div>
              <X size={20} style={{ cursor: "pointer" }} onClick={() => setShowAbout(false)} />
            </div>
            <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>
              <p style={{ marginTop: 0 }}><strong>Purpose.</strong> An internal copilot that helps product and legal teams spot jurisdictional issues early and route them to the right specialist — turning legal from a bottleneck into a fast first-pass triage layer.</p>
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
          </div>
        </div>
      )}
    </div>
  )
}
