// North America boundaries, derived from Natural Earth public-domain data:
// US states + Canadian provinces (1:50m admin-1) plus Mexico as a single
// greyed country outline (1:110m admin-0 — a non-interactive "adjacent market"
// backdrop). Coordinates rounded and properties stripped to keep it small.
// Hawaii is omitted so the North America frame isn't distorted by the Pacific.
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import raw from './na-admin1.json'

export interface NAProps {
  /** Full name, e.g. "California" / "Ontario" / "Mexico". */
  name: string
  /** Two-letter postal code, e.g. "CA" / "ON" — matches STATES keys for US/CA. */
  postal: string
  /** US state, Canadian province, or Mexico (inactive backdrop). */
  admin: 'US' | 'CA' | 'MX'
}

export const naGeo = raw as unknown as FeatureCollection<Polygon | MultiPolygon, NAProps>
