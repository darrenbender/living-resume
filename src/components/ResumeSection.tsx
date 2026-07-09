import { Briefcase, Workflow, Target, Handshake } from 'lucide-react'
import { ACCENT, ACCENT_DARK } from '../theme'

export default function ResumeSection() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 20px 32px" }}>
      <p style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.6, maxWidth: 800, margin: "0 0 20px" }}>
        This whole demo is the pitch in miniature — it's how I actually work: spot the issues early, organize them so a product team can move, and keep an attorney in the loop. Here's the short version.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 16 }}>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4" }}><Briefcase size={18} color={ACCENT} /></div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>What I do</span>
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>I'm a product counsel. I sit with product and engineering, spot the jurisdictional and regulatory issues a launch will hit, triage them quickly, and route the hard calls to the right specialist — turning legal from a gate into a velocity function.</div>
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdfa" }}><Workflow size={18} color="#0d9488" /></div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>How I do it</span>
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>Human-in-the-loop by default. I build reusable issue-spotting scaffolding and contract playbooks, ramp fast on unfamiliar domains (this Law Library is a self-directed example), and hold a clear line between a quick first-pass draft and final, attorney-signed advice.</div>
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#eef2ff" }}><Target size={18} color="#4338ca" /></div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Why I'm a good fit</span>
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>Everything here maps to the seat: the US & Canada footprint, the EU/UK expansion signals in the brief, and live products like Caper Carts, Storefront Pro and a Claude-powered assistant — across privacy, payments, alcohol, advertising and platform/UGC. I'm built to be the embedded, pragmatic counsel these products need.</div>
        </div>
      </div>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Handshake size={20} style={{ color: ACCENT_DARK, flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#166534", marginBottom: 4 }}>Thank you</div>
          <div style={{ fontSize: 13, color: "#14532d", lineHeight: 1.6 }}>Thank you for taking the time to click through this. I built it as a working sample of how I'd approach the role — not a finished tool, and all legal content is illustrative. I'd welcome the chance to talk it through.</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#166534", marginTop: 10 }}>— Darren Bender</div>
        </div>
      </div>
    </div>
  )
}
