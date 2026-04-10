require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const reviewTemplates = {
  electronics: [
    "开机很快，系统流畅，电池续航比预期好",
    "做工精致，手感很好，物超所值",
    "性能强劲，日常使用完全够用",
    "屏幕显示效果清晰，色彩还原度高",
    "充电速度很快，一个小时就能充满",
    "信号稳定，通话清晰，网络速度很快",
    "拍照效果很不错，夜景模式很惊艳",
    "运行速度快，多任务切换无卡顿",
  ],
  gaming: [
    "游戏体验很好，画面流畅，操控手感棒",
    "到货包装完好，性能稳定，玩了好几个小时没有过热",
    "外观漂亮，操作顺畅，非常值得购买",
    "手柄握感很好，按键反馈清晰",
    "画面细腻，帧率稳定，沉浸感很强",
    "加载速度快，游戏体验提升很大",
    "散热效果不错，长时间使用也不烫手",
  ],
  clothing: [
    "面料很舒服，版型正，尺码偏大建议选小一码",
    "颜色和图片一致，做工细腻，洗后不缩水",
    "穿着舒适，透气性好，夏天穿很凉快",
    "款式百搭，日常穿搭都很合适",
    "面料柔软亲肤，不起球不掉色",
    "做工精细，走线整齐，质感很好",
    "版型好看，上身效果比预期还好",
    "弹性好，活动自如，穿着很轻松",
  ],
  shoes: [
    "鞋型很正，穿着舒适，缓震效果好",
    "质量不错，做工精细，穿了一个月没有任何问题",
    "颜值很高，上脚好看，跑步很舒适",
    "鞋底防滑效果好，抓地力强",
    "透气性很好，穿一天脚不闷",
    "轻便舒适，走路一点都不累",
    "包裹性好，脚感软弹，适合长时间穿着",
  ],
  home: [
    "安装简单，质量很好，用了两个月没有问题",
    "外观大方，做工扎实，性价比很高",
    "使用方便，效果很好，家人都很满意",
    "材质厚实，不易变形，放在家里很有格调",
    "实物比图片好看，朋友来了都夸好看",
    "收纳方便，不占空间，很实用",
    "功能齐全，操作简单，老人也能轻松使用",
  ],
  beauty: [
    "质地轻薄，上脸很服帖，味道清淡不刺激",
    "效果明显，皮肤变得更水润了，会回购",
    "包装精美，用量省，性价比很高",
    "温和不刺激，敏感肌也能放心用",
    "吸收很快，不油腻，清爽舒适",
    "用了一周皮肤明显变好了，持续回购中",
    "味道好闻，质地细腻，涂抹均匀",
  ],
  food: [
    "口感很好，新鲜美味，分量十足",
    "包装严实，没有破损，保质期很长",
    "味道正宗，跟实体店买的一样好吃",
    "送的很快，冷链运输没有化掉",
    "性价比高，量大实惠，全家都爱吃",
    "原料天然，吃着放心，小朋友也喜欢",
  ],
  sports: [
    "弹性好，防滑耐磨，运动时很稳定",
    "轻便透气，跑步时毫无负担",
    "材质结实，做工精细，专业级品质",
    "手感舒适，使用方便，适合日常锻炼",
    "外观帅气，功能实用，运动必备",
    "防水效果好，户外使用很放心",
  ],
  default: [
    "收到货物完好，质量符合预期，很满意",
    "卖家发货快，包装仔细，商品和描述一致",
    "性价比很高，下次还会购买",
    "做工不错，用料扎实，值这个价",
    "物流很快，两天就收到了，好评",
    "和预期一致，没有色差，推荐购买",
    "第二次购买了，品质一如既往的好",
    "朋友推荐的，果然没有让我失望",
  ]
}

const userNames = [
  "小***米", "大***王", "天***蓝", "快***乐", "阳***光",
  "星***辰", "海***风", "云***淡", "花***开", "月***明",
  "j***n", "m***k", "s***h", "a***z", "l***t",
  "r***d", "c***e", "b***y", "p***l", "d***s",
]

