import { useState, useEffect } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { X, Send, Check, ShoppingCart } from 'lucide-react'
import { ACCENT, ACCENT_DARK } from '../theme'

// ── Web3Forms access key ────────────────────────────────────────────────
// This key is SAFE to commit publicly — it does NOT reveal the destination
// email address. Create one free at https://web3forms.com (enter your email,
// they send you the key), then replace the placeholder below.
const WEB3FORMS_ACCESS_KEY = '6b2f215b-cec3-46f4-aef1-dc5009d62999'
const CONFIGURED = /^[0-9a-f]{8}-[0-9a-f-]{20,}$/i.test(WEB3FORMS_ACCESS_KEY)

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputStyle: CSSProperties = {
  width: '100%',
  fontSize: 13.5,
  color: '#0f172a',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '9px 11px',
  outline: 'none',
}

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  // Close on Escape; reset to a fresh form each time it opens.
  useEffect(() => {
    if (!open) return
    setStatus('idle')
    setError('')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('botcheck')) return // honeypot — silently drop bots
    if (!CONFIGURED) {
      setStatus('error')
      setError('Messaging isn’t wired up yet — please try again shortly.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'Product Counsel — Darren Bender',
          from_name: 'Product Counsel Demo',
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      })
      const json = await res.json()
      if (json.success) setStatus('sent')
      else {
        setStatus('error')
        setError(json.message || 'Something went wrong — please try again.')
      }
    } catch {
      setStatus('error')
      setError('Network error — please try again.')
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 60 }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Contact Darren Bender" style={{ background: 'white', borderRadius: 14, maxWidth: 460, width: '100%', padding: 24, maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} color={ACCENT} />
            <div style={{ fontSize: 18, fontWeight: 700 }}>Get in touch</div>
          </div>
          <X size={20} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={onClose} aria-label="Close" />
        </div>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '12px 4px 4px' }}>
            <div style={{ width: 46, height: 46, borderRadius: 999, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Check size={24} color={ACCENT_DARK} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Added to cart 🎉</div>
            <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>Thanks — your message is on its way to Darren. He'll get back to you at the email you provided.</div>
            <button onClick={onClose} style={{ marginTop: 18, width: '100%', background: ACCENT, color: 'white', border: 'none', borderRadius: 9, padding: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>Done</button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <p style={{ marginTop: 0, fontSize: 13, color: '#475569', lineHeight: 1.55 }}>Send Darren a note — it goes straight to him. Your email is used only so he can reply; it isn't shown anywhere.</p>

            {/* honeypot — hidden from humans */}
            <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', margin: '10px 0 4px' }}>Your name</label>
            <input name="name" required autoFocus autoComplete="name" style={inputStyle} placeholder="Jane Rivera" />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', margin: '12px 0 4px' }}>Your email</label>
            <input name="email" type="email" required autoComplete="email" style={inputStyle} placeholder="jane@company.com" />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', margin: '12px 0 4px' }}>Message</label>
            <textarea name="message" required rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} placeholder="Hi Darren — I'd love to talk about the Product Counsel role…" />

            {status === 'error' && (
              <div style={{ marginTop: 10, fontSize: 12.5, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 10px' }}>{error}</div>
            )}

            <button type="submit" disabled={status === 'sending'} style={{ marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: status === 'sending' ? '#94a3b8' : ACCENT, color: 'white', border: 'none', borderRadius: 9, padding: 12, cursor: status === 'sending' ? 'default' : 'pointer', fontSize: 14, fontWeight: 600 }}>
              {status === 'sending' ? 'Sending…' : (<>Send message <Send size={15} /></>)}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
