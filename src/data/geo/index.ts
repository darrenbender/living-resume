// North America admin-1 boundaries (US states + Canadian provinces), derived
// from Natural Earth 1:50m public-domain data, filtered to US + Canada, with
// coordinates rounded and properties stripped to keep the payload small.
// Hawaii is omitted so a US+Canada frame isn't distorted by the mid-Pacific.
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import raw from './na-admin1.json'

export interface NAProps {
  /** Full name, e.g. "California" / "Ontario". */
  name: string
  /** Two-letter postal code, e.g. "CA" / "ON" — matches STATES keys for US. */
  postal: string
  /** Country: US state or CA province. */
  admin: 'US' | 'CA'
}

export const naGeo = raw as unknown as FeatureCollection<Polygon | MultiPolygon, NAProps>