// 根据商品标题判断分类
function detectCategory(title) {
  const t = title.toLowerCase()

  if (/phone|iphone|samsung|galaxy|smartphone|android|mobile|cell\s?phone|huawei|xiaomi|pixel/.test(t)) return 'electronics'
  if (/laptop|computer|macbook|notebook|desktop|monitor|keyboard|mouse|printer|tablet|ipad/.test(t)) return 'electronics'
  if (/gaming|console|playstation|xbox|nintendo|switch|controller|gamepad|ps5|ps4/.test(t)) return 'gaming'
  if (/headphone|earphone|earbud|airpod|speaker|bluetooth|audio|wireless\s+ear/.test(t)) return 'electronics'
  if (/camera|gopro|drone|lens|tripod/.test(t)) return 'electronics'
  if (/watch|smartwatch|fitbit|garmin|apple\s+watch/.test(t)) return 'electronics'
  if (/shoe|sneaker|boot|sandal|slipper|jordan|nike|adidas|running\s+shoe|trainer/.test(t)) return 'shoes'
  if (/shirt|dress|jacket|coat|pant|jean|hoodie|sweater|blouse|skirt|clothing|fashion|t-shirt|polo|vest/.test(t)) return 'clothing'
  if (/bag|handbag|backpack|purse|wallet|luggage|tote/.test(t)) return 'clothing'
  if (/cream|serum|beauty|makeup|skincare|moisturizer|sunscreen|lipstick|foundation|mascara|perfume|cologne|lotion/.test(t)) return 'beauty'
  if (/furniture|sofa|table|chair|desk|lamp|shelf|bed|mattress|curtain|pillow|decor|rug|mirror/.test(t)) return 'home'
  if (/kitchen|appliance|blender|mixer|cooker|microwave|vacuum|iron|washer|dryer|fridge|refrigerator|air\s+condition/.test(t)) return 'home'
  if (/food|snack|chocolate|coffee|tea|candy|protein|vitamin|supplement|organic|spice|sauce/.test(t)) return 'food'
  if (/sport|fitness|gym|yoga|dumbbell|bicycle|bike|hiking|camping|outdoor|tent|fishing/.test(t)) return 'sports'
  if (/ball|basketball|football|soccer|tennis|golf|swim/.test(t)) return 'sports'

  return 'default'
}

function generateReviews(product) {
  const category = detectCategory(product.name)
  const templates = reviewTemplates[category] || reviewTemplates.default
  const count = Math.floor(Math.random() * 3) + 3 // 3-5 条

  const shuffled = [...templates].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)

  return selected.map(text => {
    const daysAgo = Math.floor(Math.random() * 90) + 1
    const date = new Date(Date.now() - daysAgo * 86400000)
    const rating = Math.random() > 0.3 ? 5 : 4 // 70% 五星，30% 四星

    return {
      username: userNames[Math.floor(Math.random() * userNames.length)],
      rating,
      text,
      date: date.toISOString().split('T')[0],
      verified: Math.random() > 0.25, // 75% verified
    }
  })
}

async function main() {
  console.log('=== 智能评论生成开始 ===\n')

  const products = await prisma.product.findMany({
    where: { name: { not: '__EBAY_PLACEHOLDER__' } },
    select: { id: true, name: true },
  })

  console.log(`共 ${products.length} 个商品待更新\n`)

  const categoryStats = {}
  let updated = 0

  for (const product of products) {
    const category = detectCategory(product.name)
    categoryStats[category] = (categoryStats[category] || 0) + 1

    const reviews = generateReviews(product)

    await prisma.product.update({
      where: { id: product.id },
      data: { reviews },
    })
    updated++
  }

  console.log('分类检测统计:')
  Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} 个商品`)
    })

  console.log(`\n✅ 已更新 ${updated} 个商品的评论数据`)
}

main()
  .catch(err => {
    console.error('失败:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
