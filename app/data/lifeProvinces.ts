export interface LifePhoto {
  url: string
  caption: string
}

export interface LifeNote {
  date: string
  title: string
  content: string
}

export interface ProvinceLife {
  adcode: string
  name: string
  subtitle: string
  attractions: string[]
  photos: LifePhoto[]
  notes: LifeNote[]
}

function photo(seed: string, caption: string): LifePhoto {
  return {
    url: `https://picsum.photos/seed/${seed}/640/480`,
    caption,
  }
}

export const provinceLifeData: Record<string, ProvinceLife> = {
  '110000': {
    adcode: '110000',
    name: '北京市',
    subtitle: '胡同、书店与深夜代码',
    attractions: ['故宫博物院', '颐和园', '南锣鼓巷', '798 艺术区'],
    photos: [
      photo('beijing-1', '故宫角楼，清晨的第一缕光'),
      photo('beijing-2', '五道营胡同里的一家小咖啡馆'),
      photo('beijing-3', '什刹海边的傍晚散步'),
    ],
    notes: [
      {
        date: '2024-10-02',
        title: '秋日的北平',
        content: '北京最舒服的季节莫过于初秋。风里有桂花香，天蓝得不像话。沿着护城河走一圈，觉得这座城市也没那么匆忙。',
      },
    ],
  },
  '310000': {
    adcode: '310000',
    name: '上海市',
    subtitle: '梧桐区与江边的风',
    attractions: ['外滩', '武康路', '豫园', '迪士尼度假区'],
    photos: [
      photo('shanghai-1', '武康路梧桐树影'),
      photo('shanghai-2', '外滩夜景与江风'),
      photo('shanghai-3', '愚园路的一家 Brunch'),
    ],
    notes: [
      {
        date: '2024-08-11',
        title: '梅雨季的上海',
        content: '雨后的武康路湿漉漉的，梧桐叶滴着水。找家小店吃碗本帮面，忽然觉得这座城市的精致里也有烟火气。',
      },
    ],
  },
  '330000': {
    adcode: '330000',
    name: '浙江省',
    subtitle: '西湖、茶田与江南慢生活',
    attractions: ['西湖', '乌镇', '千岛湖', '普陀山'],
    photos: [
      photo('zhejiang-1', '西湖断桥残雪'),
      photo('zhejiang-2', '龙井村茶园晨雾'),
      photo('zhejiang-3', '乌镇水乡夜色'),
    ],
    notes: [
      {
        date: '2024-04-05',
        title: '清明游西湖',
        content: '人很多，但坐在湖边看柳条垂进水里，心就静下来了。雷峰塔在薄雾里若隐若现，像一幅水墨画。',
      },
    ],
  },
  '510000': {
    adcode: '510000',
    name: '四川省',
    subtitle: '火锅、熊猫与雪山',
    attractions: ['九寨沟', '峨眉山', '都江堰', '大熊猫基地'],
    photos: [
      photo('sichuan-1', '成都宽窄巷子'),
      photo('sichuan-2', '大熊猫基地的团子'),
      photo('sichuan-3', '稻城亚丁的雪山草甸'),
    ],
    notes: [
      {
        date: '2023-12-28',
        title: '在成都过冬',
        content: '成都的冬天不算冷，街头到处都是火锅的香气。晚上去玉林路小酌，听街头艺人唱歌，觉得幸福很简单。',
      },
    ],
  },
  '440000': {
    adcode: '440000',
    name: '广东省',
    subtitle: '早茶、海边与烟火气',
    attractions: ['广州塔', '丹霞山', '开平碉楼', '南澳岛'],
    photos: [
      photo('guangdong-1', '广州早茶一盅两件'),
      photo('guangdong-2', '深圳湾日落'),
      photo('guangdong-3', '潮汕牛肉火锅'),
    ],
    notes: [
      {
        date: '2024-01-28',
        title: '广州的早晨从早茶开始',
        content: '虾饺、烧卖、凤爪、肠粉……一笼接一笼，茶水续了又续。广东人的悠闲，藏在早茶里。',
      },
    ],
  },
  '530000': {
    adcode: '530000',
    name: '云南省',
    subtitle: '苍山洱海与古城慢时光',
    attractions: ['大理古城', '丽江古城', '玉龙雪山', '泸沽湖'],
    photos: [
      photo('yunnan-1', '大理洱海边骑行'),
      photo('yunnan-2', '丽江古城石板路'),
      photo('yunnan-3', '香格里拉的松赞林寺'),
    ],
    notes: [
      {
        date: '2023-07-08',
        title: '大理的风',
        content: '洱海边骑行，风很大，阳光很烈。傍晚在古城吃菌子火锅，满天星星，觉得远方也不过如此。',
      },
    ],
  },
  '610000': {
    adcode: '610000',
    name: '陕西省',
    subtitle: '城墙、博物馆与面食',
    attractions: ['兵马俑', '华山', '大雁塔', '回民街'],
    photos: [
      photo('shaanxi-1', '西安城墙骑行'),
      photo('shaanxi-2', '兵马俑博物馆'),
      photo('shaanxi-3', '回民街肉夹馍'),
    ],
    notes: [
      {
        date: '2024-03-12',
        title: '长安一日',
        content: '在城墙上骑了一圈，俯瞰这座千年古都。博物馆里与历史对视，晚上一碗油泼面，满足。',
      },
    ],
  },
}

const defaultAttractions = ['自然风光', '人文古迹', '特色美食']

export function getProvinceLife(adcode: string, name = ''): ProvinceLife {
  const existing = provinceLifeData[adcode]
  if (existing)
    return existing

  const provinceName = name || '这里'
  return {
    adcode,
    name: provinceName,
    subtitle: '等待探索的远方',
    attractions: defaultAttractions,
    photos: [
      photo(`explore-${adcode}-1`, `${provinceName}印象`),
      photo(`explore-${adcode}-2`, `${provinceName}街景`),
      photo(`explore-${adcode}-3`, `${provinceName}风光`),
    ],
    notes: [
      {
        date: '',
        title: '尚未记录',
        content: `${provinceName}的足迹尚待书写。期待下一次旅行，留下照片与生活笔记。`,
      },
    ],
  }
}

export function hasProvinceLife(adcode: string): boolean {
  return adcode in provinceLifeData
}

export const visitedProvinceCount = Object.keys(provinceLifeData).length
