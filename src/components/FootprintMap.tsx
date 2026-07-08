import { useMemo, useState } from 'react'
import { geoAlbers, geoPath, geoCentroid } from 'd3-geo'
import { naGeo } from '../data/geo'
import { STATES, TIER } from '../data/jurisdictions'
import { ACCENT, ACCENT_DARK } from '../theme'

const WIDTH = 820
const HEIGHT = 520
const PAD = 16

// Non-active geography styling.
const CANADA_FILL = '#ecfeff' // live footprint, but no per-province sample data
const CANADA_STROKE = '#67e8f9'
const NEUTRAL_FILL = '#f1f5f9' // US states with no sample brief ("not in sample")
const NEUTRAL_STROKE = '#e2e8f0'
const MEXICO_FILL = '#eef1f4' // adjacent market — present but not operated
const MEXICO_STROKE = '#cbd5e1'

interface Props {
  selected: string
  onSelect: (code: string) => void
}

interface Shape {
  key: string
  code: string
  name: string
  admin: 'US' | 'CA' | 'MX'
  active: boolean
  d: string
}

// A geography carries a sample brief when its postal code is in STATES and the
// country matches (US state vs. Canadian province — guards against any code
// collision between the two sets). Mexico is never active.
function isActive(admin: 'US' | 'CA' | 'MX', code: string): boolean {
  if (admin === 'MX' || !(code in STATES)) return false
  const isCanadaData = STATES[code].country === 'CA'
  return admin === 'CA' ? isCanadaData : !isCanadaData
}

export default function FootprintMap({ selected, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  // Projection + path geometry are static — compute once.
  const { shapes, labels, mexicoLabel } = useMemo(() => {
    const projection = geoAlbers()
      .rotate([98, 0])
      .parallels([29.5, 49.5])
      .fitExtent(
        [
          [PAD, PAD],
          [WIDTH - PAD, HEIGHT - PAD],
        ],
        naGeo,
      )
    const path = geoPath(projection)

    const shapes: Shape[] = naGeo.features.map((f, i) => {
      const code = f.properties.postal
      const active = isActive(f.properties.admin, code)
      return {
        key: `${f.properties.admin}-${code}-${i}`,
        code,
        name: f.properties.name,
        admin: f.properties.admin,
        active,
        d: path(f) ?? '',
      }
    })

    // Place the two-letter code at the centroid of each active jurisdiction.
    const labels = naGeo.features
      .filter((f) => isActive(f.properties.admin, f.properties.postal))
      .map((f) => {
        const [x, y] = projection(geoCentroid(f)) ?? [0, 0]
        return { code: f.properties.postal, x, y }
      })

    // A single muted "Mexico" label anchored to central Mexico (~23°N, 102°W).
    const [mx, my] = projection([-102, 23]) ?? [0, 0]
    const mexicoLabel = { x: mx, y: my }

    return { shapes, labels, mexicoLabel }
  }, [])

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Map of US states and Canadian provinces (active, shaded by risk tier), with Mexico shown greyed-out as an adjacent market with no current operations"
    >
      {shapes.map((s) => {
        const isSelected = s.active && s.code === selected
        const isHovered = s.active && s.code === hovered
        const isMexico = s.admin === 'MX'

        let fill = NEUTRAL_FILL
        let stroke = NEUTRAL_STROKE
        if (s.active) {
          const t = TIER[STATES[s.code].tier]
          fill = t.bg
          stroke = t.color
        } else if (s.admin === 'CA') {
          fill = CANADA_FILL
          stroke = CANADA_STROKE
        } else if (isMexico) {
          fill = MEXICO_FILL
          stroke = MEXICO_STROKE
        }

        return (
          <path
            key={s.key}
            d={s.d}
            fill={isSelected ? ACCENT : fill}
            stroke={isSelected ? ACCENT_DARK : stroke}
            strokeWidth={isSelected ? 1.8 : isMexico ? 1 : 0.6}
            strokeDasharray={isMexico ? '4 3' : undefined}
            style={{
              cursor: s.active ? 'pointer' : 'default',
              opacity: isMexico ? 0.6 : isHovered ? 0.82 : 1,
              transition: 'fill .12s, opacity .12s',
              outline: 'none',
            }}
            onClick={s.active ? () => onSelect(s.code) : undefined}
            onMouseEnter={s.active ? () => setHovered(s.code) : undefined}
            onMouseLeave={s.active ? () => setHovered(null) : undefined}
          >
            <title>
              {isMexico
                ? 'Mexico — no current operations / adjacent market'
                : `${s.name}${s.active ? ` — ${STATES[s.code].flags.length} sample flags` : ''}`}
            </title>
          </path>
        )
      })}

      {labels.map((l) => (
        <text
          key={l.code}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 11,
            fontWeight: 700,
            fill: l.code === selected ? 'white' : '#334155',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {l.code}
        </text>
      ))}

      <text
        x={mexicoLabel.x}
        y={mexicoLabel.y}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 12,
          fontWeight: 600,
          fill: '#94a3b8',
          letterSpacing: 0.5,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        Mexico
      </text>
    </svg>
  )
}
