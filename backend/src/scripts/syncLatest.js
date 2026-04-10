require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const latestProducts = [
  { keyword: "iPhone 16 Pro", category: "手机" },
  { keyword: "iPhone 16", category: "手机" },
  { keyword: "MacBook Pro M4", category: "笔记本电脑" },
  { keyword: "MacBook Air M3", category: "笔记本电脑" },
  { keyword: "iPad Pro 2024", category: "平板电脑" },
  { keyword: "Apple Watch Series 10", category: "智能手表和配件" },
  { keyword: "AirPods Pro 2", category: "耳机和头戴式耳机" },
  { keyword: "Samsung Galaxy S25", category: "手机" },
  { keyword: "Samsung Galaxy Z Fold 6", category: "手机" },
  { keyword: "Samsung Galaxy Tab S10", category: "平板电脑" },
  { keyword: "Sony PlayStation 5", category: "视频游戏设备" },
  { keyword: "Sony WH-1000XM5", category: "耳机和头戴式耳机" },
  { keyword: "Sony A7 camera 2024", category: "相机" },
  { keyword: "Nike Air Max 2024", category: "运动男装" },
  { keyword: "Nike Jordan 2024", category: "运动男装" },
  { keyword: "Adidas Ultraboost 2024", category: "运动男装" },
  { keyword: "Dell XPS 2024", category: "笔记本电脑" },
  { keyword: "Lenovo ThinkPad 2024", category: "笔记本电脑" },
  { keyword: "ASUS ROG 2024", category: "电脑组装配件" },
  { keyword: "Nvidia RTX 4090", category: "电脑组装配件" },
  { keyword: "Dyson V15 vacuum", category: "清洁设备" },
  { keyword: "Dyson Airwrap 2024", category: "头发护理和造型" },
  { keyword: "Canon EOS R6 2024", category: "相机" },
  { keyword: "DJI drone 2024", category: "相机配件" },
  { keyword: "Meta Quest 3", category: "视频游戏设备" },
  { keyword: "Apple Vision Pro", category: "视频游戏设备" },
]

const reviewTemplates = {
  electronics: ["开机很快，系统流畅，电池续航比预期好","做工精致，手感很好，物超所值","性能强劲，日常使用完全够用","屏幕显示效果清晰，色彩还原度高","拍照效果很不错，夜景模式很惊艳","运行速度快，多任务切换无卡顿"],
  sports: ["颜值很高，上脚好看，跑步很舒适","质量不错，做工精细，穿了一个月没有任何问题","鞋型很正，穿着舒适，缓震效果好","轻便透气，跑步时毫无负担","包裹性好，脚感软弹，适合长时间穿着"],
  home: ["做工扎实，用料厚实，物超所值","功能齐全，操作简单，家人都很满意","质量很好，用了两个月没问题","安装简单，说明书详细，效果很好"],
}
const users = ["小***米","大***王","天***蓝","快***乐","阳***光","星***辰","海***风","云***淡","j***n","m***k","a***z","l***t"]

function detectType(keyword) {
  if (/Nike|Jordan|Adidas|shoe/i.test(keyword)) return 'sports'
  if (/Dyson|vacuum/i.test(keyword)) return 'home'
  return 'electronics'
}

function genReviews(keyword) {
  const type = detectType(keyword)
  const templates = reviewTemplates[type]
  const n = Math.floor(Math.random() * 2) + 3
  return [...templates].sort(() => Math.random() - 0.5).slice(0, n).map(text => ({
    username: users[Math.floor(Math.random() * users.length)],
    rating: Math.random() > 0.15 ? 5 : 4,
    text,
    date: new Date(Date.now() - (Math.floor(Math.random() * 60) + 1) * 86400000).toISOString().split('T')[0],
    verified: Math.random() > 0.15,
  }))
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 最新品牌商品追加 ===\n')

  // 缓存子分类 ID
  const catCache = {}
  async function getCatId(name) {
    if (catCache[name]) return catCache[name]
    const cat = await prisma.category.findFirst({ where: { name } })
    if (cat) { catCache[name] = cat.id; return cat.id }
    return null
  }

  let totalInserted = 0

  for (let i = 0; i < latestProducts.length; i++) {
    const item = latestProducts[i]
    const categoryId = await getCatId(item.category)
    if (!categoryId) {
      console.log(`[${i + 1}/${latestProducts.length}] ${item.keyword} — 分类 "${item.category}" 不存在，跳过`)
      continue
    }

    process.stdout.write(`[${i + 1}/${latestProducts.length}] ${item.keyword} ... `)

    let allItems = []
    for (let offset = 0; allItems.length < 50; offset += 50) {
      try {
        const data = await ebayService.searchProducts(item.keyword, 50, offset)
        if (!data.items || data.items.length === 0) break
        allItems.push(...data.items.filter(p => p.image && p.image.startsWith('http')))
      } catch (err) {
        console.error(`Error: ${err.message.substring(0, 50)}`)
        break
      }
      await sleep(700)
    }

    const seen = new Set()
    const unique = allItems.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true }).slice(0, 50)

    let inserted = 0
    for (const product of unique) {
      try {
        const existing = await prisma.product.findUnique({ where: { ebayItemId: product.id } })
        if (existing) continue
        await prisma.product.create({
          data: {
            name: product.title, price: product.price, currency: product.currency || 'USD', image: product.image,
            stock: 99, sales: Math.floor(Math.random() * 500) + 50, condition: product.condition || null,
            ebayItemId: product.id, ebayUrl: product.itemWebUrl || null, source: 'ebay', categoryId,
            sellerName: product.seller || null,
            sellerFeedback: JSON.stringify({ score: product.sellerFeedbackScore || 0, percentage: product.sellerFeedbackPercentage || '99.0' }),
            reviews: genReviews(item.keyword),
          },
        })
        inserted++
      } catch {}
    }

    console.log(`获取 ${unique.length}, 新增 ${inserted}`)
    totalInserted += inserted
    await sleep(800)
  }

  const total = await prisma.product.count({ where: { name: { not: '__EBAY_PLACEHOLDER__' } } })
  console.log(`\n=== 完成 ===`)
  console.log(`本次追加: ${totalInserted} 条`)
  console.log(`数据库总商品: ${total} 条`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
