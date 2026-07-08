// ── ILLUSTRATIVE SAMPLE DATA ────────────────────────────────────────────
// NOTE: All legal content below is generic, illustrative sample material
// created for a prototype demo. It is NOT legal advice and NOT authoritative.
// The point of this tool is workflow + structure, not any specific legal take.
//
// Nothing here should be relied on. Risk tiers, flags, and notes are
// illustrative only and public-information-based.

import { CreditCard, Lock, Wine, Scale, Megaphone, Pill } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** Legal domains the copilot triages across. */
export type DomainKey =
  | 'alcohol'
  | 'payments'
  | 'privacy'
  | 'consumer'
  | 'advertising'
  | 'pharmacy'

/** Illustrative risk tier for a jurisdiction. */
export type TierKey = 'high' | 'medium' | 'low'

export interface Domain {
  label: string
  icon: LucideIcon
  color: string
}

/** A single sample issue-spot within a jurisdiction. */
export interface Flag {
  /** Domain this flag belongs to. */
  d: DomainKey
  /** Illustrative sample note. */
  note: string
}

export interface StateInfo {
  name: string
  tier: TierKey
  /** Country the jurisdiction sits in. Omitted = US state; 'CA' = Canadian province. */
  country?: 'CA'
  flags: Flag[]
}

export interface TierInfo {
  label: string
  color: string
  bg: string
}

export const DOMAINS: Record<DomainKey, Domain> = {
  alcohol: { label: 'Alcohol Delivery', icon: Wine, color: '#7c3aed' },
  payments: { label: 'Payments', icon: CreditCard, color: '#0891b2' },
  privacy: { label: 'Privacy', icon: Lock, color: '#2563eb' },
  consumer: { label: 'Consumer Protection', icon: Scale, color: '#ca8a04' },
  advertising: { label: 'Advertising / Merch', icon: Megaphone, color: '#db2777' },
  pharmacy: { label: 'Pharmacy / Rx', icon: Pill, color: '#dc2626' },
}

// A handful of representative states with sample issue-spots. Keyed by the
// two-letter postal code, which is how the map matches geography to data.
// Risk tiers are illustrative only.
export const STATES: Record<string, StateInfo> = {
  CA: {
    name: 'California',
    tier: 'high',
    flags: [
      { d: 'privacy', note: 'Comprehensive state privacy statute in force; sample flag for data-sharing & opt-out UX review.' },
      { d: 'alcohol', note: 'State-specific licensing & delivery-hours constraints; ID-verification workflow review.' },
      { d: 'consumer', note: 'Robust consumer-protection regime; auto-renewal & pricing-disclosure sample flag.' },
      { d: 'advertising', note: "Disclosure rules for promoted placements; 'sponsored' labeling review." },
      { d: 'pharmacy', note: 'Rx delivery: ID-scan + signature workflow; controlled-substance & specialty-med exclusions; HIPAA-adjacent handling review.' },
    ],
  },
  TX: {
    name: 'Texas',
    tier: 'medium',
    flags: [
      { d: 'alcohol', note: 'Distinct licensing tiers & delivery rules; hours/holiday restriction review.' },
      { d: 'payments', note: 'Money-transmission posture check for stored value / tips flows (sample).' },
      { d: 'consumer', note: 'Deceptive-practices statute; pricing & fee-transparency sample flag.' },
      { d: 'pharmacy', note: 'Rx delivery permitted with ID verification; controlled-substance exclusion & partner-pharmacy scope review.' },
    ],
  },
  NY: {
    name: 'New York',
    tier: 'high',
    flags: [
      { d: 'alcohol', note: 'Licensing & delivery constraints; third-party delivery model review.' },
      { d: 'privacy', note: 'Sector privacy obligations; sample flag for biometric / location data.' },
      { d: 'advertising', note: 'Ad-disclosure & pricing rules; drip-pricing sample flag.' },
      { d: 'consumer', note: 'AG-active enforcement climate; fee-disclosure review.' },
    ],
  },
  FL: {
    name: 'Florida',
    tier: 'medium',
    flags: [
      { d: 'alcohol', note: 'Delivery permissions vary by license class; verification workflow review.' },
      { d: 'privacy', note: 'State privacy law scope check for large-processor thresholds (sample).' },
      { d: 'pharmacy', note: 'Rx delivery active via partner pharmacies; signature-on-delivery rule review.' },
    ],
  },
  IL: {
    name: 'Illinois',
    tier: 'high',
    flags: [
      { d: 'privacy', note: 'Biometric privacy statute — high-sensitivity sample flag for any imaging/ID features.' },
      { d: 'payments', note: 'Stored-value & gift-card handling review (sample).' },
      { d: 'alcohol', note: 'Local option rules vary by municipality; layered review.' },
    ],
  },
  WA: {
    name: 'Washington',
    tier: 'medium',
    flags: [
      { d: 'privacy', note: 'Health-adjacent data rules; sample flag for wellness/health verticals.' },
      { d: 'alcohol', note: 'State delivery framework; licensing review.' },
    ],
  },
  MA: {
    name: 'Massachusetts',
    tier: 'medium',
    flags: [
      { d: 'consumer', note: 'Strong consumer-protection statute; fee & pricing sample flag.' },
      { d: 'alcohol', note: 'Delivery licensing constraints; hours review.' },
    ],
  },
  GA: {
    name: 'Georgia',
    tier: 'low',
    flags: [
      { d: 'alcohol', note: 'Delivery permitted under defined conditions; licensing review.' },
      { d: 'consumer', note: 'Baseline consumer-protection review.' },
    ],
  },
  PA: {
    name: 'Pennsylvania',
    tier: 'high',
    flags: [
      { d: 'alcohol', note: 'State-controlled distribution model — elevated sample flag for delivery structure.' },
      { d: 'payments', note: 'Stored-value handling review (sample).' },
    ],
  },
  CO: {
    name: 'Colorado',
    tier: 'medium',
    flags: [
      { d: 'privacy', note: 'State privacy act in force; opt-out & profiling UX review.' },
      { d: 'alcohol', note: 'Delivery framework with licensing conditions.' },
    ],
  },
  QC: {
    name: 'Quebec (Canada)',
    tier: 'high',
    country: 'CA',
    flags: [
      { d: 'privacy', note: "Law 25: Quebec's stringent private-sector privacy regime — express consent, privacy-by-default, mandatory privacy officer, breach reporting, and data-portability. Stricter than most US state laws." },
      { d: 'consumer', note: 'French-language requirements (Charter of the French Language) for consumer-facing UX, contracts, and marketing — a distinct localization/compliance duty.' },
      { d: 'alcohol', note: 'Alcohol sale/delivery routed through provincial monopoly (SAQ) framework; distinct from US retail models.' },
    ],
  },
  ON: {
    name: 'Ontario (Canada)',
    tier: 'medium',
    country: 'CA',
    flags: [
      { d: 'privacy', note: 'Federal PIPEDA governs commercial data (no Quebec-style provincial private-sector law); consent + access rights.' },
      { d: 'alcohol', note: 'Delivery via provincial framework (LCBO / licensed retail); age verification at handoff.' },
      { d: 'consumer', note: 'Provincial consumer-protection statute; bilingual considerations for national campaigns.' },
    ],
  },
}

export const TIER: Record<TierKey, TierInfo> = {
  high: { label: 'Elevated', color: '#dc2626', bg: '#fef2f2' },
  medium: { label: 'Moderate', color: '#d97706', bg: '#fffbeb' },
  low: { label: 'Baseline', color: '#16a34a', bg: '#f0fdf4' },
}
