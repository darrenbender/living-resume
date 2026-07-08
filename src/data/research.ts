// ── RESEARCH LIBRARY ────────────────────────────────────────────────────
// Condensed from a self-directed study map (dated, primary-source-linked,
// with verification caveats preserved). Full detail lives in the repo .md files.
//
// Illustrative issue-spotting scaffolding — NOT legal advice, NOT authoritative.
// Case-law status and statute counts require verification; caveats are preserved.

import { Lock, CreditCard, Megaphone, Scale, BookOpen, ShieldCheck, Wine, Pill } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface ResearchLink {
  label: string
  url: string
}

export interface ResearchDomain {
  id: string
  title: string
  icon: LucideIcon
  color: string
  issues: string[]
  links: ResearchLink[]
  /** Verification flag shown with the domain; null when none applies. */
  caveat: string | null
}

export const RESEARCH: ResearchDomain[] = [
  {
    id: 'privacy', title: 'Privacy & Data Protection', icon: Lock, color: '#2563eb',
    issues: [
      'CCPA/CPRA: consumer rights, opt-out of sale AND sharing (GPC signals), Sensitive PI + right to limit (precise geolocation = SPI for delivery)',
      '~19–20 state comprehensive privacy acts (VA, CO, CT, TX archetypes) — many flip precise-location to opt-IN, unlike CCPA\'s opt-out',
      'GDPR (EU): lawful basis, broader erasure/portability, international-transfer mechanisms',
      'BIPA (Illinois): written consent before biometric collection; private right of action + statutory damages — largest US privacy class-action exposure',
    ],
    links: [
      { label: 'CCPA/CPRA full text (leginfo)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=3.&part=4.&lawCode=CIV&title=1.81.5' },
      { label: 'CPPA regulations hub', url: 'https://cppa.ca.gov/regulations/' },
      { label: 'GDPR consolidated text (EUR-Lex)', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng' },
      { label: 'BIPA — 740 ILCS 14', url: 'https://www.ilga.gov/Legislation/ILCS/Articles?ActID=3004&ChapterID=57&Print=True' },
    ],
    caveat: 'Exact count of state privacy laws changes frequently — verify against a live tracker.',
  },
  {
    id: 'payments', title: 'Payments & Money Movement', icon: CreditCard, color: '#0891b2',
    issues: [
      'Money transmission: transmitting money (40+ state licenses) vs. agent-of-payee (often exempt) — a make-or-break structuring question',
      'Federal MSB registration + BSA/AML program (FinCEN) if any part of the stack makes you a transmitter',
      'Stored value / gift cards / wallets: Reg E (5-yr expiration, fee limits) + BSA prepaid-access; closed-loop ≤$2,000/day exclusion',
      'Card networks + PCI DSS (v4.0.1): tokenize/outsource to shrink PCI scope; Reg II debit interchange; Reg E dispute duties',
    ],
    links: [
      { label: '31 U.S.C. § 5330 (money transmitting)', url: 'https://www.law.cornell.edu/uscode/text/31/5330' },
      { label: 'FinCEN — Am I an MSB?', url: 'https://www.fincen.gov/am-i-msb' },
      { label: 'Reg E gift cards — 12 CFR § 1005.20', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1005/20/' },
      { label: 'PCI DSS document library', url: 'https://www.pcisecuritystandards.org/document_library/' },
    ],
    caveat: 'Card-network operating rules/interchange are private contracts, not primary law.',
  },
  {
    id: 'advertising', title: 'Advertising & Marketing', icon: Megaphone, color: '#db2777',
    issues: [
      'FTC Act §5: objective claims (\'freshest\', \'lowest price\', \'30-min delivery\') need reasonable-basis substantiation BEFORE dissemination',
      'Endorsement Guides (rev. 2023): #ad disclosure for paid creators, affiliates, employee posts, referral incentives',
      'Fake-reviews rule (16 CFR 465) IN FORCE since Oct 2024: bans fake/AI reviews, review suppression, fake indicators — governs merchant ratings',
      'Dark patterns: checkout defaults, tip/priority toggles, upsells, cancellation UX (enforced via §5)',
    ],
    links: [
      { label: '15 U.S.C. § 45 (FTC Act §5)', url: 'https://www.law.cornell.edu/uscode/text/15/45' },
      { label: 'Endorsement Guides — 16 CFR 255', url: 'https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255' },
      { label: 'Fake Reviews Rule — 16 CFR 465', url: 'https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465' },
      { label: 'FTC — Bringing Dark Patterns to Light', url: 'https://www.ftc.gov/reports/bringing-dark-patterns-light' },
    ],
    caveat: null,
  },
  {
    id: 'consumer', title: 'Consumer Protection', icon: Scale, color: '#ca8a04',
    issues: [
      'Click-to-Cancel: VACATED July 8, 2025 (8th Cir.) — NOT in force; ROSCA + §5 + state ARLs still apply',
      'Junk-fees rule (16 CFR 464) IN FORCE but NARROW — live-event tickets & lodging only, not grocery/delivery',
      'Auto-renewal: California ARL is the binding standard now (stricter 2025 amendments) — affects free-delivery membership enrollment/cancel flow',
      'Drip pricing: CA SB 478 broadly bans undisclosed mandatory fees — more directly binding on delivery fees than the narrow FTC rule',
    ],
    links: [
      { label: 'ROSCA — 15 U.S.C. § 8401', url: 'https://www.law.cornell.edu/uscode/text/15/8401' },
      { label: 'CA ARL — Bus. & Prof. §§ 17600–17606', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=BPC&division=7.&title=&part=3.&chapter=1.&article=9.' },
      { label: 'CA SB 478 (honest pricing)', url: 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240SB478' },
    ],
    caveat: 'FTC signaled fresh negative-option rulemaking in early 2026 — treat as pending, not law. SB 478 food-delivery treatment refined by later guidance — verify.',
  },
  {
    id: 'copyright', title: 'Copyright & IP in Product', icon: BookOpen, color: '#7c3aed',
    issues: [
      'DMCA §512(c) safe harbor for UGC (seller listings, photos, reviews): needs registered designated agent + repeat-infringer policy',
      'UGC license grant in ToS: broad royalty-free sublicensable worldwide license to display/adapt/syndicate customer & seller content',
      'Licensing hygiene: stock media/fonts/music scope (desktop font licenses rarely cover app embedding); music needs composition + master rights',
      'Marketplace contributory liability: act on SPECIFIC counterfeit notices (Tiffany v. eBay) — avoid willful blindness',
    ],
    links: [
      { label: '17 U.S.C. § 512 (DMCA safe harbor)', url: 'https://www.law.cornell.edu/uscode/text/17/512' },
      { label: 'Copyright Office — DMCA', url: 'https://www.copyright.gov/dmca/' },
      { label: 'DMCA Designated Agent Directory', url: 'https://www.copyright.gov/dmca-directory/' },
    ],
    caveat: 'Case law (Viacom v. YouTube, Tiffany v. eBay) — verify current good-law status.',
  },
  {
    id: 'commercial', title: 'Commercial / SaaS', icon: ShieldCheck, color: '#0d9488',
    issues: [
      'Indemnification + limitation of liability (triaged together): are data-breach & IP-infringement carved out of the general cap?',
      'IP ownership: without signed WMFH/assignment, the contractor owns commissioned code — frequent expensive SOW gap',
      'Data protection addenda: CCPA service-provider terms + EU SCCs + concrete security exhibit (missing terms can recharacterize a transfer as a \'sale\')',
      'SLAs, warranties, OSS: uptime tiers + sole-remedy vs. termination right; copyleft (GPL/AGPL) can reach into your stack',
    ],
    links: [
      { label: '17 U.S.C. § 101 (work made for hire)', url: 'https://www.law.cornell.edu/uscode/text/17/101' },
      { label: 'EU Standard Contractual Clauses', url: 'https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en' },
      { label: 'FTC — Start with Security', url: 'https://www.ftc.gov/business-guidance/privacy-security/data-security' },
    ],
    caveat: 'Most SaaS risk terms are practice conventions grounded in contract common law, not statute.',
  },
  {
    id: 'alcohol', title: 'Alcohol Delivery', icon: Wine, color: '#9333ea',
    issues: [
      'Three-tier system (TTB/FAA Act upstream); 21st Amendment → states hold primary control, so no single national playbook',
      'State licensing: must the PLATFORM hold a delivery/retail license, or act as a marketplace for licensed retailers? Determines the whole operating model',
      'Age verification at handoff + dram-shop / sale-to-intoxicated exposure — the highest-frequency compliance touchpoint',
      'DTC shipping + dormant Commerce Clause (Granholm; Tennessee Wine reaches the retail tier)',
    ],
    links: [
      { label: 'TTB — Federal Alcohol Administration Act', url: 'https://www.ttb.gov/trade-practices/federal-alcohol-administration-act' },
      { label: '21st Amendment (Cornell LII)', url: 'https://www.law.cornell.edu/constitution/amendmentxxi' },
      { label: 'Granholm v. Heald (Justia)', url: 'https://supreme.justia.com/cases/federal/us/544/460/' },
    ],
    caveat: 'Marketplace-vs-licensee treatment is state-by-state — needs a 50-state check. Cases: verify good-law status.',
  },
  {
    id: 'pharmacy', title: 'Pharmacy / Rx', icon: Pill, color: '#dc2626',
    issues: [
      'Controlled Substances Act + DEA registration: closed distribution system; gating question for any Rx delivery line',
      'Ryan Haight Act: in-person eval (with telemedicine exception) before online controlled-substance prescribing',
      'DSCSA track-and-trace / serialization: dispensers must capture/pass serialized data, quarantine suspect product',
      'State pharmacy licensing (nonresident licenses per destination state) + PDMP reporting; HIPAA — Rx data is PHI, marketing uses need authorization',
    ],
    links: [
      { label: '21 U.S.C. § 801 (CSA)', url: 'https://www.law.cornell.edu/uscode/text/21/801' },
      { label: 'Ryan Haight Act (Congress.gov)', url: 'https://www.congress.gov/bill/110th-congress/house-bill/6353' },
      { label: 'FDA — DSCSA', url: 'https://www.fda.gov/drugs/drug-supply-chain-integrity/drug-supply-chain-security-act-dscsa' },
      { label: 'HHS — HIPAA Privacy Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html' },
    ],
    caveat: 'DEA telemedicine flexibilities repeatedly extended; permanent special-registration rule in rulemaking — confirm current status.',
  },
]
