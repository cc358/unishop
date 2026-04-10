require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const ebayService = require('../services/ebayService')

const prisma = new PrismaClient()

const luxuryCategories = [
  { name: "包包", keyword: "designer handbag authentic", minPrice: 300 },
  { name: "服装", keyword: "designer clothing luxury", minPrice: 200 },
  { name: "手表", keyword: "luxury watch automatic", minPrice: 300 },
  { name: "艺术品", keyword: "art painting sculpture collectible", minPrice: 200 },
  { name: "珠宝", keyword: "diamond gold jewelry", minPrice: 300 },
]

const luxuryReviews = [
  "做工精湛，用料考究，质感一流",
  "经典款式，永不过时，值得收藏",
  "细节处理完美，彰显品位",
  "正品品质，包装精美，非常满意",
  "佩戴舒适，光泽度好，很有档次",
  "投资收藏两相宜，非常推荐",
  "朋友都说很有品味，买得值",
  "质感和做工都无可挑剔",
  "成色很好，和专柜一样",
  "品质保证，每个细节都完美",
]
const userNames = ["品***鉴","尊***享","雅***士","金***主","奢***客","星***辰","海***风","云***淡","m***k","a***z","j***n","l***t"]

function generateReviews() {
  const count = Math.floor(Math.random() * 2) + 3
  const shuffled = [...luxuryReviews].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(text => ({
    username: userNames[Math.floor(Math.random() * userNames.length)],
    rating: Math.random() > 0.15 ? 5 : 4,
    text,
    date: new Date(Date.now() - (Math.floor(Math.random() * 90) + 1) * 86400000).toISOString().split('T')[0],
    verified: Math.random() > 0.15,
  }))
}

function isClean(title) {
  return !/18\+|adult|xxx|nude|erotic|replica|fake|knockoff/i.test(title)
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('=== 奢侈品高价商品同步 ===\n')

  // 找到奢侈品父分类
  const parentCat = await prisma.category.findFirst({ where: { name: '奢侈品', parentId: null } })
  if (!parentCat) { console.error('奢侈品分类不存在'); return }

  // 清空现有奢侈品商品
  const childCats = await prisma.category.findMany({ where: { parentId: parentCat.id } })
  const allIds = [parentCat.id, ...childCats.map(c => c.id)]
  const deleted = await prisma.product.deleteMany({ where: { categoryId: { in: allIds } } })
  console.log(`已清空 ${deleted.count} 条旧数据\n`)

  const results = []

  for (const cat of luxuryCategories) {
    console.log(`[${cat.name}] 最低 $${cat.minPrice} | "${cat.keyword}"`)

    // 确保子分类存在
    let child = await prisma.category.findFirst({ where: { name: cat.name, parentId: parentCat.id } })
    if (!child) child = await prisma.category.create({ data: { name: cat.name, parentId: parentCat.id } })

    let allItems = []
    for (let offset = 0; allItems.length < 50; offset += 50) {
      try {
        const data = await ebayService.searchProducts(cat.keyword, 50, offset, { minPrice: cat.minPrice })
        if (!data.items || data.items.length === 0) break
        allItems.push(...data.items.filter(i => isClean(i.title) && i.price >= cat.minPrice))
      } catch (err) {
        console.error(`  Error: ${err.message.substring(0, 60)}`)
        break
      }
      await sleep(800)
    }

    const seen = new Set()
    const unique = allItems.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true }).slice(0, 50)

    let inserted = 0
    let minP = Infinity, maxP = 0
    for (const item of unique) {
      minP = Math.min(minP, item.price)
      maxP = Math.max(maxP, item.price)
      try {
        await prisma.product.upsert({
          where: { ebayItemId: item.id },
          update: { name: item.title, price: item.price, currency: item.currency || 'USD', image: item.image, condition: item.condition || null, ebayUrl: item.itemWebUrl || null, sellerName: item.seller || null, sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }), reviews: generateReviews(), categoryId: child.id },
          create: { name: item.title, price: item.price, currency: item.currency || 'USD', image: item.image, stock: 10, sales: Math.floor(Math.random() * 50) + 5, condition: item.condition || null, ebayItemId: item.id, ebayUrl: item.itemWebUrl || null, source: 'ebay', categoryId: child.id, sellerName: item.seller || null, sellerFeedback: JSON.stringify({ score: item.sellerFeedbackScore || 0, percentage: item.sellerFeedbackPercentage || '99.0' }), reviews: generateReviews() },
        })
        inserted++
      } catch {}
    }

    console.log(`  → 入库 ${inserted} 条 | 价格: $${minP === Infinity ? 0 : minP.toFixed(2)} ~ $${maxP.toFixed(2)}`)
    results.push({ name: cat.name, inserted, minPrice: minP === Infinity ? 0 : minP, maxPrice: maxP })
    await sleep(1000)
  }

  const total = await prisma.product.count({ where: { categoryId: { in: allIds } } })
  console.log('\n=== 完成 ===\n')
  results.forEach(r => console.log(`  ${r.name}: ${r.inserted} 条 | $${r.minPrice.toFixed(2)} ~ $${r.maxPrice.toFixed(2)}`))
  console.log(`\n奢侈品总计: ${total} 条`)
}

main()
  .catch(err => { console.error('失败:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
