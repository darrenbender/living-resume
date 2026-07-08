import { useMemo, useState } from 'react'
import { geoAlbers, geoPath, geoCentroid } from 'd3-geo'
import { naGeo } from '../data/geo'
import { STATES, TIER } from '../data/jurisdictions'

const WIDTH = 820
const HEIGHT = 500
const PAD = 16

// Non-active geography styling.
const CANADA_FILL = '#ecfeff' // live footprint, but no per-province sample data
const CANADA_STROKE = '#67e8f9'
const NEUTRAL_FILL = '#f1f5f9' // US states with no sample brief ("not in sample")
const NEUTRAL_STROKE = '#e2e8f0'
const SELECTED = '#0f172a'

interface Props {
  selected: string
  onSelect: (code: string) => void
}

interface Shape {
  key: string
  code: string
  name: string
  admin: 'US' | 'CA'
  active: boolean
  d: string
}

export default function FootprintMap({ selected, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  // Projection + path geometry are static — compute once.
  const { shapes, labels } = useMemo(() => {
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
      const active = f.properties.admin === 'US' && code in STATES
      return {
        key: `${f.properties.admin}-${code}-${i}`,
        code,
        name: f.properties.name,
        admin: f.properties.admin,
        active,
        d: path(f) ?? '',
      }
    })

    // Place the two-letter code at the centroid of each active state.
    const labels = naGeo.features
      .filter((f) => f.properties.admin === 'US' && f.properties.postal in STATES)
      .map((f) => {
        const [x, y] = projection(geoCentroid(f)) ?? [0, 0]
        return { code: f.properties.postal, x, y }
      })

    return { shapes, labels }
  }, [])

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Map of US states and Canadian provinces; sample jurisdictions are shaded by risk tier"
    >
      {shapes.map((s) => {
        const isSelected = s.active && s.code === selected
        const isHovered = s.active && s.code === hovered

        let fill = NEUTRAL_FILL
        let stroke = NEUTRAL_STROKE
        if (s.active) {
          const t = TIER[STATES[s.code].tier]
          fill = t.bg
          stroke = t.color
        } else if (s.admin === 'CA') {
          fill = CANADA_FILL
          stroke = CANADA_STROKE
        }

        return (
          <path
            key={s.key}
            d={s.d}
            fill={isSelected ? SELECTED : fill}
            stroke={isSelected ? SELECTED : stroke}
            strokeWidth={isSelected ? 1.6 : 0.6}
            style={{
              cursor: s.active ? 'pointer' : 'default',
              opacity: isHovered ? 0.82 : 1,
              transition: 'fill .12s, opacity .12s',
              outline: 'none',
            }}
            onClick={s.active ? () => onSelect(s.code) : undefined}
            onMouseEnter={s.active ? () => setHovered(s.code) : undefined}
            onMouseLeave={s.active ? () => setHovered(null) : undefined}
          >
            <title>
              {s.name}
              {s.active ? ` — ${STATES[s.code].flags.length} sample flags` : ''}
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
    </svg>
  )
}
