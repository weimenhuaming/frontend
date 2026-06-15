import chinaGeo from './china-provinces.json'
import { buildProvincePaths, type GeoCollection } from '~/utils/chinaMap'

export const CHINA_MAP_WIDTH = 900
export const CHINA_MAP_HEIGHT = 760

export const chinaMapPaths = buildProvincePaths(
  chinaGeo as GeoCollection,
  CHINA_MAP_WIDTH,
  CHINA_MAP_HEIGHT,
)

export const provinceByAdcode = Object.fromEntries(
  chinaMapPaths.map(province => [province.adcode, province]),
)

export const provinceByName = Object.fromEntries(
  chinaMapPaths.map(province => [province.name, province]),
)

export { chinaGeo as chinaGeoJson }
