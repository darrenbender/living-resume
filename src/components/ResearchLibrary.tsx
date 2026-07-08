import { createElement } from 'react'
import { BookOpen, AlertTriangle, ExternalLink } from 'lucide-react'
import { RESEARCH } from '../data/research'

export default function ResearchLibrary() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13, color: "#075985", display: "flex", gap: 10 }}>
        <BookOpen size={17} style={{ flexShrink: 0, marginTop: 1 }} />
        <span><strong>Self-directed study map.</strong> I'm candid that the substantive e-commerce stack isn't my deepest background yet — so I built a map of it. This is issue-spotting scaffolding organized the way a product counsel triages an incoming question, with primary-source links and honest verification flags. It's a map, not a memo, and not legal advice.</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {RESEARCH.map((r) => (
          <div key={r.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: r.color + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {createElement(r.icon, { size: 16, color: r.color })}
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</span>
            </div>
            <ul style={{ margin: "0 0 10px", paddingLeft: 16 }}>
              {r.issues.map((iss, i) => (
                <li key={i} style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, marginBottom: 5 }}>{iss}</li>
              ))}
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: r.caveat ? 8 : 0 }}>
              {r.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: r.color, background: r.color + "10", padding: "3px 8px", borderRadius: 6, textDecoration: "none" }}>
                  {l.label} <ExternalLink size={10} />
                </a>
              ))}
            </div>
            {r.caveat && (
              <div style={{ fontSize: 11, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "6px 8px", display: "flex", gap: 6 }}>
                <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{r.caveat}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 14, lineHeight: 1.5, textAlign: "center" }}>
        Condensed from an 8-domain study map with full primary-source citations and case flags. Dated; verification-flagged throughout. Built to show initiative and fast-ramp, not claimed mastery.
      </div>
    </div>
  )
}
