import { createElement } from 'react'
import { Package, ScrollText } from 'lucide-react'
import { INITIATIVES, LAW_TONE, STATUS } from '../data/initiatives'
import { DOMAINS } from '../data/jurisdictions'

export default function ProductWorkstream() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 20px 20px" }}>
      <div style={{ background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "#115e59", display: "flex", gap: 10 }}>
        <Package size={17} style={{ flexShrink: 0, marginTop: 1 }} />
        <span><strong>Product-embedded counsel.</strong> Three initiatives relevant to the role. Caper Carts and Storefront Pro are real Instacart products; a Claude-powered shopping assistant is an illustrative AI initiative. The regimes and backlog are illustrative — how I'd sit with each product team, map the applicable law, and run the contract playbook. Not legal advice.</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {INITIATIVES.map((p) => (
          <div key={p.name} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: p.color + "14" }}>
                {createElement(p.icon, { size: 18, color: p.color })}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: "#64748b", background: "#f1f5f9", borderRadius: 10, padding: "2px 8px" }}>{p.tag}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, marginTop: 4 }}>{p.what}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#94a3b8", marginBottom: 7 }}>APPLICABLE REGIMES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.laws.map((lw, i) => {
                  const t = LAW_TONE[lw.tone]
                  return (
                    <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, color: t.color, background: t.bg, border: "1px solid " + t.border }}>{lw.label}</span>
                  )
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#94a3b8", marginBottom: 3 }}>COUNSEL BACKLOG</div>
              {p.backlog.map((b, i) => {
                const s = STATUS[b.status]
                return (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, marginTop: 5, background: DOMAINS[b.domain] ? DOMAINS[b.domain].color : "#94a3b8" }} />
                    <span style={{ flex: 1, fontSize: 12.5, color: "#475569", lineHeight: 1.45 }}>{b.item}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", padding: "2px 8px", borderRadius: 20, color: s.color, background: s.bg }}>{b.status}</span>
                  </div>
                )
              })}
            </div>

            {p.playbook && (
              <div>
                <div title="Illustrative only — in production this would open the actual playbook document." style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 9, padding: "9px 12px", cursor: "default" }}>
                  <ScrollText size={15} style={{ color: p.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: "#475569" }}>{p.playbook}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: "#94a3b8", background: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "2px 7px" }}>EXAMPLE</span>
                </div>
                <div style={{ fontSize: 10.5, color: "#94a3b8", fontStyle: "italic", marginTop: 5 }}>Illustrative — would link to the actual playbook.</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
