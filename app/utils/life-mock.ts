export interface LifePhoto {
  url: string
  caption: string
}

export interface LifeEntry {
  title: string
  note: string
  photos: LifePhoto[]
}

/** 前端占位数据，后续由后端 API 替换 */
export const LIFE_PROVINCE_DATA: Record<string, LifeEntry> = {
  北京市: {
    title: '北京 · 初雪',
    note: '红墙白雪，胡同里飘着糖葫芦的甜香。',
    photos: [
      { url: '/images/beijing.jpg', caption: '故宫角楼' },
      { url: 'https://picsum.photos/seed/bj-hutong/480/360', caption: '胡同午后' },
      { url: 'https://picsum.photos/seed/bj-park/480/360', caption: '北海公园' },
    ],
  },
  上海市: {
    title: '上海 · 夜风',
    note: '外滩的灯一盏盏亮起，江风把故事吹得很轻。',
    photos: [
      { url: 'https://picsum.photos/seed/sh-bund/480/360', caption: '外滩夜景' },
      { url: 'https://picsum.photos/seed/sh-lane/480/360', caption: '弄堂深处' },
    ],
  },
  浙江省: {
    title: '浙江 · 江南',
    note: '小桥流水，油纸伞下是一段慢时光。',
    photos: [
      { url: 'https://picsum.photos/seed/zj-water/480/360', caption: '乌镇晨雾' },
      { url: 'https://picsum.photos/seed/zj-tea/480/360', caption: '龙井茶园' },
      { url: 'https://picsum.photos/seed/zj-bridge/480/360', caption: '石拱桥' },
    ],
  },
  四川省: {
    title: '四川 · 烟火',
    note: '火锅沸腾，熊猫打盹，巴适得板。',
    photos: [
      { url: 'https://picsum.photos/seed/sc-panda/480/360', caption: '滚滚日常' },
      { url: 'https://picsum.photos/seed/sc-hotpot/480/360', caption: '巷口火锅' },
    ],
  },
  广东省: {
    title: '广东 · 早茶',
    note: '一盅两件，晨光里开启元气满满的一天。',
    photos: [
      { url: 'https://picsum.photos/seed/gd-dimsum/480/360', caption: '早茶时光' },
      { url: 'https://picsum.photos/seed/gd-seaside/480/360', caption: '海边散步' },
    ],
  },
  云南省: {
    title: '云南 · 彩云',
    note: '苍山洱海，风里有花的味道。',
    photos: [
      { url: 'https://picsum.photos/seed/yn-flower/480/360', caption: '花海骑行' },
      { url: 'https://picsum.photos/seed/yn-lake/480/360', caption: '洱海日落' },
      { url: 'https://picsum.photos/seed/yn-oldtown/480/360', caption: '古城街角' },
    ],
  },
}

export function getLifeEntry(provinceName: string): LifeEntry {
  const existing = LIFE_PROVINCE_DATA[provinceName]
  if (existing)
    return existing

  const shortName = provinceName.replace(/(省|市|自治区|壮族|回族|维吾尔|特别行政区)/g, '')
  return {
    title: `${shortName} · 待补充`,
    note: '这里的故事还没写下，敬请期待～',
    photos: [
      { url: '/images/moren.png', caption: `${shortName} 一角` },
      { url: '/images/hero-sky.png', caption: '云游四方' },
    ],
  }
}
