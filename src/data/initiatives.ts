// ── PRODUCT WORKSTREAM (IN FLIGHT) ──────────────────────────────────────
// Active product-development initiatives named in the role brief. Caper Carts
// and Storefront Pro are real Instacart products; a Claude-powered shopping
// assistant is an illustrative AI initiative. The issue-spots, regimes, and
// backlog here are illustrative sample material, not legal advice.

import { ShoppingCart, Store, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DomainKey } from './jurisdictions'

export type LawTone = 'high' | 'med' | 'low'
export type StatusKey = 'Open' | 'In review' | 'Drafting'

export interface InitiativeLaw {
  label: string
  tone: LawTone
}

export interface BacklogItem {
  item: string
  status: StatusKey
  /** Domain key — reuses DOMAINS colors for the row dot. */
  domain: DomainKey
}

export interface Initiative {
  name: string
  tag: string
  icon: LucideIcon
  color: string
  what: string
  laws: InitiativeLaw[]
  backlog: BacklogItem[]
  /** Illustrative contract-playbook name, or null when none. */
  playbook: string | null
}

export const INITIATIVES: Initiative[] = [
  {
    name: 'Caper Carts', tag: 'AI smart cart · in-store', icon: ShoppingCart, color: '#0891b2',
    what: 'AI-vision smart carts: onboard cameras and a certified scale recognize items, an on-cart screen serves retail-media ads, and shoppers check out in the cart.',
    laws: [
      { label: 'Biometric privacy · BIPA', tone: 'high' },
      { label: 'Precise geolocation', tone: 'high' },
      { label: 'Weights & measures · NTEP', tone: 'med' },
      { label: 'Payments · PCI DSS', tone: 'med' },
      { label: 'Retail-media disclosure', tone: 'med' },
      { label: 'Alcohol age-gate', tone: 'high' },
      { label: 'ADA touchscreen', tone: 'low' },
    ],
    backlog: [
      { item: 'Camera notice + BIPA written-consent flow as an Illinois rollout gate', status: 'Drafting', domain: 'privacy' },
      { item: 'Per-state weights-&-measures certification for in-cart scale pricing', status: 'Open', domain: 'consumer' },
      { item: '"Sponsored" labeling standard for on-cart ads with the retail-media team', status: 'In review', domain: 'advertising' },
      { item: 'Age-verification + attendant hand-off spec for alcohol SKUs', status: 'Open', domain: 'alcohol' },
    ],
    playbook: null,
  },
  {
    name: 'Storefront Pro', tag: 'Enterprise SaaS · partnerships', icon: Store, color: '#7c3aed',
    what: 'White-label e-commerce platform licensed to retailers to run their own branded online stores on Instacart infrastructure.',
    laws: [
      { label: 'Controller / processor split', tone: 'high' },
      { label: 'CCPA service-provider terms', tone: 'med' },
      { label: 'IP & license scope', tone: 'med' },
      { label: 'Liability caps / indemnity', tone: 'med' },
      { label: 'ADA · WCAG storefronts', tone: 'low' },
    ],
    backlog: [
      { item: 'Retailer MSA + DPA — negotiate data-breach & IP carve-outs from the liability cap', status: 'In review', domain: 'consumer' },
      { item: 'Processor vs. service-provider characterization across CCPA and GDPR', status: 'Drafting', domain: 'privacy' },
      { item: 'Compliance-responsibility matrix: who owns pricing, ads and returns per storefront', status: 'Open', domain: 'advertising' },
    ],
    playbook: 'Retailer Partnership Playbook · MSA · DPA · ad-inventory addendum',
  },
  {
    name: 'Instacart in Claude', tag: 'Agentic connector · Anthropic Claude', icon: Sparkles, color: '#d97706',
    what: `Instacart's agentic shopping integration inside Anthropic's Claude: Claude turns natural-language and recipe requests into a filled Instacart cart — and deliberately stops at the cart rather than embedding checkout.`,
    laws: [
      { label: 'AI vendor DPA', tone: 'high' },
      { label: 'Dietary / health disclaimers', tone: 'high' },
      { label: 'Substantiation of AI claims', tone: 'med' },
      { label: 'Sponsored-ranking disclosure', tone: 'med' },
      { label: 'Training-data / IP terms', tone: 'med' },
      { label: 'AI transparency to users', tone: 'low' },
    ],
    backlog: [
      { item: 'Model-vendor DPA — no training on Instacart or customer data; output-liability allocation', status: 'Drafting', domain: 'privacy' },
      { item: 'Guardrails + disclaimers for dietary/allergen answers (assistant, not medical advice)', status: 'Open', domain: 'consumer' },
      { item: 'Disclose when AI suggestions reflect paid placement / retail media', status: 'In review', domain: 'advertising' },
    ],
    playbook: 'AI Vendor Playbook · model DPA · no-train clause · output-liability terms',
  },
]

export const LAW_TONE: Record<LawTone, { color: string; bg: string; border: string }> = {
  high: { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
  med: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  low: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
}

export const STATUS: Record<StatusKey, { color: string; bg: string }> = {
  Open: { color: '#64748b', bg: '#f1f5f9' },
  'In review': { color: '#b45309', bg: '#fffbeb' },
  Drafting: { color: '#1d4ed8', bg: '#eff6ff' },
}
