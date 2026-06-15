export interface GeoFeature {
  type: 'Feature'
  properties: {
    adcode: number | string
    name: string
    centroid?: [number, number]
    center?: [number, number]
  }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

export interface GeoCollection {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

export interface MapBounds {
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
}

export interface ProvincePath {
  adcode: string
  name: string
  d: string
  centroid: [number, number]
  lngLat: [number, number]
}

function normalizeAdcode(adcode: number | string): string {
  return String(adcode).replace(/_JD$/, '')
}

function getRings(feature: GeoFeature): number[][][] {
  if (feature.geometry.type === 'Polygon')
    return feature.geometry.coordinates as number[][][]

  return (feature.geometry.coordinates as number[][][][]).flat()
}

export function computeBounds(features: GeoFeature[]): MapBounds {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  for (const feature of features) {
    for (const ring of getRings(feature)) {
      for (const [lng, lat] of ring) {
        minLng = Math.min(minLng, lng)
        maxLng = Math.max(maxLng, lng)
        minLat = Math.min(minLat, lat)
        maxLat = Math.max(maxLat, lat)
      }
    }
  }

  return { minLng, maxLng, minLat, maxLat }
}

export function createProjector(bounds: MapBounds, width: number, height: number, padding = 12) {
  const lngSpan = bounds.maxLng - bounds.minLng || 1
  const latSpan = bounds.maxLat - bounds.minLat || 1
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const scale = Math.min(innerWidth / lngSpan, innerHeight / latSpan)

  const projectedWidth = lngSpan * scale
  const projectedHeight = latSpan * scale
  const offsetX = padding + (innerWidth - projectedWidth) / 2
  const offsetY = padding + (innerHeight - projectedHeight) / 2

  return (lng: number, lat: number): [number, number] => {
    const x = offsetX + (lng - bounds.minLng) * scale
    const y = offsetY + (bounds.maxLat - lat) * scale
    return [x, y]
  }
}

function ringToPath(ring: number[][], project: (lng: number, lat: number) => [number, number]): string {
  return ring
    .map(([lng, lat], index) => {
      const [x, y] = project(lng, lat)
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
    + ' Z'
}

export function featureToPath(feature: GeoFeature, project: (lng: number, lat: number) => [number, number]): string {
  return getRings(feature)
    .map(ring => ringToPath(ring, project))
    .join(' ')
}

export function buildProvincePaths(
  collection: GeoCollection,
  width: number,
  height: number,
): ProvincePath[] {
  const features = collection.features.filter(feature => !String(feature.properties.adcode).endsWith('_JD'))
  const bounds = computeBounds(features)
  const project = createProjector(bounds, width, height)

  return features.map((feature) => {
    const adcode = normalizeAdcode(feature.properties.adcode)
    const centroidSource = feature.properties.centroid ?? feature.properties.center ?? [105, 35]
    const [cx, cy] = project(centroidSource[0], centroidSource[1])

    return {
      adcode,
      name: feature.properties.name,
      d: featureToPath(feature, project),
      centroid: [cx, cy],
      lngLat: [centroidSource[0], centroidSource[1]],
    }
  })
}
