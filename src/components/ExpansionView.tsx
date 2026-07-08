import { Info, Globe } from 'lucide-react'
import { EXPANSION_REGIONS } from '../data/expansion'

export default function ExpansionView() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#eef2ff", border: "1px dashed #a5b4fc", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "#3730a3", display: "flex", gap: 10 }}>
        <Info size={17} style={{ flexShrink: 0, marginTop: 1 }} />
        <span><strong>Expansion-readiness view — not current footprint.</strong> Instacart operates today in the US &amp; Canada. This role's brief cites GDPR and international e-commerce law, signaling growth intent. This layer maps the regimes that would activate on expansion — illustrative, requiring attorney verification, framed as strategic readiness rather than present obligation.</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {EXPANSION_REGIONS.map((r, i) => (
          <div key={i} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Globe size={16} color="#4338ca" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{r.region}</span>
            </div>
            {r.regimes.map((rg, j) => (
              <div key={j} style={{ fontSize: 12, color: "#4338ca", background: "#eef2ff", borderRadius: 6, padding: "3px 8px", marginBottom: 4, display: "inline-block", marginRight: 4 }}>{rg}</div>
            ))}
            <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, marginTop: 8 }}>{r.note}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginTop: 16, fontSize: 12.5, color: "#854d0e", lineHeight: 1.5 }}>
        <strong>Why I mapped this:</strong> the role brief's references to GDPR and international e-commerce law read to me as expansion intent. Whoever fills this seat should be able to facilitate that move. As footprint globalizes, data-sovereignty and security-resilience obligations (DORA, NIS2) intersect with forward-looking cryptographic risk — where I bring the Post-Quantum Negligence lens. Framed honestly: <em>foreseeability and timing</em>, not present non-compliance.
      </div>
    </div>
  )
}
