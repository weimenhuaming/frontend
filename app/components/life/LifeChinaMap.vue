<script setup lang="ts">
import * as echarts from 'echarts'
import type { ECElementEvent } from 'echarts'

export interface ProvinceSelectPayload {
  name: string
  x: number
  y: number
}

const emit = defineEmits<{
  select: [payload: ProvinceSelectPayload | null]
}>()

const chartRef = ref<HTMLElement | null>(null)

let chart: echarts.ECharts | null = null
let pinnedName: string | null = null
let hoverName: string | null = null
const provinceCenters = new Map<string, [number, number]>()

const CARTOON_COLORS = [
  '#ffe4ec', '#e0f7fa', '#fff9c4', '#f3e5f5', '#e8f5e9',
  '#ffecb3', '#b3e5fc', '#fce4ec', '#dcedc8', '#ffe0b2',
  '#e1bee7', '#c5cae9', '#b2dfdb', '#f8bbd0', '#fff59d',
  '#ffccbc', '#d1c4e9', '#b2ebf2',
]

function getPixel(name: string): ProvinceSelectPayload | null {
  const center = provinceCenters.get(name)
  if (!center || !chart || !chartRef.value)
    return null

  const pixel = chart.convertToPixel({ geoIndex: 0 }, center)
  if (!pixel)
    return null

  const rect = chartRef.value.getBoundingClientRect()
  return {
    name,
    x: rect.left + pixel[0],
    y: rect.top + pixel[1],
  }
}

function emitCurrent() {
  const name = hoverName ?? pinnedName
  if (!name) {
    emit('select', null)
    return
  }
  emit('select', getPixel(name))
}

function onResize() {
  chart?.resize()
  emitCurrent()
}

async function initMap() {
  if (!chartRef.value)
    return

  const geoJson = await $fetch<{
    features: Array<{
      properties: { name: string, center?: [number, number], centroid?: [number, number] }
    }>
  }>('/data/china.json')

  for (const feature of geoJson.features) {
    const props = feature.properties as { name?: string, center?: [number, number], centroid?: [number, number] }
    if (props?.name) {
      const center = props.center ?? props.centroid
      if (center)
        provinceCenters.set(props.name, center)
    }
  }

  echarts.registerMap('china', geoJson as Parameters<typeof echarts.registerMap>[1])

  chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })

  const regionData = geoJson.features.map((feature, index) => {
    const props = feature.properties as { name: string }
    return {
      name: props.name,
      itemStyle: {
        areaColor: CARTOON_COLORS[index % CARTOON_COLORS.length],
      },
    }
  })

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgb(255 255 255 / 92%)',
      borderColor: '#ff8fab',
      borderWidth: 2,
      padding: [10, 14],
      textStyle: {
        color: '#5a4a6a',
        fontSize: 13,
        fontWeight: 600,
      },
      formatter: (params: { name?: string }) => `${params.name ?? ''}<br/><span style="color:#9ca3af;font-weight:400;font-size:12px">点击查看生活小记</span>`,
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.12,
      layoutCenter: ['50%', '54%'],
      layoutSize: '92%',
      label: { show: false },
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2.5,
        shadowColor: 'rgb(255 143 171 / 35%)',
        shadowBlur: 16,
        shadowOffsetY: 6,
      },
      emphasis: {
        label: {
          show: true,
          color: '#6b5b7b',
          fontSize: 13,
          fontWeight: 700,
        },
        itemStyle: {
          areaColor: '#ffd6e8',
          borderColor: '#ff8fab',
          borderWidth: 3.5,
          shadowBlur: 22,
          shadowColor: 'rgb(255 143 171 / 45%)',
        },
      },
      select: {
        itemStyle: {
          areaColor: '#ffb3c6',
          borderColor: '#ff6b9d',
          borderWidth: 4,
        },
        label: {
          show: true,
          color: '#5a4a6a',
          fontWeight: 800,
        },
      },
      regions: regionData,
    },
    series: [
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: regionData,
        selectedMode: 'single',
      },
    ],
  })

  chart.on('mouseover', (params: ECElementEvent) => {
    if (!params.name)
      return
    hoverName = params.name
    emitCurrent()
  })

  chart.on('mouseout', () => {
    hoverName = null
    emitCurrent()
  })

  chart.on('click', (params: ECElementEvent) => {
    if (!params.name)
      return
    pinnedName = pinnedName === params.name ? null : params.name
    if (pinnedName)
      hoverName = pinnedName
    emitCurrent()
  })

  chart.on('georoam', () => {
    requestAnimationFrame(emitCurrent)
  })

  window.addEventListener('resize', onResize)
}

onMounted(() => {
  void initMap()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="chartRef" class="life-map" />
</template>

<style scoped>
.life-map {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
