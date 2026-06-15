<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import type { LifePhoto } from '~/data/lifeProvinces'
import { hasProvinceLife } from '~/data/lifeProvinces'
import {
  chinaGeoJson,
  chinaMapPaths,
  provinceByAdcode,
  provinceByName,
} from '~/data/chinaMapPaths'

const props = defineProps<{
  hoveredAdcode?: string | null
  activePhotos?: LifePhoto[]
}>()

const emit = defineEmits<{
  hover: [adcode: string, name: string]
  leave: []
  select: [adcode: string, name: string]
  photoClick: [noteIndex: number]
}>()

const MAP_NAME = 'china-life'

const chartRef = ref<HTMLDivElement | null>(null)
const mapReady = ref(false)

let chart: ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const visitedRegions = chinaMapPaths
  .filter(province => hasProvinceLife(province.adcode))
  .map(province => ({
    name: province.name,
    itemStyle: {
      areaColor: '#ddd4c8',
      borderColor: '#f8fafc',
    },
  }))

function buildScatterData() {
  if (!props.hoveredAdcode || !props.activePhotos?.length)
    return []

  const province = provinceByAdcode[props.hoveredAdcode]
  if (!province)
    return []

  const [lng, lat] = province.lngLat
  const offsets: [number, number][] = [
    [0.85, 0.55],
    [-1.05, 0.85],
    [0.15, -1.05],
  ]

  return props.activePhotos.slice(0, 3).map((photo, index) => {
    const [dx, dy] = offsets[index] ?? [0, 0]
    return {
      name: photo.caption,
      value: [lng + dx, lat + dy] as [number, number],
      symbol: `image://${photo.url}`,
      symbolSize: [60, 44],
      itemStyle: {
        shadowBlur: 12,
        shadowColor: 'rgba(30, 41, 59, 0.22)',
      },
    }
  })
}

function buildOption(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: { show: false },
    geo: {
      map: MAP_NAME,
      roam: false,
      zoom: 1.2,
      layoutCenter: ['50%', '50%'],
      layoutSize: '100%',
      label: { show: false },
      itemStyle: {
        areaColor: '#ebe6df',
        borderColor: '#ffffff',
        borderWidth: 1.2,
        shadowColor: 'rgba(100, 116, 139, 0.14)',
        shadowBlur: 14,
        shadowOffsetY: 5,
      },
      emphasis: {
        focus: 'self',
        label: {
          show: true,
          color: '#1e293b',
          fontSize: 12,
          fontWeight: 500,
        },
        itemStyle: {
          areaColor: '#8fa3b8',
          borderColor: '#f8fafc',
          borderWidth: 1.5,
          shadowColor: 'rgba(30, 41, 59, 0.3)',
          shadowBlur: 24,
          shadowOffsetY: 8,
        },
      },
      select: {
        label: {
          show: true,
          color: '#1e293b',
          fontSize: 12,
        },
        itemStyle: {
          areaColor: '#7d91a6',
          borderColor: '#f8fafc',
          borderWidth: 1.5,
        },
      },
      regions: visitedRegions,
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: buildScatterData(),
        z: 10,
        animationDurationUpdate: 260,
        animationEasingUpdate: 'cubicOut',
      },
    ],
  }
}

function updateScatter() {
  chart?.setOption({
    series: [{ data: buildScatterData() }],
  })
}

function syncSelection() {
  if (!chart)
    return

  chart.dispatchAction({ type: 'unselect', geoIndex: 0 })

  if (!props.hoveredAdcode)
    return

  const province = provinceByAdcode[props.hoveredAdcode]
  if (!province)
    return

  chart.dispatchAction({
    type: 'select',
    geoIndex: 0,
    name: province.name,
  })
}

async function initChart() {
  if (!chartRef.value || chart)
    return

  const echarts = await import('echarts')

  echarts.registerMap(MAP_NAME, chinaGeoJson as never)

  chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  chart.setOption(buildOption())

  chart.on('mouseover', (params) => {
    if (params.componentType === 'geo' && params.name) {
      const province = provinceByName[String(params.name)]
      if (province)
        emit('hover', province.adcode, province.name)
    }
  })

  chart.on('globalout', () => {
    emit('leave')
  })

  chart.on('click', (params) => {
    if (params.componentType === 'series' && params.seriesType === 'scatter') {
      emit('photoClick', 0)
      return
    }

    if (params.componentType === 'geo' && params.name) {
      const province = provinceByName[String(params.name)]
      if (province)
        emit('select', province.adcode, province.name)
    }
  })

  resizeObserver = new ResizeObserver(() => {
    chart?.resize()
  })
  resizeObserver.observe(chartRef.value)
  mapReady.value = true
}

watch(() => props.hoveredAdcode, () => {
  updateScatter()
  syncSelection()
})

watch(
  () => props.activePhotos,
  () => updateScatter(),
  { deep: true },
)

onMounted(() => {
  void initChart()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div class="china-map" :class="{ 'china-map--ready': mapReady }">
    <div ref="chartRef" class="china-map__chart" role="img" aria-label="中国省份地图" />
  </div>
</template>

<style scoped>
.china-map {
  width: 100%;
  max-width: min(72rem, 96vw);
  margin: 0 auto;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.china-map--ready {
  opacity: 1;
}

.china-map__chart {
  width: 100%;
  height: min(78vh, 52rem);
  min-height: 28rem;
}
</style>
